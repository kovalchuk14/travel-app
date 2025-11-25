import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { logErrorResponse } from "../../_utils/utils";
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("/auth/login", body);
    const setCookieHeader = apiRes.headers["set-cookie"];
    const cookieStore = await cookies();

    if (!setCookieHeader) {
      console.warn("Login successful but no cookies received from backend.");
      return NextResponse.json({ message: "No cookie" }, { status: 567 });
    }

    const cookieStrings = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : [setCookieHeader];

    for (const cookieStr of cookieStrings) {
      const parsed = parse(cookieStr);

      const { Expires, Path, ["Max-Age"]: maxAge } = parsed;

      const options = {
        path: Path || "/",
        ...(Expires && { expires: new Date(Expires) }),
        ...(maxAge && { maxAge: Number(maxAge) }),
      };

      ["accessToken", "refreshToken", "sessionId"].forEach((key) => {
        if (parsed[key]) {
          cookieStore.set(key, parsed[key], options);
        }
      });
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
      if (isAxiosError(error)) {
        logErrorResponse(error.response?.data);
        return NextResponse.json(
          { error: error.message, response: error.response?.data },
          { status: error.status || 500 }
        );
      }
      logErrorResponse({ message: (error as Error).message });
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
}
