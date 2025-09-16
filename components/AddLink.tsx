"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Links from "./Links";

interface LinkItem {
  _id: string;
  link: string;
  domain: string; 
  createdAt: string | Date;
  updatedAt?: string | Date;
}
function AddLink() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [link, setLink] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    setDomain(window.location.origin);
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.post("/api/admin/links", { domain });
        setLinks(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (domain) fetchLinks();
  }, [domain]);

  const addLink = async () => {
    if (!link) return toast.error("Please enter a link suffix");
    const loading = toast.loading("Creating link...");
    try {
      const res = await axios.post("/api/admin/create-link", { link, domain });
      toast.success("Link created!", { id: loading });
      setLinks(res.data.data);
      setLink("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message, { id: loading });
      } else {
        toast.error("An error occurred while creating link.", { id: loading });
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete all links?")) return;
    const loading = toast.loading("Deleting all links...");
    try {
      const res = await axios.post("/api/admin/delete-link", { domain });
      toast.success("All links deleted!", { id: loading });
      setLinks(res.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message, { id: loading });
      } else {
        toast.error("An error occurred while deleting links.", { id: loading });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Add Link Section */}
      <div className="max-w-md mx-auto mb-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Add New Link
        </h1>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter link suffix"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={addLink}
            className="w-full cursor-pointer md:w-auto px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Header & Delete Button */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-4 px-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          All Links ({links.length})
        </h2>
        <button
          onClick={handleDelete}
          className="px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Delete All
        </button>
      </div>

      {/* Links List */}
      <Links links={links}/>
    </div>
  );
}

export default AddLink;
