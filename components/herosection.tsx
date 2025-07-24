import Image from "next/image";

export default function Herosection() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-20"
      data-aos="zoom-in"
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight">
              BAATCHEET
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-xl mx-auto lg:mx-0">
              Casual talk with your digital self
            </p>
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
            <Image
              src="/images/4630738.jpg"
              alt="Hero"
              width={400}
              height={500}
              className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              data-aos="flip-left"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
