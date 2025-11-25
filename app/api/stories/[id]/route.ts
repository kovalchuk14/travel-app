import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { localAPI } from "@/lib/localAPI";
import { logErrorResponse } from "@/app/api/_utils/utils";
import { isAxiosError } from "axios";
import { backendAPI } from "@/lib/backendAPI";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const { id } = await params;
    console.log("id");

    const res = await backendAPI.get(`/stories/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";

    console.log("PATCH /api/stories/[id]");
    console.log(`${API_URL}/stories/${id}`);

    console.log("Params ID:", id);
    console.log("AccessToken:", accessToken);

    // ----- 1. Read incoming FormData -----
    const formData = await request.formData();

    // DEBUG: log all FormData keys and values
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, "File:", value.name, value.size, value.type);
      } else {
        console.log(key, value);
      }
    }

    // ----- 2. Forward to external API -----
    const apiRes = await fetch(`${API_URL}/stories/${id}`, {
      method: "PATCH",
      body: formData,
      headers: {
        cookie: request.headers.get("cookie") || "",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("External API status:", apiRes.status);
    const data = await apiRes.json().catch(() => ({}));
    console.log("External API response:", data);

    return NextResponse.json(data, { status: apiRes.status });
  } catch (err) {
    console.error("PATCH /stories/:id error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: String(err) },
      { status: 500 }
    );
  }
}
