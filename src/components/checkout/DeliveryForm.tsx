import { getThanas } from "@/lib/locations";
import { DeliveryInfo } from "@/lib/api/orders";
import { ZILLAS, inputCls, selectCls } from "./constants";
import { Dispatch, SetStateAction } from "react";

interface DeliveryFormProps {
  delivery: DeliveryInfo;
  setDelivery: Dispatch<SetStateAction<DeliveryInfo>>;
  showErrors: boolean;
}

export default function DeliveryForm({
  delivery,
  setDelivery,
  showErrors,
}: DeliveryFormProps) {
  return (
    <section className="mt-4">
      <h2 className="mb-[16px] text-[40px] leading-[54px] font-bold tracking-[-0.03em] text-black">
        Delivery Information
      </h2>
      <div className="space-y-4">
        <div className="relative">
          <input
            required
            name="fullName"
            value={delivery.fullName}
            onChange={(e) =>
              setDelivery((p) => ({ ...p, fullName: e.target.value }))
            }
            placeholder=" "
            className={`${inputCls} peer h-14 pt-5 pb-1`}
          />
          <label className="pointer-events-none absolute top-4 left-3 text-base text-neutral-400 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500">
            Full Name
          </label>
          {showErrors && !delivery.fullName.trim() && (
            <p className="mt-1 text-xs text-red-500">Required</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <input
              required
              name="email"
              type="email"
              value={delivery.email}
              onChange={(e) =>
                setDelivery((p) => ({ ...p, email: e.target.value }))
              }
              placeholder=" "
              className={`${inputCls} peer h-14 pt-5 pb-1`}
            />
            <label className="pointer-events-none absolute top-4 left-3 text-base text-neutral-400 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500">
              Email
            </label>
            {showErrors && !delivery.email.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>
          <div className="relative">
            <input
              required
              name="phone"
              value={delivery.phone}
              onChange={(e) =>
                setDelivery((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder=" "
              className={`${inputCls} peer h-14 pt-5 pb-1`}
            />
            <label className="pointer-events-none absolute top-4 left-3 text-base text-neutral-400 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500">
              Phone No
            </label>
            {showErrors && !delivery.phone.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>
        </div>

        <div className="relative">
          <input
            required
            name="address"
            value={delivery.address}
            onChange={(e) =>
              setDelivery((p) => ({ ...p, address: e.target.value }))
            }
            placeholder=" "
            className={`${inputCls} peer h-14 pt-5 pb-1`}
          />
          <label className="pointer-events-none absolute top-4 left-3 text-base text-neutral-400 transition-all peer-focus:top-1 peer-focus:text-xs peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500">
            Full Address
          </label>
          {showErrors && !delivery.address.trim() && (
            <p className="mt-1 text-xs text-red-500">Required</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <select
              required
              name="zilla"
              value={delivery.zilla}
              onChange={(e) =>
                setDelivery((p) => ({
                  ...p,
                  zilla: e.target.value,
                  thana: "",
                }))
              }
              className={`${selectCls} pt-1`}
            >
              <option value="" disabled></option>
              {ZILLAS.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <label
              className={`pointer-events-none absolute top-2.5 left-3 text-base text-neutral-900 transition-all ${
                delivery.zilla ? "hidden" : ""
              }`}
            >
              Zilla
            </label>
            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              <div className="h-0 w-0 border-t-[6px] border-r-[6px] border-l-[6px] border-t-neutral-900 border-r-transparent border-l-transparent" />
            </div>
            {showErrors && !delivery.zilla.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>

          <div className="relative">
            <select
              required
              name="thana"
              value={delivery.thana}
              disabled={!delivery.zilla}
              onChange={(e) =>
                setDelivery((p) => ({ ...p, thana: e.target.value }))
              }
              className={`${selectCls} pt-1 ${
                !delivery.zilla ? "cursor-not-allowed bg-neutral-100" : ""
              }`}
            >
              <option value="" disabled></option>
              {getThanas(delivery.zilla).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label
              className={`pointer-events-none absolute top-2.5 left-3 text-base text-neutral-900 transition-all ${
                delivery.thana ? "hidden" : ""
              }`}
            >
              Thana
            </label>
            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              <div className="h-0 w-0 border-t-[6px] border-r-[6px] border-l-[6px] border-t-neutral-900 border-r-transparent border-l-transparent" />
            </div>
            {showErrors && !delivery.thana.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>
        </div>

        <div className="relative">
          <textarea
            name="note"
            value={delivery.note}
            onChange={(e) =>
              setDelivery((p) => ({ ...p, note: e.target.value }))
            }
            placeholder=" "
            rows={1}
            className={`${inputCls} peer min-h-[40px] resize-none pt-3`}
          />
          <label className="pointer-events-none absolute top-2.5 left-3 bg-white px-1 text-base text-neutral-400 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500">
            Note
          </label>
        </div>
      </div>
    </section>
  );
}
