import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import fs from "fs";

// Load env variables (make sure these exist in .env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Type for upload response
type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

export async function uploadOnCloudinary(
  filePath: string,
  folder?: string,
  publicId?: string
): Promise<CloudinaryResponse | null> {
  if (!filePath) return null;

  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: publicId,
      resource_type: "image",
    });

    // Remove local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
}
