"use client";
import { useState } from "react";
import Techstack from "./techstack";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full max-w-5xl mx-auto px-4 pt-8 pb-0">
      <div className="flex items-center justify-between rounded-full bg-[#4A4238] px-6 py-2.5 text-white shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">
          BaatCheet
          <span className="text-orange-400">.</span>
        </h1>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-orange-400 text-2xl font-semibold hover:opacity-90"
        >
          Sign in
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            aria-label="Close sign in"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 text-black shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="mb-4 text-2xl font-bold">Sign in</h2>

            <Techstack />

            <div className="mb-3 text-center text-sm text-gray-500">or</div>

            <form className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-400 focus:outline-none"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="button"
                className="mt-2 w-full rounded-lg bg-[#5a544e] px-4 py-2 font-semibold text-white hover:opacity-90"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
