import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar} from "@/components/ui/avatar.tsx";
import {AvatarImage} from "@radix-ui/react-avatar";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import MonthlyInteractionChart from "@/components/interaction-chart.tsx";
import Activities from "@/components/activities.tsx";
import {getLogUser} from "@/services/user/user.ts";
import {getDepartment} from "@/services/user/department/department.ts";
import {Separator} from "@radix-ui/react-separator";
import {
    getActiveSessions,
    getInteractionLogs,
    getSessions, InteractionLogsPaginatedFilterRequest,
    PaginatedFilterRequest
} from "@/services/interaction/interaction.ts";
import {getReader} from "@/services/reader/reader.ts";
import {getLocation} from "@/services/reader/location/location.ts";
import {Pin} from "lucide-react";
import {Constants} from "@/services/util/constants.ts";

interface ProfilePageProps {
    type: "users" | "readers";
    avatar: string | null;
    header: string;
    description: string;
    fields: { name: string; value: string; link: string | null }[];
    statistics: { name: string; value: string }[];
    interactionsTable: { user: boolean; reader: boolean; dateTime: boolean; logType: boolean };
    sessionsTable: { user: boolean; reader: boolean; sessionStart: boolean; sessionEnd: boolean };
}

export default function ProfilePage() {
    const {type, id} = useParams<{ type: ProfilePageProps["type"]; id: string }>();
    const [profileData, setProfileData] = useState<ProfilePageProps | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!type) {
                navigate("/*");
                return;
            }

            if (type === "users" && id) {

                try {
                    const user = await getLogUser(id);

                    const department = user.department ? await getDepartment(user.department) : null;

                    const sessionFilter: PaginatedFilterRequest = {
                        page: 1,
                        pageSize: 1,
                        userIds: [user.id],
                        readerIds: null,
                        from: null,
                        to: null,
                    }

                    const activeSession = (await getActiveSessions(sessionFilter)).items[0] ?? null;

                    const status = activeSession ? "Active at " + (await getReader(activeSession.logReaderId)).name : "Not Active";

                    const sessions = await getSessions(sessionFilter);

                    const interactionFilter: InteractionLogsPaginatedFilterRequest = {
                        ...sessionFilter,
                        interactionTypes: null
                    }

                    const interactions = await getInteractionLogs(interactionFilter)

                    const userProfileData: ProfilePageProps = {
                        type: "users",
                        avatar: Constants.GRINGOTTS_USER_PHOTOS_URL + "/" + user.id + ".png",
                        header: user.lastName + ", " + user.firstName + " " + ((user.middleName ?? user.middleName) ?? ""),
                        description: "User Profile Details",
                        fields: [
                            {name: "School Id", value: user.schoolId, link: null},
                            {name: "Card Id", value: user.cardId, link: null},
                            {name: "Sex", value: user.sex === 0 ? 'Male' : 'Female', link: null},
                            {
                                name: "Affiliation",
                                value: user.affiliation === 0 ? 'Student' : user.affiliation === 1 ? 'Faculty' : user.affiliation === 2 ? 'Staff' : 'Administrator',
                                link: null
                            },
                            {name: "Department", value: department?.name ?? "No Department", link: null},
                        ],
                        statistics: [
                            {name: "Total Interactions", value: interactions.totalRecords.toString()},
                            {name: "Total Sessions", value: sessions.totalRecords.toString()},
                            {name: "Status", value: status},
                            {name: "---------", value: "Coming Soon"}
                        ],
                        interactionsTable: {user: true, reader: true, dateTime: true, logType: true},
                        sessionsTable: {user: true, reader: true, sessionStart: true, sessionEnd: true}
                    };

                    setProfileData(userProfileData);
                } catch (_) {
                    navigate("/*")
                }
            } else if (type === "readers" && id) {
                try {
                    const reader = await getReader(id);

                    const location = reader.location ? await getLocation(reader.location) : null;

                    const sessionFilter: PaginatedFilterRequest = {
                        page: 0,
                        pageSize: 0,
                        userIds: null,
                        readerIds: [reader.id],
                        from: null,
                        to: null,
                    }

                    const activeSession = await getActiveSessions(sessionFilter);

                    const sessions = await getSessions(sessionFilter);

                    const interactionFilter: InteractionLogsPaginatedFilterRequest = {
                        ...sessionFilter,
                        interactionTypes: null
                    }

                    const interactions = await getInteractionLogs(interactionFilter)

                    const readerProfileData: ProfilePageProps = {
                        type: "readers",
                        avatar: null,
                        header: reader.name,
                        description: "Reader Details",
                        fields: [
                            {
                                name: "Location",
                                value: location ? location.buildingName + " - " + location.roomName : "No Location",
                                link: null
                            }
                        ],
                        statistics: [
                            {name: "Total Interactions", value: interactions.totalRecords.toString()},
                            {name: "Total Sessions", value: sessions.totalRecords.toString()},
                            {name: "Active Users", value: activeSession.totalRecords.toString()},
                            {name: "---------", value: "Coming Soon"}
                        ],
                        interactionsTable: {user: true, reader: true, dateTime: true, logType: true},
                        sessionsTable: {user: true, reader: true, sessionStart: true, sessionEnd: true}
                    };

                    setProfileData(readerProfileData);
                } catch (_) {
                    navigate("/*");
                }
            }
        }

        fetchProfile();
    }, [type, id, navigate]);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 p-3 gap-3">
            <Card className="col-span-full flex flex-col lg:col-span-full lg:row-span-2">
                <CardHeader className="border-b border-primary bg-secondary">
                    <CardTitle className="flex justify-around">
                        <div className="flex items-center gap-4">
                            {profileData.avatar ? (
                                <Avatar className="w-24 h-24 border-[2px] border-primary">
                                    <AvatarImage src={profileData.avatar}/>
                                </Avatar>
                            ) : (<Pin size="50px"></Pin>)}

                            <div>
                                <h1 className="text-xl font-bold text-primary">{profileData.header}</h1>
                                <p className="text-gray-400">{profileData.description}</p>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent
                    className="flex flex-col md:flex-row lg:flex-row justify-around items-center gap-4 w-full pt-[20px] text-center">

                    {profileData.fields.map((field, index) => (
                        <>
                            <div>
                                {
                                    field.link ?
                                        <button className="text-lg text-primary font-semibold hover:underline"
                                                onClick={() => navigate(field.link || "/")}>{field.value}</button> :
                                        <h1 className="text-lg text-primary font-semibold">{field.value}</h1>
                                }

                                <p className="text-md text-gray-400">{field.name}</p>
                            </div>

                            {index !== profileData.fields.length - 1 &&
                                <Separator orientation="vertical" className="h-full w-[1px] bg-gray-300 bg-primary"/>}
                        </>
                    ))}
                </CardContent>
            </Card>

            <Card className="col-span-full lg:col-span-6 lg:row-span-2">
                <CardHeader className="border-b">
                    <CardTitle>
                        <button className="hover:underline text-primary" onClick={() => navigate("/dashboard/logs")}>
                            Logs Overview
                        </button>
                    </CardTitle>
                    <CardDescription>
                        {profileData.type === "users" ? "User activity logs within ($MONTH)" : "Reader interaction logs within ($MONTH)"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="py-10">
                    <MonthlyInteractionChart
                        type={type!}
                        id={id ?? null}
                        activeBars={{
                            entryCount: false,
                            exitCount: false,
                            unauthorizedCount: false,
                            fallbackCount: false,
                            totalCount: true
                        }}
                    />
                </CardContent>
            </Card>

            {profileData.statistics.slice(0, 4).map((stat, index) => (
                <Card key={index}
                      className="min-h-[200px] bg-secondary col-span-1 lg:col-span-2 flex flex-col justify-center items-center text-center">
                    <CardHeader>
                        <CardTitle className="text-[30px] font-bold text-primary">
                            <h1>{stat.value}</h1>
                        </CardTitle>
                        <p className="text-md text-gray-400">{stat.name}</p>
                    </CardHeader>
                </Card>
            ))}

            <div className="col-span-full">
                <Activities size={15} type={type} id={id ?? ""}/>
            </div>
        </div>
    );
}
