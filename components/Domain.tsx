import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function Domain() {
    const [publicUrl, setPublicUrl] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const res = await axios.get("/admin/data");
            setPublicUrl(res.data.data.clientUrl);
          } catch (error) {
            console.log(error);
          }
        };
        fetchUsers();
      }, []);
    const handleUrl = async () => {
        if (url) {
          const loading = toast.loading("Updating url...");
          try {
            const res = await axios.post("/admin/update-url", {
              url,
            });
            toast.success("Client Url updated....", { id: loading });
            setPublicUrl(res.data.data.clientUrl);
            setUrl("");
          } catch (error) {
            toast.error(error.response.data.message, { id: loading });
            setUrl("");
          }
        }
      };
  return (
    <div className="block md:flex pb-2 pr-2 pt-4">
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder={publicUrl}
      className="bg-transparent w-full dark:text-white px-2 border outline-none border-gray-600 rounded h-10"
    />
    <button
      onClick={handleUrl}
      className="dark:text-white mx-auto block h-10 bg-orange-500 rounded w-full md:w-24"
    >
      Set
    </button>
  </div>
  )
}

export default Domain