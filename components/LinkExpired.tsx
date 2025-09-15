"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800">
        <AlertCircle className="mx-auto text-red-500" size={60} />
        <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
          Link Invalid or Expired
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The link you followed is no longer valid. Please request a new one.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-2 text-white font-medium hover:bg-indigo-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
