import { IoSparklesSharp } from "react-icons/io5";
import { FaMicrophone, FaFileAlt, FaBook } from "react-icons/fa";
import { ReactNode } from "react";

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  icon: ReactNode;
}

function StepCard({ stepNumber, title, description, icon }: StepCardProps) {
  return (
    <div className="bg-[#FBF4F2] rounded-3xl p-5 shadow-lg border border-[#E8DDD0] relative max-w-xs mx-auto">
      {/* Step Badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-[#d6bba6] text-[#5C4A37] px-3 py-1 rounded-full text-xs font-medium">
          {stepNumber}
        </div>
      </div>

      {/* Title */}
      <h2
        className="text-2xl font-bold text-[#3F2D24] pt-3 mb-3 text-center"
        style={{ fontFamily: "var(--font-inria-serif)" }}
      >
        {title}
      </h2>

      {/* Description */}
      <p className="text-[#3F2D24] text-sm leading-relaxed mb-5 opacity-90 text-center">
        {description}
      </p>

      {/* Icon */}
      <div className="flex justify-center mt-5">{icon}</div>
    </div>
  );
}

export default function HowItWorks() {
  const steps = [
    {
      stepNumber: "STEP 01",
      title: "Speak Naturally",
      description:
        "Press the microphone and talk freely. No scripts, No rules. Just your voice and your thoughts",
      icon: (
        <div className="w-16 h-16 text-[#8B5E3C] flex items-center justify-center">
          <FaMicrophone className="w-full h-full" />
        </div>
      ),
    },
    {
      stepNumber: "STEP 02",
      title: "Voice Converts to Text",
      description:
        "As you speak, BaatCheet gently transforms your voice into clear, readable words in real time",
      icon: (
        <div className="w-16 h-16 text-[#8B5E3C] flex items-center justify-center relative">
          {/* Sound waves + Document icon */}
          <div className="relative">
            <FaFileAlt className="w-10 h-10" />
            {/* Sound wave bars */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex gap-1">
              <div className="w-0.5 bg-[#8B5E3C] h-6 rounded-full"></div>
              <div className="w-0.5 bg-[#8B5E3C] h-8 rounded-full"></div>
              <div className="w-0.5 bg-[#8B5E3C] h-5 rounded-full"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      stepNumber: "STEP 03",
      title: "Saved as Journal Entry",
      description:
        "Review, edit if needed and save your entry. Come back anytime to reflect on your thoughts",
      icon: (
        <div className="w-16 h-16 text-[#8B5E3C] flex items-center justify-center">
          <FaBook className="w-full h-full" />
        </div>
      ),
    },
  ];

  return (
    <div
      id="how-it-works"
      className="min-h-screen bg-[#f3edeb] relative overflow-visible py-20 px-6"
    >
      {/* Title */}
      <h1
        className="text-5xl font-bold text-center text-[#3F2D24] mb-16"
        style={{ fontFamily: "var(--font-inria-serif)" }}
      >
        How It Works
      </h1>

      {/* Cards Container */}
      <div className="max-w-5xl mx-auto relative pt-20">
        {/* Connecting Dotted Line with Sparkles */}
        <div className="hidden lg:block absolute -top-18 left-0 right-0 h-0.5">
          {/* Dotted line path */}
          <svg
            className="absolute top-0 left-0 w-full h-full"
            style={{ height: "200px" }}
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
          >
            {/* Curved dotted line - pointed upward */}
            <path
              d="M 50 180 Q 600 30 1150 180"
              stroke="#8B5E3C"
              strokeWidth="3"
              strokeDasharray="8 8"
              fill="none"
              opacity="0.6"
            />
          </svg>

          {/* Sparkles between the cards - two sparkles in each gap */}
          {/* Between card 1 and 2 */}
          <div className="absolute -top-10 left-[15%] w-3 h-3 text-[#8B5E3C]">
            <IoSparklesSharp className="w-full h-full" />
          </div>
          <div className="absolute -top-10 left-[18%] w-3 h-3 text-[#8B5E3C]">
            <IoSparklesSharp className="w-full h-full" />
          </div>
          {/* Between card 2 and 3 */}
          <div className="absolute -top-10 left-[75%] w-3 h-3 text-[#8B5E3C]">
            <IoSparklesSharp className="w-full h-full" />
          </div>
          <div className="absolute -top-10 left-[78%] w-3 h-3 text-[#8B5E3C]">
            <IoSparklesSharp className="w-full h-full" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 relative z-10">
          {steps.map((step) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
