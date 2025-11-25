import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    if (accessToken) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const cookieHeader = Object.entries(cookieStore.getAll().reduce((acc, c) => {
      acc[c.name] = c.value;
      return acc;
    }, {} as Record<string, string>))
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");


    const apiRes = await api.post(
      "/auth/refresh-session",
      {},
      { headers: { Cookie: cookieHeader } }
    );

    const setCookies = apiRes.headers["set-cookie"];
    if (setCookies) {
      const cookieArray = Array.isArray(setCookies) ? setCookies : [setCookies];

      for (const c of cookieArray) {
        const parsed = parse(c);

        const options = {
          path: parsed.Path || "/",
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        };

        if (parsed.accessToken)
          cookieStore.set("accessToken", parsed.accessToken, options);

        if (parsed.refreshToken)
          cookieStore.set("refreshToken", parsed.refreshToken, options);

        if (parsed.sessionId)
          cookieStore.set("sessionId", parsed.sessionId, options);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

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
