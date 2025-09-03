"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Users from "./Users";
import {
  CalculatorIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  LinkIcon,
} from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { adminLogout, setCustomers } from "@/lib/adminSlice";
import NotificationIndicator from "./NotificationIndicator";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import useSound from "use-sound";

// Define types
interface IUser {
  _id: string;
  email: string;
  password: string;
  createdAt: string | Date;
  deviceType?: string;
  updatedAt?: string;
}

interface IData {
  mobileClicks: number;
  desktopClicks: number;
  notifications: number;
  alert: boolean;
  copiedEmails: number;
}

function Dashboard() {
  const { isAdminLoggedIn, customers } = useAppSelector(
    (state) => state.adminAuth
  );
  const dispatch = useDispatch();
  const [data, setData] = useState<IData>({
    mobileClicks: 0,
    desktopClicks: 0,
    notifications: 0,
    alert: false,
    copiedEmails: 0,
  });
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // useSound hook
  const [playAlert] = useSound("/music/alert.mp3", {
    volume: 1,
    interrupt: true, // stop previous if playing
  });

  // Unlock sound on first interaction
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  // unlock audio and play alert on user interaction
  useEffect(() => {
    const unlockAudio = () => {
      playAlert(); // first silent unlock sound
      setAudioUnlocked(true);
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [playAlert]);

  // Fetch users
  useEffect(() => {
    if (!isAdminLoggedIn) router.push("/admin/login");

    const fetchUsers = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: IUser[] }>(
          "/api/admin/user-list"
        );
        dispatch(setCustomers(res.data.data || []));
      } catch (error) {
        console.log(error);
        dispatch(adminLogout());
      }
    };

    fetchUsers();
    const intervalId = setInterval(fetchUsers, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: IData }>(
          "/api/admin/getData"
        );
        setData(res.data.data || data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (data.alert && audioUnlocked) {
      playAlert(); // play alert sound
      axios.get("/api/admin/alert/reset").then(() => {
        console.log("Alert reset");
      });
    }
  }, [data.alert, audioUnlocked, playAlert]);

  const handleResetNotifications = async () => {
    try {
      const res = await axios.get("/api/admin/notification/reset");
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* 🔔 Notifications */}
      <NotificationIndicator
        handleClick={handleResetNotifications}
        count={data.notifications}
      />

      {/* 📊 Stats Row 1 */}
      <div className="mt-20 w-full flex space-x-2 justify-center">
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <DevicePhoneMobileIcon
            width={50}
            className="text-blue-500 dark:text-blue-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Mobile Clicks</h1>
            <p className="font-bold">{data.mobileClicks}</p>
          </div>
        </div>
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <ComputerDesktopIcon
            width={50}
            className="text-green-500 dark:text-green-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Desktop Clicks</h1>
            <p className="font-bold">{data.desktopClicks}</p>
          </div>
        </div>
      </div>

      {/* 📊 Stats Row 2 */}
      <div className="pb-10 w-full flex space-x-2 justify-center mt-5">
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <CalculatorIcon
            width={50}
            className="text-purple-500 dark:text-purple-400"
          />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Total Clicks</h1>
            <p className="font-bold">
              {data.mobileClicks + data.desktopClicks}
            </p>
          </div>
        </div>
        <div className="flex w-48 md:w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
          <LinkIcon width={50} className="text-red-500 dark:text-red-400" />
          <div className="ml-3">
            <h1 className="font-bold text-lg md:text-xl">Email Copied</h1>
            <p className="font-bold">{data.copiedEmails}</p>
          </div>
        </div>
      </div>

      {/* 👥 Users List */}
      {mounted && <Users users={customers} />}
    </div>
  );
}

export default Dashboard;
