import Link from "next/link";
import Image from "next/image";
import CheckoutHeaderLogo from "@/assets/CheckoutHeaderLogo.svg";
import SecurityIcon from "@/assets/image/SecurityIcon.svg";

export default function CheckoutHeader() {
  return (
    <header className="fixed top-0 z-50 h-[70px] w-full bg-[#0A0A0A]">
      <div className="relative mx-auto flex h-full w-full items-center justify-center px-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center"
          aria-label="Go to homepage"
        >
          <Image
            src={CheckoutHeaderLogo}
            alt="Onbajar"
            width={171}
            height={38}
            priority
            className="h-auto w-[140px] sm:w-[140px]"
          />
        </Link>

        <div className="absolute top-1/2 right-6 flex -translate-y-1/2 items-center gap-2 md:right-12">
          <span className="text-[15px] leading-5 font-medium tracking-[-0.03em] text-[#F2F2F2]">
            SECURE CHECKOUT
          </span>
          <Image src={SecurityIcon} alt="Security" className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
}
