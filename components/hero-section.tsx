import Image from "next/image";
import { IoSparklesSharp } from "react-icons/io5";
export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#f3edeb] relative overflow-hidden pb-10">
      {/* Header */}
      <header
        className="relative z-10 px-6 pt-6 pb-1 flex items-center justify-between"
        style={{ fontFamily: "var(--font-inria-serif)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8B5E3C] rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
              <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.314 2.686 6 6 6s6-2.686 6-6v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
            </svg>
          </div>
          <span
            className="text-3xl font-semibold text-[#3F2D24] tracking-tight"
            style={{ fontFamily: "var(--font-inria-serif)" }}
          >
            BaatCheet
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-[#3F2D24] text-base hover:text-[#8B5E3C] transition-colors "
          >
            How it Works
          </a>
          <a
            href="#features"
            className="text-[#3F2D24] text-base hover:text-[#8B5E3C] transition-colors"
          >
            Features
          </a>
          <a
            href="#privacy"
            className="text-[#3F2D24] text-base hover:text-[#8B5E3C] transition-colors"
          >
            Privacy
          </a>
          <a
            href="#testimonials"
            className="text-[#3F2D24] text-base hover:text-[#8B5E3C] transition-colors"
          >
            Testimonials
          </a>
        </nav>

        {/* CTA Button */}
        <button className="bg-[#8B5E3C] text-white px-8 py-3 rounded-4xl text-base font-medium hover:bg-[#734E32] transition-colors flex items-center gap-2 shadow-lg border border-[#734E32]">
          Start Speaking <span>&gt;</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-1">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-8">
          {/* Left Content */}
          <div className="relative">
            {/* Sparkle elements */}
            <div className="absolute -top-20 -left-13 w-5 h-15 text-[#3F2D24] opacity-100">
              <IoSparklesSharp className="w-full h-full" />
            </div>
            <div className="absolute top-32 -right-2 w-7 h-7 text-[#3F2D24] opacity-100">
              <IoSparklesSharp className="w-full h-full" />
            </div>
            <div className="absolute bottom-2 left-3 w-5 h-5 text-[#3F2D24] opacity-100">
              <IoSparklesSharp className="w-full h-full" />
            </div>

            {/* Main Headline */}
            <h1
              className="text-5xl lg:text-6xl text-[#3F2D24] leading-tight mb-8 font-bold text-center"
              style={{ fontFamily: "var(--font-inria-serif)" }}
            >
              CASUAL TALK
              <br />
              WITH
              <br />
              YOUR DIGITAL SELF
            </h1>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-10 pt-10 mb-6  justify-center"
              style={{ fontFamily: "var(--font-inria-serif)" }}
            >
              <button className="bg-[#8B5E3C] text-white px-8 py-4 rounded-4xl font-medium hover:bg-[#734E32] transition-colors flex items-center justify-center gap-3 shadow-xl border border-[#734E32]">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
                  <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.314 2.686 6 6 6s6-2.686 6-6v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                </svg>
                Start Voice Journaling
              </button>
              <button className="bg-[#d6bba6] text-[#5C4A37] px-8 py-4 rounded-4xl font-medium hover:bg-[#EDE8E0] transition-colors flex items-center justify-center gap-2 border border-[#E8DDD0] shadow-md">
                See How It Works? <span>&gt;</span>
              </button>
            </div>

            {/* Descriptive Text */}
            <p className="text-[#3F2D24] text-lg opacity-80 text-left pl-8 pt-3.5">
              Perfect for tired minds and busy hearts.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="relative flex items-center justify-center pt-0">
            {/* Sparkle elements around image */}
            <div className="absolute bottom-16 -right-4 w-8 h-8 text-[#3F2D24] opacity-100">
              <IoSparklesSharp className="w-full h-full" />
            </div>

            <div className="relative w-full max-w-lg pt-0">
              <Image
                src="/hero-section.svg"
                alt="Voice journaling illustration"
                width={800}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
