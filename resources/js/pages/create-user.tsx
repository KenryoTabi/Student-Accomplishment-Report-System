import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { PlusCircleIcon, CirclePlusIcon, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { userColumns, User } from '@/components/columns';
import { users } from '@/routes';
import { Input } from '@headlessui/react';
import DeleteUser from '@/components/delete-user';


CreateUser.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: users(),
        },
    ],
};

type PageProps = {
    users: User[]
}


export default function CreateUser() {


    function displayUsers(): User[] {
        const { users } = usePage<PageProps>().props;

        console.log(users);

        return users;
    }

    function handleAddUser() {
        return(
            <>
                Hellow WOrld
            </>
        )
    }

    return (
        <>
            <Head title="Accomplishment" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DeleteUser/>
            </div>
        </>
    );
}