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
  const maxCharacters = 60;
  const noteCharacterCount = (delivery.note || "").length;

  const handleNoteChange = (text: string) => {
    setDelivery((p) => ({
      ...p,
      note: text.slice(0, maxCharacters),
    }));
  };

  return (
    <section className="mt-4">
      <h2 className="mb-[16px] text-[40px] leading-[54px] font-bold tracking-[-0.03em] text-black">
        Delivery Information
      </h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <input
            required
            name="fullName"
            value={delivery.fullName}
            onChange={(e) =>
              setDelivery((p) => ({ ...p, fullName: e.target.value }))
            }
            placeholder="Full Name"
            className={`${inputCls} h-14`}
          />
          {showErrors && !delivery.fullName.trim() && (
            <p className="mt-1 text-xs text-red-500">Required</p>
          )}
        </div>

        {/* Email + Phone */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <input
              required
              name="email"
              type="email"
              value={delivery.email}
              onChange={(e) =>
                setDelivery((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="Email"
              className={`${inputCls} h-14`}
            />
            {showErrors && !delivery.email.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>

          <div>
            <input
              required
              name="phone"
              value={delivery.phone}
              onChange={(e) =>
                setDelivery((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="Phone No"
              className={`${inputCls} h-14`}
            />
            {showErrors && !delivery.phone.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>
        </div>

        {/* Full Address */}
        <div>
          <input
            required
            name="address"
            value={delivery.address}
            onChange={(e) =>
              setDelivery((p) => ({ ...p, address: e.target.value }))
            }
            placeholder="Full Address"
            className={`${inputCls} h-14`}
          />
          {showErrors && !delivery.address.trim() && (
            <p className="mt-1 text-xs text-red-500">Required</p>
          )}
        </div>

        {/* Zilla + Thana */}
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
              className={`${selectCls} h-14`}
            >
              <option value="" disabled>
                Zilla
              </option>
              {ZILLAS.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-neutral-900 text-base">
              →
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
              className={`${selectCls} h-14 ${
                !delivery.zilla ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <option value="" disabled>
                Thana
              </option>
              {getThanas(delivery.zilla).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-neutral-900 text-base">
              →
            </div>

            {showErrors && !delivery.thana.trim() && (
              <p className="mt-1 text-xs text-red-500">Required</p>
            )}
          </div>
        </div>

        {/* Note */}
        <div>
          <textarea
            name="note"
            value={delivery.note || ""}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Note"
            rows={3}
            maxLength={maxCharacters}
            className={`${inputCls} min-h-[56px] resize-none pt-4`}
          />
          <p
            className={`mt-1 text-xs ${
              noteCharacterCount > Math.floor(maxCharacters * 0.9)
                ? "text-orange-500"
                : "text-neutral-500"
            }`}
          >
            {noteCharacterCount} / {maxCharacters} characters
          </p>
        </div>
      </div>
    </section>
  );
}
