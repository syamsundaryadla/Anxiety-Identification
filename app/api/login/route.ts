import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDB } from "../../utils/db";
import { validateEmail } from "../../utils/validation";
import type { User, AuthResponse } from "../../utils/types";

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export async function POST(request: Request) {
  try {
    const { email, password }: Partial<User> = await request.json();

    if (!email || !password) {
      return NextResponse.json<AuthResponse>(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json<AuthResponse>(
        { message: "Invalid email format." },
        { status: 400 }
      );
    }

    const db = await connectToDB();
    const user = await db.collection<User>("users").findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json<AuthResponse>(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    // Type assertion to allow 'delete' on user.password
    const userWithoutPassword = { ...user, password: undefined };

    const response = NextResponse.json<AuthResponse>({
      message: "Login successful.",
      user: userWithoutPassword,
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<AuthResponse>(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
