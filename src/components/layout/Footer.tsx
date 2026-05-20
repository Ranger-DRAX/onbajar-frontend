import Link from "next/link";
import Image from "next/image";
import FooterLogo from "@/assets/OnbajarLogo-2.svg";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black via-zinc-950 to-zinc-900 text-zinc-200">
      <div className="w-full px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-16 lg:gap-26 lg:grid-cols-12 lg:items-start">
          {/* Left: Brand + Contact */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={FooterLogo}
                alt="Onbajar"
                width={230}
                height={60}
                priority
              />
            </Link>

            <p className="mt-5 max-w-[420px] text-[15px] leading-[1.15] text-[#E5E5E5]">
              Onbajar delivers authentic club jerseys, sports kits, and regular
              essential t-shirts, building Bangladesh&apos;s brand across the
              world.
            </p>

            <ul className="mt-8 space-y-4 text-[15px] leading-[1.1] text-[#F2F2F2]">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-[#D9D9D9]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 22s7-5.686 7-12a7 7 0 10-14 0c0 6.314 7 12 7 12z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 13a3 3 0 100-6 3 3 0 000 6z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="max-w-[420px]">
                  Hazaribagh Bazar (Opposite of Al Arafah Islami Bank),
                  Hazaribagh, Dhaka
                </span>
              </li>

              <li className="flex items-center gap-3">
                <span className="shrink-0 text-[#D9D9D9]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 012.08 4.18 2 2 0 014.06 2h3a2 2 0 012 1.72c.12.86.31 1.7.57 2.5a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.58-1.66a2 2 0 012.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0122 16.92z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <a
                  href="tel:+8801982733499"
                  className="transition-colors hover:text-white"
                >
                  +8801982733499
                </a>
              </li>

              <li className="flex items-center gap-3">
                <span className="shrink-0 text-[#D9D9D9]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0114.2 6h2.3v3h-2.3c-.6 0-.9.4-.9 1v2h3.1l-.5 3h-2.6v7A10 10 0 0022 12z"
                      fill="currentColor"
                    />
                  </svg>
                </span>

                <a
                  href="https://facebook.com/onbajar"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  facebook.com/onbajar
                </a>
              </li>
            </ul>
          </div>

          {/* Middle: Customer Service */}
          <div className="lg:col-span-3 lg:pt-14 lg:pl-10">
            <ul className="mt-8 space-y-1 text-[16px] leading-[153%] font-normal tracking-[-0.03em] text-[#F2F2F2]">
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-white"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="transition-colors hover:text-white"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-white"
                >
                  Terms/ Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: Stay Connected */}
          <div className="lg:col-span-4 lg:pt-14 lg:pl-10">
            <h3 className="text-[18px] leading-[1.2] font-semibold text-[#F2F2F2]">
              Stay Connected
            </h3>

            <p className="mt-4 max-w-[340px] text-[15px] leading-[1.15] text-[#E5E5E5]">
              Be one of the first to receive new product launches, sale offers,
              collabs &amp; more.
            </p>

            <form className="mt-6">
              <label htmlFor="footer-email" className="sr-only">
                Your Email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your Email"
                className="h-[38px] w-full max-w-[280px] border border-[#D9D9D9] bg-transparent px-4 text-[15px] text-white transition outline-none placeholder:text-[#D9D9D9] focus:border-white"
              />
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
