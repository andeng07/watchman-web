import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import {addReader, Reader, ReaderProps, updateReader} from "@/services/reader/reader.ts";
import {getLocations, Location, LocationFilter} from "@/services/reader/location/location.ts";

export function NewReaderAlertDialog({trigger, reader}: {trigger: React.ReactNode, reader: Reader | null}) {
    const [formData, setFormData] = useState<ReaderProps>(reader ?? {
        name: "",
        location: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const filter: LocationFilter = {
        page: 1,
        pageSize: 999,
        searchTerm: null
    }

    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await getLocations(filter);
                setLocations(response.items);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, []);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Reader Creation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to create this reader? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-3">
                    <div>
                        <Label htmlFor="name">Reader Name</Label>
                        <Input required id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>

                    <div>
                        <Label htmlFor="location">Location</Label>
                        <select
                            id="location"
                            name="location"
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select a location</option>
                            {
                                locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.buildingName} {location.roomName ? `- ${location.roomName}` : ""}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={() => reader ? updateReader(reader.id, formData) : addReader(formData)}>
                            Confirm
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
