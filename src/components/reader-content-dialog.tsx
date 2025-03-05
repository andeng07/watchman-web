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
import {Separator} from "@/components/ui/separator.tsx";
import {useEffect, useState} from "react";
import {Reader} from "@/services/reader/reader.ts";
import {getLocation} from "@/services/reader/location/location.ts";
import {Pin} from "lucide-react";

interface ReaderPreviewContent {
    id: string,
    name: string,
    location: string | null
}

export function ReaderPreviewDialog({reader}: {reader: Reader}) {
    const navigate = useNavigate();
    const [readerPreviewContent, setReaderPreviewContent] = useState<ReaderPreviewContent>()

    useEffect(() => {
        const fetchUserPreview = async () => {
            const location = reader.location ? (await getLocation(reader.location)) : null;
            
            const locationString = location ? (location.buildingName + " " + location.roomName) : "No Location";

            const previewContent: ReaderPreviewContent = {
                id: reader.id,
                name: reader.name,
                location: locationString,
            }

            setReaderPreviewContent(previewContent)
        }

        fetchUserPreview()
    }, [reader.id, reader.location, reader.name]);

    if (!readerPreviewContent) {
        return <div>Loading...</div>; // Render loading state or similar when content is not yet loaded
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="text-primary hover:underline">{readerPreviewContent.name}</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription>
                        <div className="flex flex-col gap-5">
                            {/* Avatar with Row Span 2 */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Pin></Pin>
                                    <h2 className="text-xl font-bold">{readerPreviewContent.name}</h2>
                                </div>
                            </div>

                            <Separator/>

                            {/* Card ID */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary">{readerPreviewContent.location}</h3>
                                <p className="text-gray-400">Location</p>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => navigate(`/dashboard/readers/${readerPreviewContent.id}`)}>More</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
