import { Head, Link, usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import LogInLayout from '@/pages/auth/login';
import { dashboard, login, register } from '@/routes';
import { Children } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <AuthLayout>
                <LogInLayout canRegister={false} canResetPassword={true} />
            </AuthLayout>
        </>
    );
}
