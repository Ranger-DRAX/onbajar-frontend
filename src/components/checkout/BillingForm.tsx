import { BillingInfo } from "@/lib/api/orders";
import { Dispatch, SetStateAction } from "react";

interface BillingFormProps {
  billing: BillingInfo;
  setBilling: Dispatch<SetStateAction<BillingInfo>>;
  showErrors: boolean;
}

const optionBase =
  "flex h-14 items-center gap-[10px] px-[14px] text-[14px] leading-[19px] transition-colors";

const fieldBase =
  "h-14 w-full border-none bg-[#f5f5f5] px-3 text-[15px] leading-[20px] text-black outline-none placeholder:text-[#969696] transition-colors focus:bg-[#ebebeb]";

function Radio({ active, dark }: { active: boolean; dark?: boolean }) {
  return (
    <span
      className={`relative block h-[12px] w-[12px] rounded-full border ${
        dark ? "border-white" : "border-black"
      }`}
    >
      {active && (
        <span
          className={`absolute top-1/2 left-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
            dark ? "bg-white" : "bg-black"
          }`}
        />
      )}
    </span>
  );
}

export default function BillingForm({
  billing,
  setBilling,
  showErrors,
}: BillingFormProps) {
  return (
    <section className="mt-4 mb-14 max-w-[703px]">
      <h2 className="mb-[16px] text-[40px] leading-[54px] font-bold tracking-[-0.03em] text-black">
        Billing Information
      </h2>

      <div className="grid gap-[9px] md:grid-cols-2">
        <button
          type="button"
          onClick={() => setBilling((b) => ({ ...b, sameAsDelivery: true }))}
          className={`${optionBase} ${
            billing.sameAsDelivery
              ? "bg-[#121212] text-white"
              : "bg-[#f5f5f5] text-black hover:bg-[#ebebeb]"
          }`}
        >
          <Radio active={billing.sameAsDelivery} dark={billing.sameAsDelivery} />
          <span>Same as delivery information</span>
        </button>

        <button
          type="button"
          onClick={() => setBilling((b) => ({ ...b, sameAsDelivery: false }))}
          className={`${optionBase} ${
            !billing.sameAsDelivery
              ? "bg-[#121212] text-white"
              : "bg-[#f5f5f5] text-black hover:bg-[#ebebeb]"
          }`}
        >
          <Radio
            active={!billing.sameAsDelivery}
            dark={!billing.sameAsDelivery}
          />
          <span>Use a different billing information</span>
        </button>
      </div>

      {!billing.sameAsDelivery && (
        <div className="mt-[18px]">
          <div>
            <input
              required={!billing.sameAsDelivery}
              placeholder="Full Name"
              value={billing.fullName ?? ""}
              onChange={(e) =>
                setBilling((b) => ({ ...b, fullName: e.target.value }))
              }
              className={fieldBase}
            />
            {showErrors && !billing.fullName?.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>

          <div className="mt-[18px] grid gap-[17px] md:grid-cols-2">
            <div>
              <input
                required={!billing.sameAsDelivery}
                type="email"
                placeholder="Email"
                value={billing.email ?? ""}
                onChange={(e) =>
                  setBilling((b) => ({ ...b, email: e.target.value }))
                }
                className={fieldBase}
              />
              {showErrors && !billing.email?.trim() && (
                <p className="mt-1 text-xs text-red-500">Required</p>
              )}
            </div>

            <div>
              <input
                required={!billing.sameAsDelivery}
                placeholder="Phone No"
                value={billing.phone ?? ""}
                onChange={(e) =>
                  setBilling((b) => ({ ...b, phone: e.target.value }))
                }
                className={fieldBase}
              />
              {showErrors && !billing.phone?.trim() && (
                <p className="mt-1 text-xs text-red-500">Required</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
