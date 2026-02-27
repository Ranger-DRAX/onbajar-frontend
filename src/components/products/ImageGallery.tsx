"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { images: string[]; title: string };

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : ["https://placehold.co/479x599"];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full aspect-4/5 bg-[#f5f5f5] overflow-hidden">
        <Image
          src={list[active]}
          alt={title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={[
                "relative shrink-0 w-16 h-20 bg-[#f5f5f5] border-2 transition-colors overflow-hidden",
                i === active ? "border-black" : "border-transparent hover:border-gray-300",
              ].join(" ")}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
