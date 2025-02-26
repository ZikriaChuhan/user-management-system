"use client"
import { useEffect } from "react";
import { useSession, signOut} from "next-auth/react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogOut, CircleUser, SlidersHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function AdminHeader() {

    const router = useRouter();
        const { data: session, status } = useSession();
    
        useEffect(() => {
            if (status === "unauthenticated") {
                router.push("/login");
            }
        }, [status, router]);
    
        if (!session) return <p>Loading</p>;

    return (
        <header className=" flex justify-between px-3 py-2 bg-sidebar">
            <SidebarTrigger />

            <div className="flex items-center justify-center gap-7">
                <ModeToggle />

                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <div className="cursor-pointer flex items-center justify-center gap-2">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>ZC</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">Welcome!</span>
                                <span className="truncate font-semibold">{session.user.name}</span>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="p-0 font-normal w-[12rem]">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="rounded-lg">ZC</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{session.user.name}</span>
                                    <span className="truncate text-xs">{session.user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <CircleUser /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SlidersHorizontal /> Setting
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut /> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

        </header>
    );
}