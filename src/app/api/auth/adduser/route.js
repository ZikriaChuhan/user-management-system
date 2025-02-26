import { NextResponse } from "next/server";
import { User } from "@/lib/models/user";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const name = formData.get("name");
    const email = formData.get("email");
    const role = formData.get("role") || "admin";
    const password = formData.get("password");

    const existingUser = await User.findOne({email})
    if (existingUser) {
        return NextResponse.json({ error: "User already exists"}, { status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    await user.save();

    return NextResponse.json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Error adding user", details: error.message }, { status: 500 });
  }
}