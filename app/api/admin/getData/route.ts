import { connectDB } from "@/lib/db";
import AdminData from "@/models/dataModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    let data = await AdminData.findOne();

    if (!data) {
      data = await AdminData.create({});
    }

    return NextResponse.json(
      {
        success: true,
        message: "Copied..!",
        data,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Server error..!",
      },
      { status: 500 }
    );
  }
}
