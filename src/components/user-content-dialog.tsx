import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {useNavigate} from "react-router-dom";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {LogUser} from "@/services/user/user.ts";
import {useEffect, useState} from "react";
import {getDepartment} from "@/services/user/department/department.ts";
import {Constants} from "@/services/util/constants.ts";

interface UserPreviewContent {
    id: string,
    name: string,
    sex: "Male" | "Female",
    cardId: string,
    department: string,
    affiliation: "Student" | "Faculty" | "Staff" | "Administrator"
}

export function UserPreviewDialog({user}: {user: LogUser}) {
    const navigate = useNavigate();
    const [userPreviewContent, setUserPreviewContent] = useState<UserPreviewContent>()

    useEffect(() => {
        const fetchUserPreview = async () => {
            const userDepartment = user.department ? (await getDepartment(user.department)).name : "No Department";

            const previewContent: UserPreviewContent = {
                id: user.id,
                name: user.lastName + ", " + user.firstName + " " + ((user.middleName ?? user.middleName) ?? ""),
                sex: user.sex === 0 ? 'Male' : 'Female',
                cardId: user.cardId,
                department: userDepartment,
                affiliation: user.affiliation === 0 ? 'Student' : user.affiliation === 1 ? 'Faculty' : user.affiliation === 2 ? 'Staff' : 'Administrator'
            }

            setUserPreviewContent(previewContent)
        }

        fetchUserPreview()
    }, [user.affiliation, user.cardId, user.department, user.firstName, user.id, user.lastName, user.middleName, user.sex]);

    if (!userPreviewContent) {
        return <div>Loading...</div>; // Render loading state or similar when content is not yet loaded
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="text-primary hover:underline">{userPreviewContent.name}</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription>
                        <div className="flex flex-col gap-5">
                            {/* Avatar with Row Span 2 */}
                            <div className="flex items-center gap-4">
                                <Avatar className="w-24 h-24 border-2 border-primary">
                                    <AvatarImage
                                        src={Constants.GRINGOTTS_USER_PHOTOS_URL + "/" + user.id + ".png"}/>
                                </Avatar>

                                <div>
                                    <h2 className="text-xl font-bold">{userPreviewContent.name}</h2>
                                    <p className="text-gray-400">{userPreviewContent.sex}</p>
                                </div>
                            </div>

                            <Separator/>

                            {/* Card ID */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary">Card ID</h3>
                                <p className="text-gray-400">{userPreviewContent.cardId}</p>
                            </div>

                            {/* Department */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary">Department</h3>
                                <p className="text-gray-400">{userPreviewContent.department}</p>
                            </div>

                            {/* Affiliation */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary pb-2">Affiliation</h3>
                                <Badge variant="secondary">{userPreviewContent.affiliation}</Badge>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => navigate(`/dashboard/users/${userPreviewContent.id}`)}>More</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
