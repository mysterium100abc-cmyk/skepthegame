import { connectDB } from "@/lib/db";
import Data from "@/models/dataModel";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
