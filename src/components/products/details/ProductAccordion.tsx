export default function ProductAccordion() {
  return (
    <div className="mt-6 border-t border-black/15">
      {[
        "Quality Assurance",
        "Shipping and Easy Returns or Exchange",
        "Care Instructions",
      ].map((item) => (
        <details key={item} className="border-b border-black/15">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[15px]">
            <span>{item}</span>
            <svg
              className="h-4 w-4 text-black/50 transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <p className="pb-5 text-sm leading-7 text-black/55">
            Content coming soon.
          </p>
        </details>
      ))}
    </div>
  );
}
