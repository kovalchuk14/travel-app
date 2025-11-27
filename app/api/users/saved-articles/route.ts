import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendAPI } from "@/lib/backendAPI";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";

    const res = await backendAPI.get("/users/me/saved-articles", {
      headers: {
        Cookie: cookieStore.toString(),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    console.error("GET /api/users/me/saved-articles error:", error);
    return NextResponse.json(
      { data: { savedStories: [] } }, // повертаємо порожній масив, щоб UI не падав
      { status: error.response?.status || 500 }
    );
  }
}