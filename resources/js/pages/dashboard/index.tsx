
import {Head, usePage} from "@inertiajs/react";
import AdminDashboard from "@/pages/dashboard/admin-dashboard";
import EmployeeDashboard from "@/pages/dashboard/employee-dashboard";
import StudentDashboard from "@/pages/dashboard/student-dashboard";

export default function Dashboard() {
    const {auth, roles} = usePage().props;
    console.log(auth.user.role_id);
    console.log(roles);
    
    return (
        <>
            {auth.user.role_id === 1 && <AdminDashboard />}
            {auth.user.role_id === 2 && <EmployeeDashboard />}
            {auth.user.role_id === 3 && <StudentDashboard />}
        </>
    )
}