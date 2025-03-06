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
import {addLogUser, LogUserProps, addLogUserPhoto, LogUser, updateLogUser} from "@/services/user/user.ts";
import * as React from "react";
import { Department, DepartmentFilter, getDepartments } from "@/services/user/department/department.ts";

export function NewUserAlertDialog({trigger, userProps} : {trigger: React.ReactNode, userProps: LogUser | null }) {
    const [formData, setFormData] = useState<LogUserProps>(userProps ?? {
        accessExpiry: new Date().toISOString(),
        cardId: "",
        schoolId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        affiliation: 0,
        sex: 0,
        department: "",
    });

    const [photo, setPhoto] = useState<File | null>(null); // State for photo upload

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const localDate = new Date(e.target.value);
        setFormData((prev) => ({ ...prev, accessExpiry: localDate.toISOString() }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPhoto(e.target.files[0]); // Set the selected file
        }
    };

    const filter: DepartmentFilter = {
        page: 1,
        pageSize: 999,
        searchTerm: null
    };

    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartments(filter);
                setDepartments(response.items);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    const handleSubmit = async () => {
        try {
            // First, create the user
            console.log(userProps ? "exist" : "not exist");

            const user = await (userProps ? updateLogUser(userProps!.id, formData) : addLogUser(formData));
            console.log("User created:", user);

            // If a photo is selected, upload it
            if (photo) {
                const uploadResponse = await addLogUserPhoto(user.id, photo);
                console.log("Photo uploaded:", uploadResponse);
            }
        } catch (error) {
            console.error("Error creating user or uploading photo:", error);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm User Creation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to create this user? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-4">
                    <div>
                        <Label htmlFor="cardId">Card ID</Label>
                        <Input required id="cardId" name="cardId" value={formData.cardId} onChange={handleInputChange} />
                    </div>

                    <div>
                        <Label htmlFor="schoolId">School ID</Label>
                        <Input id="schoolId" name="schoolId" value={formData.schoolId} onChange={handleInputChange} />
                    </div>

                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input required id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                    </div>

                    <div>
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input required id="middleName" name="middleName" value={formData.middleName || ""} onChange={handleInputChange} />
                    </div>

                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input required id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                    </div>

                    <div>
                        <Label htmlFor="affiliation">Affiliation</Label>
                        <select
                            id="affiliation"
                            name="affiliation"
                            value={formData.affiliation}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value={0}>Student</option>
                            <option value={1}>Faculty</option>
                            <option value={2}>Staff</option>
                            <option value={3}>Administrator</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="sex">Sex</Label>
                        <select
                            id="sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value={0}>Male</option>
                            <option value={1}>Female</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="department">Department</Label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department ?? ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="accessExpiry">Access Expiry</Label>
                        <Input type="datetime-local" id="accessExpiry" name="accessExpiry" onChange={handleDateChange} />
                    </div>

                    <div>
                        <Label htmlFor="photo">Upload Photo</Label>
                        <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleSubmit}>
                            Confirm
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
