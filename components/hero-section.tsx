import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] relative overflow-hidden">
      {/* Subtle wavy background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="wave"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,50 Q25,30 50,50 T100,50"
                stroke="#8B6F47"
                fill="none"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8B6F47] rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
              <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.314 2.686 6 6 6s6-2.686 6-6v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
            </svg>
          </div>
          <span className="text-2xl font-semibold text-[#5C4A37] tracking-tight">
            BaatCheet
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-[#5C4A37] text-sm hover:text-[#8B6F47] transition-colors"
          >
            How it Works
          </a>
          <a
            href="#features"
            className="text-[#5C4A37] text-sm hover:text-[#8B6F47] transition-colors"
          >
            Features
          </a>
          <a
            href="#privacy"
            className="text-[#5C4A37] text-sm hover:text-[#8B6F47] transition-colors"
          >
            Privacy
          </a>
          <a
            href="#testimonials"
            className="text-[#5C4A37] text-sm hover:text-[#8B6F47] transition-colors"
          >
            Testimonials
          </a>
        </nav>

        {/* CTA Button */}
        <button className="bg-[#8B6F47] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#7A5F3A] transition-colors flex items-center gap-2">
          Start Speaking <span>&gt;</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 px-8 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative">
            {/* Sparkle elements */}
            <div className="absolute -top-4 -left-4 w-3 h-3 text-[#D4AF37] opacity-60">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>
            <div className="absolute top-20 -right-8 w-2 h-2 text-[#D4AF37] opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>
            <div className="absolute bottom-32 left-12 w-2.5 h-2.5 text-[#D4AF37] opacity-40">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-serif text-[#5C4A37] leading-tight mb-8 font-bold">
              CASUAL TALK
              <br />
              WITH
              <br />
              YOUR DIGITAL SELF
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button className="bg-[#8B6F47] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#7A5F3A] transition-colors flex items-center justify-center gap-3">
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
              <button className="bg-[#F5F1EB] text-[#5C4A37] px-8 py-4 rounded-lg font-medium hover:bg-[#EDE8E0] transition-colors flex items-center justify-center gap-2 border border-[#E8DDD0]">
                See How It Works? <span>&gt;</span>
              </button>
            </div>

            {/* Descriptive Text */}
            <p className="text-[#5C4A37] text-lg opacity-80">
              Perfect for tired minds and busy hearts.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="relative flex items-center justify-center">
            {/* Sparkle elements around image */}
            <div className="absolute -top-8 right-8 w-3 h-3 text-[#D4AF37] opacity-60">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>
            <div className="absolute bottom-16 -right-4 w-2.5 h-2.5 text-[#D4AF37] opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
            </div>

            <div className="relative w-full max-w-md">
              <Image
                src="/hero-section.svg"
                alt="Voice journaling illustration"
                width={600}
                height={800}
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
