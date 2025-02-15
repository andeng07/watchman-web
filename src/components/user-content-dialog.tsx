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
import {Avatar} from "@/components/ui/avatar.tsx";
import {AvatarImage} from "@radix-ui/react-avatar";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";

interface UserPreviewContent {
    id: string,
    name: string,
    sex: "Male" | "Female",
    cardId: string,
    department: string,
    affiliation: "Student" | "Faculty" | "Staff" | "Administrator"
}

interface UserPreviewContentProps {
    userContent: UserPreviewContent;
}

// TODO: Optimization - fetch the data from here, and just rely from the userId

export function UserPreviewDialog({userContent}: UserPreviewContentProps) {
    const navigate = useNavigate();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="text-primary hover:underline">{userContent.name}</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription>
                        <div className="flex flex-col gap-5">
                            {/* Avatar with Row Span 2 */}
                            <div className="flex items-center gap-4">
                                <Avatar className="w-24 h-24 border-2 border-primary">
                                    <AvatarImage
                                        src="https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp"/>
                                </Avatar>

                                <div>
                                    <h2 className="text-xl font-bold">{userContent.name}</h2>
                                    <p className="text-gray-400">{userContent.sex}</p>
                                </div>
                            </div>

                            <Separator/>

                            {/* Card ID */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary">Card ID</h3>
                                <p className="text-gray-400">{userContent.cardId}</p>
                            </div>

                            {/* Department */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary">Department</h3>
                                <p className="text-gray-400">{userContent.department}</p>
                            </div>

                            {/* Affiliation */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary pb-2">Affiliation</h3>
                                <Badge variant="secondary">{userContent.affiliation}</Badge>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => navigate(`/dashboard/users/${userContent.id}`)}>More</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
