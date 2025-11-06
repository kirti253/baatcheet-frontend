import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full px-4 pt-4 pb-8">
      <div className="ml-auto mr-0 flex max-w-7xl flex-col items-end justify-between gap-0 overflow-visible md:flex-row md:items-center lg:py-8">
        <div className="w-full md:w-1/2 md:pr-2 lg:pr-4">
          <div className="flex flex-col text-left">
            <h1 className="mb-4 max-w-[500px] text-6xl font-bold leading-[1.1] text-[#3d362f] sm:text-7xl lg:text-8xl">
              Casual Talk
              <br />
              with your
              <br />
              <span className="text-orange-500">Digital self.</span>
            </h1>
            <p className="mt-3 text-2xl text-[#3d362f]/80">
              convert your voice into text
            </p>
            <div className="mt-8">
              <button
                type="button"
                className="rounded-full bg-[#e07b2d] px-8 py-4 text-xl font-semibold text-white shadow-md hover:opacity-90"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-start md:w-1/2 ">
          <Image
            src="/images/herosection.svg"
            alt="Person chatting on a tablet"
            width={600}
            height={480}
            className="h-auto w-[520px] lg:w-[560px] xl:w-[600px] max-w-none rounded-2xl object-contain md:-ml-4 lg:-ml-6"
            priority
          />
        </div>
      </div>
    </section>
  );
}
