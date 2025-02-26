"use client"
import { ModeToggle } from "@/components/mode-toggle";
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation";
import { useSession} from "next-auth/react";
import { useEffect } from "react";
import zIcon from "../../z-icon.png"
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/admin/dashboard");
        }
    }, [status, router]);

    if (!session) return <p>Loading...</p>;

  return (
    
    <div
      className="flex  min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className=" absolute right-4 top-4" >
        <ModeToggle />
        </div>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Image src={zIcon} alt="Logo" width={1000} className="size-4" />
          </div>
          zikchu.
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
