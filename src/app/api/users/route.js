import { NextResponse } from "next/server";
import { User } from "@/lib/models/user";
import connectDB from "@/lib/db";

connectDB();

export async function GET() {
    try {
        const users = await User.find().select("-password"); 
        return NextResponse.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}