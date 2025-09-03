import { connectDB } from "@/lib/db";
import Data from "@/models/dataModel";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Params } // ✅ plain object, not a Promise
) {
  const { id } = params;

  if (id === "Mobile" || id === "Desktop") {
    try {
      await connectDB();

      const totalData = await Data.countDocuments({});
      if (totalData === 0) {
        await Data.create({});
      }

      await Data.findOneAndUpdate(
        {},
        { $inc: { [`${id.toLowerCase()}Clicks`]: 1 } }
      );

      return NextResponse.json({
        success: true,
        message: "Page loaded successfully.",
      });
    } catch (error: unknown) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Server error..!";
      return NextResponse.json({ success: false, message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { success: false, message: "Invalid id" },
    { status: 404 }
  );
}
