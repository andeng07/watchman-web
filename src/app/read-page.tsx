import {useNavigate, useParams} from "react-router-dom";
import {FormEvent, useEffect, useRef, useState} from "react";
import {getReader, Reader} from "@/services/reader/reader.ts";
import {getLocation, Location} from "@/services/reader/location/location.ts";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar} from "@/components/ui/avatar.tsx";
import {AvatarImage} from "@radix-ui/react-avatar";
import {addInteractionLog, AddInteractionRequest, InteractionLog} from "@/services/interaction/interaction.ts";
import {getLogUser, LogUser} from "@/services/user/user.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {Constants} from "@/services/util/constants.ts";

async function handleCardId(cardId: string, reader: string): Promise<InteractionLog> {
    console.log(reader);

    const request: AddInteractionRequest = {
        logReaderId: reader,
        cardId: cardId,
        dateTime: new Date().toISOString(),
    };

    return await addInteractionLog(request);
}

// Function to get variant based on interactionType
const getVariant = (interactionType?: number) => {
    switch (interactionType) {
        case 0:
            return "entry"; // Entry (Welcome)
        case 1:
            return "exit"; // Exit (Access Denied)
        case 2:
            return "unauthorized"; // Unauthorized
        case 3:
            return "fallback"; // Fallback
        default:
            return "fallback"; // Default case
    }
};

// Function to get text based on interactionType
const getInteractionText = (interactionType?: number) => {
    switch (interactionType) {
        case 0:
            return "Entry Granted";
        case 1:
            return "Exit Granted";
        case 2:
            return "Action Unauthorized";
        case 3:
            return "User Unknown";
        default:
            return "UNKNOWN!";
    }
};

export default function InteractionLogForm() {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    const [data, setData] = useState<{ reader: Reader | null; location: Location | null }>({
        reader: null,
        location: null,
    });

    const [cardId, setCardId] = useState<string>("");
    const [status, setStatus] = useState<"idle" | "read">("idle");

    const [addInteractionLogResponse, setAddInteractionLogResponse] = useState<
        InteractionLog & { user?: LogUser | null } | null
    >(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                navigate("/dashboard/overview");
                return;
            }

            const reader = await getReader(id);
            const location = await getLocation(reader?.location ?? "");
            setData({reader, location});
        };

        fetchData();
    }, [id, navigate]);

    useEffect(() => {
        if (status === "idle") {
            inputRef.current?.focus();
        }
    }, [status]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!cardId.trim() || !data.reader) return;

        setStatus("read");

        try {
            const response = await handleCardId(cardId.trim(), data.reader.id);

            const user = response.logUserId ? await getLogUser(response.logUserId) : null;

            setAddInteractionLogResponse({...response, user});
        } catch (error) {
            console.error("Failed to add interaction log:", error);
        }

        setTimeout(() => {
            setStatus("idle");
            setCardId("");
            setAddInteractionLogResponse(null)
        }, 2000);

    };

    console.log(location)
    console.log(data.location)

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full flex-col gap-3 text-center items-center">
                {status === "idle" && (
                    <>
                        <h1 className="text-primary font-extrabold text-[50px]">WELCOME!</h1>
                        <h2 className="text-gray-500 font-bold text-[30px]">
                            You're currently
                            at {data.location ? `${data.location.buildingName + " " + data.location.roomName}` : "Unknown Location"}
                        </h2>
                        <p className="text-primary font-semibold text-[20px]">Please tap your RFID Card to the reader to
                            proceed</p>
                    </>
                )}

                {status === "read" && (
                    <>
                        <div className="pb-10">
                            <h2 className="text-gray-500 font-bold text-[30px]">
                                You're currently
                                at {data.location ? `${data.location.buildingName} ${data.location.roomName}` : "Unknown Location"}
                            </h2>
                        </div>
                        <Card className="w-full max-w-md text-center items-center content-center">
                            <div className="pt-5">
                                <Badge variant={getVariant(addInteractionLogResponse?.interactionType)}
                                       className="text-[30px]">
                                    {getInteractionText(addInteractionLogResponse?.interactionType)}
                                </Badge>
                            </div>
                            <CardHeader>
                                <div className="flex flex-col justify-center items-center gap-4">
                                    <Avatar className="w-[200px] h-[200px] border-2 border-primary">
                                        <AvatarImage
                                            src={Constants.GRINGOTTS_USER_PHOTOS_URL + "/" + addInteractionLogResponse?.user?.id + ".png"}/>
                                    </Avatar>
                                    <div>
                                        <CardTitle
                                            className="text-xl font-bold">{addInteractionLogResponse?.user ? (addInteractionLogResponse.user.lastName + ", " + addInteractionLogResponse.user.firstName + " " + (addInteractionLogResponse.user.middleName ?? "")) : "N/A"}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </>
                )}

                <form onSubmit={handleSubmit} className="w-full max-w-sm py-[50px]">
                    <Input
                        ref={inputRef}
                        className="w-full text-center"
                        placeholder="Enter Card ID"
                        value={cardId}
                        onChange={(e) => setCardId(e.target.value)}
                        disabled={status === "read"}
                        required
                        autoFocus
                    />
                </form>
            </div>
        </div>
    );
}
