"use client";
import { Input, Select, SelectItem, addToast, ToastProvider } from "@heroui/react";
import { Home, UserPlus, UserRoundCog, ChevronRight, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AddUser() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
    });
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const addUser = async () => {
        for (const [key, value] of Object.entries(form)) {
            if (!value) {
                try {
                    addToast({
                        hideIcon: true,
                        title: "Missing Field",
                        description: `Please fill in the ${key} field`,
                        color: "danger",
                        classNames: {
                            closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
                        },
                        closeIcon: <CircleX />,
                    });
                } catch (error) {
                    console.error("Toast Error:", error);
                }
                return;
            }
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("role", form.role);
        formData.append("password", form.password);

        try {
            const response = await fetch("/api/auth/adduser", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                console.log("User added Successful:", data);
                router.push("/admin/users")
            } else {
                console.log(`Error: ${response.status} - ${response.statusText}`);
            }

        } catch (error) {
            console.log("Error logging in:", error);
        }
    };

    return (

        <section>
            <ToastProvider placement="top-center" />
            <div className="flex justify-between p-5">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"> <Home className=" size-4" /> Dashboard </Link>
                        </li>
                        <li className="inline-flex items-center">
                            <div className="flex items-center">
                                <ChevronRight className=" size-4" />
                                <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"> <UserPlus className=" size-4" /> Users </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <ChevronRight className=" size-4" />
                                <span className="ms-1 flex items-center text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400"><UserRoundCog className=" size-4" /> Add User</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <Button onClick={addUser}> Save </Button>
            </div>
            <div className="p-5">
                <div className="bg-sidebar flex flex-col gap-6 rounded-lg p-5">

                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input label="Name" type="text" variant="underlined" isRequired name="name" value={form.name} onChange={handleChange} />
                        <Input label="Email" type="email" variant="underlined" isRequired name="email" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                        <Input label="Password" type="password" variant="underlined" isRequired name="password" value={form.password} onChange={handleChange} />
                        <Select className="max-w-xs" label="Select Role" variant="underlined" isRequired name="role" selectedKeys={[form.role]} onChange={handleChange}>
                            <SelectItem key="admin">Admin</SelectItem>
                            <SelectItem key="employee">Employee</SelectItem>
                        </Select>
                    </div>

                </div>
            </div>
        </section>
    );
}