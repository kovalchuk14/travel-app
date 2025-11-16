import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { Traveller } from "@/types/traveller";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "4");

    const client = await clientPromise;
    const db = client.db("Name of db");
    const travellersCollection = db.collection<Traveller>("users");

    const totalItems = await travellersCollection.countDocuments();
    const totalPages = Math.ceil(totalItems / perPage);

    const data = await travellersCollection
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    return NextResponse.json({
      status: 200,
      message: "OK",
      data: {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    console.error("API /users error:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error", data: null },
      { status: 500 }
    );
  }
}
