import { Form, Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { PlusCircleIcon, CirclePlusIcon, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { userColumns, User } from '@/components/columns';
import { users } from '@/routes';
import { Input } from '@/components/ui/input';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PasswordInput from '@/components/password-input';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRef } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';


Users.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: users(),
        },
    ],
};

type RoleOption = {
    id: number
    name: string
}

type PageProps = {
    users: User[]
    roles: RoleOption[]
}


export default function Users() {
    const passwordInput = useRef<HTMLInputElement>(null);

    function displayUsers(): User[] {
        const { users } = usePage<PageProps>().props;

        return users;
    }

    function getRoles(): RoleOption[] {
        const { roles } = usePage<PageProps>().props;

        return roles;
    }

    return (
        <>
            <Head title="Accomplishment" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                
                <div className='flex gap-4 w-full'>
                    <div className='flex-1'>
                        <Input placeholder='Search Users' className='w-full rounded-lg border border-sidebar-border/70 dark:border-sidebar-border bg-transparent py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary' />
                    </div>
                    <div className='ml-auto'>
                        <Link 
                            className='flex flex-row gap-2 text-black bg-white py-2 px-4 cursor-pointer rounded-lg border text-sm font-sm align-center' 
                            as='button'
                            // href={"/users/create"}
                        >Search User <Search className='size-5'/></Link>
                    </div>

                    <div className='ml-auto'>
                        <Link 
                            className='flex flex-row gap-2 text-black bg-white py-2 px-4 cursor-pointer rounded-lg border text-sm font-sm align-center' 
                            as='button'
                            href={"/users/create"}
                        >Add User <CirclePlusIcon className='size-5'/></Link>
                    </div>
                    
                    <div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    Create User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogTitle>
                                    Create User
                                </DialogTitle>
                                <DialogDescription>
                                    Add a new user to the system. Fill in the details below.
                                </DialogDescription>
                                <Form
                                    {...UserController.store.form()}
                                    resetOnSuccess
                                    onError={() => {
                                        passwordInput.current?.focus();
                                    }}
                                    className="space-y-4"
                                >
                                    {({ processing, errors }) => (
                                        <>
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
                                                <Label htmlFor="employee_id">Employee ID</Label>
                                                <Input
                                                    id="employee_id"
                                                    name="employee_id"
                                                    type="text"
                                                    placeholder="Enter employee ID"
                                                />
                                                <InputError message={errors.employee_id} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="role_id">Role</Label>
                                                <Select name="role_id">
                                                    <SelectTrigger>
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
                                                <Label htmlFor="department">Department</Label>
                                                <Input
                                                    id="department"
                                                    name="department"
                                                    type="text"
                                                    placeholder="Enter department"
                                                />
                                                <InputError message={errors.department} />
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
                                            <DialogFooter>
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
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">                    
                    
                    <DataTable columns={userColumns} data={displayUsers()}/>

                </div>
            </div>
        </>
    );
}


