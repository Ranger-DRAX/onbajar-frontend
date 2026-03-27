"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = { images: string[]; title: string };

export default function ImageGallery({ images, title }: Props) {
  const list = useMemo(
    () =>
      images && images.length > 0
        ? images
        : ["https://placehold.co/1200x1600?text=Product"],
    [images],
  );

  const [active, setActive] = useState(0);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative h-[65vh] w-full bg-white md:h-[72vh] xl:h-[82vh]">
        <Image
          src={list[active]}
          alt={title}
          fill
          priority
          className="object-contain object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 50vw"
        />
      </div>

      {list.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {list.slice(0, 6).map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-[72px] w-[56px] overflow-hidden border transition ${
                active === i
                  ? "border-black"
                  : "border-black/10 hover:border-black/35"
              }`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
