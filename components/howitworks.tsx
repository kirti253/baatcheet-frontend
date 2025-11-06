"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    id: 1,
    title: "Create Your Account",
    subtitle: "Sign up or log in to start your private journal.",
    illustration: "/images/step1.svg",
  },
  {
    id: 2,
    label: "Features",
    title: "Discover Your Digital Tools",
    subtitle: "Voice-to-text magic, emotional insights, secure & private.",
    illustration: "/images/step2.svg",
  },
  {
    id: 3,
    label: "HOW TO USE",
    title: "Navigate Your Journal",
    subtitle:
      "Our intuitive interface makes finding, editing, and reflecting on your entries a breeze. Explore your past thoughts with ease.",
    illustration: "",
  },
  {
    id: 4,
    label: "SAVE & VIEW",
    title: "Your Journal, Your Way",
    subtitle: "Entries auto-save and can be viewed by date, mood, or search.",
    illustration: "/images/step4.svg",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="w-full px-4 py-16"
      style={{ backgroundColor: "var(--background-base)" }}
    >
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-3 text-4xl font-bold text-[#3d362f]">
          How it works?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-[#3d362f]/80">
          A simple guide to get you started on your journaling journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="relative overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 hover:shadow-md hover:from-[#f8f8c8] hover:to-[#fbfbe5] border border-[#e6e6c7] bg-linear-to-br from-[#f9f9d3] to-[#fbfbe5]"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.id * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6e6c7] font-medium text-[#4A4238] text-sm">
                  {step.id}
                </div>
                {step.label && (
                  <span className="text-xs font-medium text-[#4A4238]/70 uppercase tracking-wide">
                    {step.label}
                  </span>
                )}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-[#3d362f]">
                {step.title}
              </h3>
              <p className="mb-5 text-sm text-[#4A4238]/80">{step.subtitle}</p>

              <div className="relative h-40 w-full">
                <Image
                  src={step.illustration}
                  alt={step.title}
                  fill
                  className="object-contain p-2"
                  priority={step.id === 1}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
