// app/api/logout/route.ts
import { NextResponse } from "next/server";
import type { AuthResponse } from "../../utils/types";

export async function POST() {
  try {
    const response = NextResponse.json<AuthResponse>({
      message: "Logged out successfully."
    });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<AuthResponse>(
      { message: "Error during logout." },
      { status: 500 }
    );
  }
}
