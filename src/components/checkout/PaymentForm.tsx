import { Dispatch, SetStateAction } from "react";

interface PaymentFormProps {
  paymentMethod: "COD" | "Bkash";
  setPaymentMethod: Dispatch<SetStateAction<"COD" | "Bkash">>;
  bkash: { customerPhone: string; transactionId: string };
  setBkash: Dispatch<
    SetStateAction<{ customerPhone: string; transactionId: string }>
  >;
  showErrors: boolean;
}

const optionCls =
  "flex h-[41px] w-[229px] items-center justify-between border-[0.75px] border-[#121212] px-[14px] text-[14px] leading-[19px] transition-colors";

const fieldCls =
  "h-[41px] w-full border-[0.75px] border-[#121212] bg-transparent px-[12px] text-[15px] leading-[20px] text-black outline-none placeholder:text-[#969696]";

function ArrowIcon({ white = false }: { white?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M5 12H19"
        stroke={white ? "#FFFFFF" : "#121212"}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke={white ? "#FFFFFF" : "#121212"}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PaymentForm({
  paymentMethod,
  setPaymentMethod,
  bkash,
  setBkash,
  showErrors,
}: PaymentFormProps) {
  return (
    <section className="mb-14 max-w-[470px]">
      <h2 className="mb-[28px] text-[40px] leading-[54px] font-bold tracking-[-0.03em] text-black">
        Payment Options
      </h2>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setPaymentMethod("COD")}
          className={`${optionCls} ${
            paymentMethod === "COD"
              ? "bg-[#121212] text-white"
              : "bg-white text-black"
          }`}
        >
          <span>Cash on Delivery</span>
          <ArrowIcon white={paymentMethod === "COD"} />
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod("Bkash")}
          className={`${optionCls} ${
            paymentMethod === "Bkash"
              ? "bg-[#121212] text-white"
              : "bg-white text-black"
          }`}
        >
          <span>bKash</span>
          <ArrowIcon white={paymentMethod === "Bkash"} />
        </button>
      </div>

      {paymentMethod === "Bkash" && (
        <div className="mt-[18px] max-w-[470px]">
          <p className="mb-4 text-[14px] leading-[19px] text-black">
            Please pay to 019+++++++ and enter your payment credentials below.
          </p>

          <div>
            <input
              required
              placeholder="Your bKash Number"
              value={bkash.customerPhone}
              onChange={(e) =>
                setBkash((b) => ({ ...b, customerPhone: e.target.value }))
              }
              className={fieldCls}
            />
            {showErrors && !bkash.customerPhone.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>

          <div className="mt-4">
            <input
              required
              placeholder="Transaction ID"
              value={bkash.transactionId}
              onChange={(e) =>
                setBkash((b) => ({ ...b, transactionId: e.target.value }))
              }
              className={fieldCls}
            />
            {showErrors && !bkash.transactionId.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
