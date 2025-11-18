"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const RecordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-red-500"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" fill="currentColor" />
  </svg>
);

export default function Record() {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <RecordIcon />
      <h3
        className="mt-2 text-lg font-semibold text-gray           
-800"
      >
        Record Your Thoughts
      </h3>

      <p className="mt-1 text-sm text-gray-600 text-center">
        Capture your daily reflections and experiences with ease.
      </p>
    </div>
  );
}
