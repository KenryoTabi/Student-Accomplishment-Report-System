import { Head, Link, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { PlusCircleIcon, CirclePlusIcon, Search } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { userColumns, User } from '@/components/columns';
import { users } from '@/routes';
import { Input } from '@headlessui/react';


Users.layout = {
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


export default function Users() {


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
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">                    
                    
                    <DataTable columns={userColumns} data={displayUsers()}/>

                </div>
            </div>
        </>
    );
}


