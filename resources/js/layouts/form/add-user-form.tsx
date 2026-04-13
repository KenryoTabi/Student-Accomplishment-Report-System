import UserController from "@/actions/App/Http/Controllers/UserController";
import { User } from "@/components/columns";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";
import DialogLayout from "../dialog-layout";


type RoleOption = {
    id: number
    name: string
}

type SectionOption = {
    id: number
    name: string
}

type PageProps = {
    users: User[]
    roles: RoleOption[]
    sections: SectionOption[]
}

export default function AddUserForm() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(undefined);
    const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined);

    const resetFormRef = useRef<(() => void) | null>(null);

    const passwordInput = useRef<HTMLInputElement>(null);
    
    function getRoles(): RoleOption[] {
            const { roles } = usePage<PageProps>().props;
    
            return roles;
        }
    
    function getSections(): SectionOption[] {
        const { sections } = usePage<PageProps>().props;

        return sections;
    }

    function handleDialogOpenChange(open: boolean) {
        if (!open) {
            setSelectedRoleId(undefined);
            setSelectedSectionId(undefined);
            resetFormRef.current?.();
        }

        setDialogOpen(open);
    }
    return (
        <>
            <DialogLayout
                trigger={
                    <Button>
                        Create User
                    </Button>
                }
                title="Create User"
                description="Add a new user to the system. Fill in the details below."
            >
                {
                    ({ close, resetRef }) => (
                        <Form
                            {...UserController.store.form()}
                            resetOnSuccess
                            
                            onError={() => {
                                passwordInput.current?.focus();
                            }}
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => {
                            resetFormRef.current = resetAndClearErrors;

                            return (
                                <>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Enter full name"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter email address"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="role_id">Role</Label>
                                            <Select
                                                name="role_id"
                                                value={selectedRoleId}
                                                onValueChange={(value) => setSelectedRoleId(value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getRoles().map((role) => (
                                                        <SelectItem key={role.id} value={String(role.id)}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.role_id} />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="Enter phone number"
                                            />
                                            <InputError message={errors.phone} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="section_id">Section</Label>
                                        <Select
                                            name="section_id"
                                            value={selectedSectionId}
                                            onValueChange={(value) => setSelectedSectionId(value)}
                                        >
                                            <SelectTrigger className="w-full overflow-hidden">
                                                <SelectValue placeholder="Select a section" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getSections().map((section) => (
                                                    <SelectItem key={section.id} value={String(section.id)}>
                                                        {section.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.section_id} />
                                    </div>

                                    {getRoles().find((role) => String(role.id) === selectedRoleId)?.name === 'intern' ? (
                                        <div className="rounded-lg border border-muted p-4 bg-muted/50">
                                            <div className="mb-3 font-semibold">Intern / Student details</div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="grid gap-2 md:col-span-2">
                                                    <Label htmlFor="school">School</Label>
                                                    <Input
                                                        id="school"
                                                        name="school"
                                                        type="text"
                                                        placeholder="Enter school name"
                                                    />
                                                    <InputError message={errors.school} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="course">Course</Label>
                                                    <Input
                                                        id="course"
                                                        name="course"
                                                        type="text"
                                                        placeholder="Enter course or program"
                                                    />
                                                    <InputError message={errors.course} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="year_level">Year Level</Label>
                                                    <Input
                                                        id="year_level"
                                                        name="year_level"
                                                        type="text"
                                                        placeholder="Enter year level"
                                                    />
                                                    <InputError message={errors.year_level} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                ref={passwordInput}
                                                placeholder="Enter password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                placeholder="Confirm password"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={processing}>
                                            Create User
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        }
                        </Form>
                    )
                }
            </DialogLayout>
        </>
    )
}