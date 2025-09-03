"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

function Settings() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [image3, setImage3] = useState<File | null>(null);

  const { isAdminLoggedIn } = useAppSelector((state) => state.adminAuth);

  // Handle file input change
  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage1(e.target.files[0]);
  };
  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage2(e.target.files[0]);
  };
  const handleFile3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage3(e.target.files[0]);
  };

  const handleImageUpload = async (step: 1 | 2 | 3, file: File | null) => {
    if (!file) return;
    const formData = new FormData();
    formData.append(`step${step}`, file);

    const loading = toast.loading("Updating...");
    try {
      const response = await axios.post(`/admin/change/step${step}`, formData);
      console.log(response.data);
      toast.success("Image uploaded successfully", { id: loading });
      if (step === 1) setImage1(null);
      if (step === 2) setImage2(null);
      if (step === 3) setImage3(null);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data.message || "Upload failed", { id: loading });
    }
  };

  const handleEmail = async () => {
    if (!email) return;
    const loading = toast.loading("Updating...");
    try {
      const response = await axios.post("/admin/change/email", { email });
      console.log(response.data);
      toast.success("Email updated successfully", { id: loading });
      setEmail("");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data.message || "Email update failed", { id: loading });
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login");
    }
  }, [isAdminLoggedIn, router]);

  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-red-500 dark:text-red-400 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
          Settings
        </h1>
      </div>

      <div className="mt-5 text-center space-y-4">
        <div>
          <label htmlFor="email" className="block text-lg font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-2/3 md:w-1/3 focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter your email"
          />
          <button
            onClick={handleEmail}
            className="ml-3 px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-800"
          >
            Change
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((step) => {
            const image = step === 1 ? image1 : step === 2 ? image2 : image3;
            const handleChange =
              step === 1 ? handleFile1Change : step === 2 ? handleFile2Change : handleFile3Change;

            return (
              <div key={step} className="space-y-2">
                <label
                  htmlFor={`image${step}`}
                  className="block text-lg font-semibold text-center"
                >
                  Step-{step}
                </label>
                <input
                  id={`image${step}`}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="block mx-auto w-2/3 md:w-full text-gray-700 dark:text-gray-100"
                />
                <button
                  onClick={() => handleImageUpload(step as 1 | 2 | 3, image)}
                  className="w-full px-4 py-2 bg-green-500 dark:bg-green-700 text-white rounded hover:bg-green-600 dark:hover:bg-green-800"
                >
                  Upload
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Settings;
