import Image from "next/image";
import { IoSparklesSharp } from "react-icons/io5";
export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#F8EAE7] relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 px-8 pt-6 pb-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8B5E3C] rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
              <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.314 2.686 6 6 6s6-2.686 6-6v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
            </svg>
          </div>
          <span className="text-2xl font-semibold text-[#3F2D24] tracking-tight">
            BaatCheet
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-[#3F2D24] text-sm hover:text-[#8B5E3C] transition-colors"
          >
            How it Works
          </a>
          <a
            href="#features"
            className="text-[#3F2D24] text-sm hover:text-[#8B5E3C] transition-colors"
          >
            Features
          </a>
          <a
            href="#privacy"
            className="text-[#3F2D24] text-sm hover:text-[#8B5E3C] transition-colors"
          >
            Privacy
          </a>
          <a
            href="#testimonials"
            className="text-[#3F2D24] text-sm hover:text-[#8B5E3C] transition-colors"
          >
            Testimonials
          </a>
        </nav>

        {/* CTA Button */}
        <button className="bg-[#8B5E3C] text-white px-6 py-2.5 rounded-4xl text-sm font-medium hover:bg-[#734E32] transition-colors flex items-center gap-2">
          Start Speaking <span>&gt;</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 pt-1">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-8">
          {/* Left Content */}
          <div className="relative">
            {/* Sparkle elements */}
            <div className="absolute -top-4 -left-4 w-10 h-10 text-[#3F2D24] opacity-100">
              <IoSparklesSharp className="w-full h-full" />
            </div>
            <div className="absolute top-20 -right-8 w-8 h-8 text-[#3F2D24] opacity-100">
              <IoSparklesSharp className="w-full h-full" />
            </div>
            <div className="absolute bottom-32 left-12 w-8 h-8 text-[#3F2D24] opacity-100">
              <IoSparklesSharp className="w-full h-full" />
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-serif text-[#3F2D24] leading-tight mb-8 font-bold text-center">
              CASUAL TALK
              <br />
              WITH
              <br />
              YOUR DIGITAL SELF
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6 justify-center">
              <button className="bg-[#8B5E3C] text-white px-8 py-4 rounded-4xl font-medium hover:bg-[#734E32] transition-colors flex items-center justify-center gap-3 shadow-sm">
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
            <p className="text-[#3F2D24] text-lg opacity-80 text-center">
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
