"use client";
import { Input, Select, SelectItem, addToast, ToastProvider } from "@heroui/react";
import { Home, User, ChevronRight, UserPlus, CircleX } from "lucide-react"
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import Link from "next/link";

export default function UpdateUser() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
    });
    const router = useRouter();
    const { id } = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchTableUser = async () => {
            try {
                const response = await fetch(`/api/users/${id}`);
                const data = await response.json();
                setForm({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    role: data.user.role || "",
                    password: "",
                });

            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchTableUser();
    }, [id]);

    const updateUser = async () => {
        for (const [key, value] of Object.entries(form)) {
            if (!value && key !== "password") {
                addToast({
                    hideIcon: true,
                    title: "Missing Field",
                    description: `Please fill in the ${key} field`,
                    color: "danger",
                    classNames: {
                        closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
                    },
                    closeIcon: (
                        <CircleX />
                    ),
                });;
                return;
            }
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("role", form.role);
        formData.append("password", form.password);

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                console.log("User Updated Successful:", data);
                router.push("/admin/users")
            } else {
                console.log(`Error: ${response.status} - ${response.statusText}`);
            }

        } catch (error) {
            console.log("Error updating user:", error);
        }
    };

    return (
        <section>
            <ToastProvider placement="top-center" />
            <div className="flex justify-between p-5">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                <Home className="size-4" /> Dashboard
                            </Link>
                        </li>
                        <li className="inline-flex items-center">
                            <div className="flex items-center">
                                <ChevronRight className="size-4" />
                                <Link href="/admin/users" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    <User className="size-4" /> Users
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <ChevronRight className="size-4" />
                                <span className="ms-1 flex items-center text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    <UserPlus className="size-4" /> Update User
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <Button onClick={updateUser}>Save</Button>
            </div>
            <div className="p-5">
                <div className="bg-sidebar flex flex-col gap-6 rounded-lg p-5">
                    <Input label="Name" type="text" variant="underlined" isRequired name="name" value={form.name} onChange={handleChange} />
                    <Input label="Email" type="email" variant="underlined" isRequired name="email" value={form.email} onChange={handleChange} />
                    <Select
                        className="max-w-xs"
                        label="Select Role"
                        variant="underlined"
                        isRequired
                        name="role"
                        selectedKeys={[form.role]}
                        onChange={handleChange}
                    >
                        <SelectItem key="admin">Admin</SelectItem>
                        <SelectItem key="employee">Employee</SelectItem>
                    </Select>
                    <Input label="Password" type="password" variant="underlined" name="password" value={form.password} onChange={handleChange} />
                </div>
            </div>
        </section>
    );
}