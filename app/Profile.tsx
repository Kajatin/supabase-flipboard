"use client";

import { Database } from "@/types/supabase";
import { useSupabase } from "./supabase-provider";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Profile() {
  const { supabase } = useSupabase();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [oaAPI, setOaAPI] = useState("");

  const fetchCollections = async () => {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .single();
    if (error) {
      console.log(error);
    } else {
      setProfile(profiles);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const oaAPIKey = localStorage.getItem("openai-api-key");
    if (oaAPIKey) {
      setOaAPI(oaAPIKey);
    }
  }, []);

  const handleLogout = async (event: any) => {
    event.preventDefault();
    await supabase.auth.signOut();
  };

  return (
    <>
      <AnimatePresence>
        {showSettings && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-neutral-900 bg-opacity-70">
            <motion.div
              className="grid place-items-center h-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-4 w-[50%]">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-lg font-medium">Settings</div>
                  <button
                    className="text-neutral-400 hover:text-neutral-200"
                    onClick={() => setShowSettings(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-base font-medium">OpenAI API Key</div>
                  <input
                    className="text-lg font-medium px-2 py-1 bg-transparent border rounded border-neutral-500"
                    placeholder="sk-xxxxxxxxx"
                    value={oaAPI}
                    onChange={(e) => {
                      setOaAPI(e.target.value);
                      localStorage.setItem("openai-api-key", e.target.value);
                    }}
                  />
                  <div className="text-sm text-neutral-400">
                    Set your OpenAI API key to enable the AI to generate
                    description for new words that you add to your collections.
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-base font-medium">System</div>
                  <button
                    className="text-base font-medium hover:bg-neutral-600 text-red-500 w-full text-start bg-neutral-700 p-2 rounded"
                    onClick={() => {
                      localStorage.removeItem("openai-api-key");
                      setOaAPI("");
                    }}
                  >
                    Reset settings
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col w-full px-2 py-5 gap-2 border-t border-neutral-400 items-start">
        <div className="text-sm text-neutral-400 font-medium">
          {profile?.username}
        </div>
        <button
          className="text-sm hover:bg-neutral-600 w-full text-start px-1 py-0.5 rounded"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
        <button
          className="text-sm hover:bg-neutral-600 w-full text-start px-1 py-0.5 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
}
