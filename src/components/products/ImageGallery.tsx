"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { images: string[]; title: string };

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : ["https://placehold.co/479x599"];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <Image
          src={list[active]}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-6">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden bg-gray-50 ${
                active === i ? "ring-1 ring-black" : ""
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}