// app/api/admin/delete-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // adjust path
import Link from "@/models/linkModel"; // adjust path

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();

    const { domain } = body;

    await Link.deleteMany({ domain });

    return NextResponse.json(
      {
        success: true,
        message: "All links deleted successfully!",
        data: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error..!" },
      { status: 500 }
    );
  }
};
