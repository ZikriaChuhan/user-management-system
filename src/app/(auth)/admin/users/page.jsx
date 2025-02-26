"use client";
import { Home, UserPlus, ChevronRight, UserRoundCog} from "lucide-react"
import UserTable from "../../components/user-table";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Users() {

    const router = useRouter();
    const addProduct = () => {
        router.push("/admin/add-user");
      };

    return (
        <section>

            <div className="flex justify-between p-5">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"> <Home className=" size-4" /> Dashboard </Link>
                        </li>

                        <li aria-current="page">
                            <div className="flex items-center">
                                <ChevronRight className=" size-4" />
                                <span className="ms-1 flex items-center text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"><UserPlus className=" size-4" /> Products</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                    <Button onClick={addProduct}> <UserRoundCog /> Add New </Button>
            </div>

            <div className="flex mt-8 p-4">
                <UserTable />
            </div>
        </section>
    );
}
