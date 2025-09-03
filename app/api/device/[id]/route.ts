import { connectDB } from "@/lib/db";
import Data from "@/models/dataModel";
import { NextRequest, NextResponse } from "next/server";



// Handle GET or POST (you can choose which fits better)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await  params;

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
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Server error..!" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, message: "Invalid id" },
    { status: 404 }
  );
}
