import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Avatar} from "@/components/ui/avatar.tsx";
import {AvatarImage} from "@radix-ui/react-avatar";
import {Separator} from "@radix-ui/react-separator";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import MonthlyInteractionChart from "@/components/interaction-chart.tsx";
import SomeTable from "@/components/some-table.tsx";

interface ProfilePageProps {
    type: "users" | "readers",
    avatar: string | null,
    header: string,
    description: string,
    fields: {
        name: string,
        value: string,
        link: string | null
    }[],
    graphData: {
        name: string,
        value: number
    }[],
    statistics: {
        name: string,
        value: string
    }[],
    interactionsTable: {
        user: boolean,
        reader: boolean,
        dateTime: boolean,
        logType: boolean
    },
    sessionsTable: {
        user: boolean,
        reader: boolean,
        sessionStart: boolean,
        sessionEnd: boolean
    }
}

const profileDataMap: Record<ProfilePageProps["type"], ProfilePageProps> = {
    users: {
        type: "users",
        avatar: "https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp",
        header: "Doe, John",
        description: "User Profile Details",
        fields: [
            {name: "Full Name", value: "John Doe", link: null},
            {name: "Full Name", value: "John Doe", link: null},
            {name: "Full Name", value: "John Doe", link: null},
            {name: "Full Name", value: "John Doe", link: null},
            {name: "Full Name", value: "John Doe", link: "1234"}
        ],
        graphData: [],
        statistics: [
            {name: "Stats Header 1", value: "Stats Value 1"},
            {name: "Stats Header 2", value: "Stats Value 2"},
            {name: "Stats Header 3", value: "Stats Value 3"},
            {name: "Stats Header 4", value: "Stats Value 4"}
        ],
        interactionsTable: {user: true, reader: true, dateTime: true, logType: true},
        sessionsTable: {user: true, reader: true, sessionStart: true, sessionEnd: true}
    },
    readers: {
        type: "readers",
        avatar: null,
        header: "Reader Profile",
        description: "Reader Profile Details",
        fields: [],
        graphData: [],
        statistics: [],
        interactionsTable: {user: true, reader: false, dateTime: true, logType: true},
        sessionsTable: {user: true, reader: false, sessionStart: true, sessionEnd: true}
    }
};

export default function ProfilePage() {
    const {type, id} = useParams<{ type: ProfilePageProps["type"]; id: string }>();
    const navigate = useNavigate();

    console.log(type);
    console.log(id);

    useEffect(() => {
        if (!type || !profileDataMap[type]) {
            navigate("/dashboard/overview");
        }
    }, [type, navigate]);

    if (!type || !profileDataMap[type]) {
        return null; // Prevent rendering while navigating
    }

    const profileData = profileDataMap[type];

    // Card Header - bg-[#E7F6E3]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 p-3 gap-3">

            <Card className="col-span-full flex flex-col md:col-span-full lg:col-span-full lg:row-span-2 lg:flex-col">
                <CardHeader className="border-b">
                    <CardTitle className="flex justify-around">
                        <div className="flex items-center gap-4">
                            {
                                profileData.avatar &&
                                <Avatar className="w-24 h-24 border-[2px] border-primary">
                                    <AvatarImage
                                        src={profileData.avatar}/>
                                </Avatar>
                            }

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
                                <Separator orientation="vertical" className="h-full w-[3px] bg-gray-300 bg-muted"/>}
                        </>
                    ))}
                </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-full lg:col-span-6 lg:row-span-2">
                <CardHeader className="border-b">
                    <CardTitle>
                        <button className="hover:underline text-primary"
                                onClick={() => navigate("/dashboard/logs")}>Logs Overview
                        </button>
                    </CardTitle>
                    <CardDescription>
                        {
                            (() => {
                                switch (profileData.type) {
                                    case "users":
                                        return <>User activity logs within ($MONTH)</>;
                                    case "readers":
                                        return <>Reader interaction logs within ($MONTH)</>;
                                }
                            })()
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="py-10">
                    <MonthlyInteractionChart type={"overall"} id={null}></MonthlyInteractionChart>
                </CardContent>
            </Card>
            {
                profileData.statistics.slice(0, 4).map((value, _) => (
                    <>
                        <Card
                            className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col justify-center items-center text-center">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-primary">
                                    <h1>{value.value}</h1>
                                </CardTitle>
                                <p className="text-md text-gray-400">{value.name}</p>
                            </CardHeader>
                        </Card>
                    </>
                ))
            }
            <div className="col-span-full">
                <SomeTable></SomeTable>
            </div>
        </div>
    )
}