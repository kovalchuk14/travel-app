import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const hasAccess = cookieStore.get("accessToken")?.value;
    if (hasAccess) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    
    const apiRes = await api.post(
      "/auth/refresh-session",
      {},
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      for (const c of setCookie) {
        const parsed = parse(c);

        const opts = {
          path: parsed.Path,
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        };

        if (parsed.accessToken)
          cookieStore.set("accessToken", parsed.accessToken, opts);

        if (parsed.refreshToken)
          cookieStore.set("refreshToken", parsed.refreshToken, opts);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json({ success: false }, { status: 401 });
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
