"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AdminHeader from "../components/admin-header";
import { useRouter } from "next/navigation";
import { useSession} from "next-auth/react";
import { useEffect } from "react";

export default function AuthLayout({ children }) {

    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            alert("Session Expired");
            router.push("/login");
        }
    }, [status, router]);

    if (!session) return <p>Loading...</p>;

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className=" w-full">
                    <AdminHeader />
                    {children}
                </main>
            </SidebarProvider>

        </>

    );
}
