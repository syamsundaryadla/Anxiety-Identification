// app/api/auth/check/route.ts
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

export async function GET() {
    try {
      // Get the token from cookies using next/headers
      const cookieStore = cookies();
      const token = (await cookieStore).get('token')?.value;
  
      if (!token) {
        return NextResponse.json(
          { message: "Not authenticated" },
          { status: 401 }
        );
      }
  
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET as string);
  
      return NextResponse.json(
        { message: "Authenticated" },
        { status: 200 }
      );
    } catch (error) {
      console.error('Authentication error:', error);  // Log the error
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
  }
  