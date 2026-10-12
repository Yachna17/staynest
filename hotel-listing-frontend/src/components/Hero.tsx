// Intro section on the landing page: heading, short text and one button.
// Text sizes grow with the screen (text-4xl on mobile up to text-8xl on large screens).
export default function Hero() {
  return (
    <section className="flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-4 py-16 text-center sm:gap-7">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-8xl">
        Find your next stay
      </h1>
      <p className="max-w-2xl text-base text-neutral-600 sm:text-xl lg:text-2xl">
        Hotels listed by real hosts, browsed by real travelers.
      </p>

      {/* href="#hotels" scrolls down to the element with id="hotels" (set in LandingPage) */}
      <a
        href="#hotels"
        className="rounded-full border border-black bg-black px-6 py-2.5 font-medium text-white transition hover:bg-neutral-800"
      >
        Browse Hotels
      </a>
    </section>
  );
}