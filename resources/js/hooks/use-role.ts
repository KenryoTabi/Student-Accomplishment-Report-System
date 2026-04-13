import { usePage } from "@inertiajs/react";

export function useAuth() {
    return usePage().props.auth;
}

export function useRole() {
    const { user } = useAuth();

    const roleId = user?.role_id ?? 0;

    return {
        roleId,
        isAdmin: roleId === 1,
        isEmployee: roleId === 2,
        isStudent: roleId === 3,
    };
}