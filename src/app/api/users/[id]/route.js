import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/lib/models/user";
import connectDB from "@/lib/db";

connectDB();

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "⚠️ User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json({ error: "⚠️ Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const role = formData.get("role");
    let password = formData.get("password");

    if (password) {
      password = await bcrypt.hash(password, 10); 
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role, ...(password && { password }) },
      { new: true }
    );

    return NextResponse.json({ message: "✅ User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json({ error: "⚠️ Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "✅ User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ error: "⚠️ Internal Server Error" }, { status: 500 });
  }
}
