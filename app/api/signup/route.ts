import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "../../utils/db";
import { validateEmail, validatePassword } from "../../utils/validation";
import type { User, AuthResponse } from "../../utils/types";

export async function POST(request: Request) {
  try {
    const { name, email, password }: Partial<User> = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json<AuthResponse>(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json<AuthResponse>(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json<AuthResponse>(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const db = await connectToDB();
    const existingUser = await db.collection<User>("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { message: "Email already registered." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await db.collection<User>("users").insertOne(newUser);

    // Using the spread syntax to exclude the password
    const userWithoutPassword = { ...newUser, password: undefined };

    return NextResponse.json<AuthResponse>(
      {
        message: "User registered successfully.",
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json<AuthResponse>(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
