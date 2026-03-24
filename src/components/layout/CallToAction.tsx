import Image from "next/image";
import BulkOrderIcon from "@/assets/image/localMallIcon.svg";
import DeliveryIcon from "@/assets/image/deliveryIcon.svg";

export default function CallToAction() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F1F1F1]">
      <div className="relative mx-auto h-[398px] max-w-[1905px] bg-[#F1F1F1]">
        <div className="grid h-full grid-cols-2">
          {/* Bulk Order */}
          <div className="flex items-center justify-center bg-[#F1F1F1]">
            <div className="flex flex-col items-center text-center">
              <a
                href="tel:+8801712345678"
                aria-label="Call for bulk order"
                className="mb-6 inline-block"
              >
                <Image
                  src={BulkOrderIcon}
                  alt="Bulk order icon"
                  className="h-9 w-9 cursor-pointer"
                />
              </a>
              <h3 className="text-xl font-normal text-black uppercase">
                FOR BULK ORDER
              </h3>
              <a
                href="tel:+8801712345678"
                className="mt-2 text-base font-normal text-black uppercase hover:underline"
              >
                CALL NOW
              </a>
            </div>
          </div>

          {/* Same Day Delivery */}
          <div className="flex items-center justify-center bg-[#F1F1F1]">
            <div className="flex flex-col items-center text-center">
              <a
                href="tel:+8801812345678"
                aria-label="Call for same day delivery"
                className="mb-6 inline-block"
              >
                <Image
                  src={DeliveryIcon}
                  alt="Same day delivery icon"
                  className="h-10 w-10 cursor-pointer"
                />
              </a>
              <h3 className="text-xl font-normal text-black uppercase">
                FOR SAME DAY DELIVERY
              </h3>
              <a
                href="tel:+8801812345678"
                className="mt-2 text-base font-normal text-black uppercase hover:underline"
              >
                CALL NOW (8PM TO 10AM)
              </a>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="pointer-events-none absolute top-[4px] left-1/2 z-10 h-[387px] w-px -translate-x-1/2 bg-[#6E6E6E]" />
      </div>
    </section>
  );
}
