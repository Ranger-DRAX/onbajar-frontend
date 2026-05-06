"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

import HappyCustomerImage from "@/assets/image/HappyCustomerImage.png";

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const reviews = [
  {
    id: 1,
    headline: "COMFORT MEETS COOL!",
    story:
      "These sneakers live up to their hype. Love the unique colour plays, the creative concepts behind each pair, and the comfort when wearing them. Never Shy, Never Sorry.",
    image: HappyCustomerImage,
    name: "Fatima Rahman",
  },
  {
    id: 2,
    headline: "QUALITY YOU CAN FEEL!",
    story:
      "Wonderful products at fair prices. I've been a loyal customer for over a year now and every single order has been perfect. The customer support team is also incredibly helpful!",
    image: HappyCustomerImage,
    name: "Nusrat Jahan",
  },
  {
    id: 3,
    headline: "EXCEEDED ALL EXPECTATIONS!",
    story:
      "OnBazar exceeded all my expectations. The item arrived beautifully wrapped and exactly as described. My kids went crazy over it! This is now my go-to place for all special occasion gifts.",
    image: HappyCustomerImage,
    name: "Samira Hossain",
  },
  {
    id: 4,
    headline: "LOVED EVERY MOMENT!",
    story:
      "The gift packaging was so beautiful! I bought it as a wedding anniversary gift and my husband was thrilled. The personalisation was spot on and the whole experience was seamless.",
    image: HappyCustomerImage,
    name: "Mariam Begum",
  },
  {
    id: 5,
    headline: "PERFECT FOR EVERY OCCASION!",
    story:
      "Ordered three items last Eid and every single one was perfect. The attention to detail in packaging and the speed of delivery really sets OnBazar apart. I recommend it to all my friends!",
    image: HappyCustomerImage,
    name: "Ayesha Sultana",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function ReviewSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="review-section" aria-label="Customer Reviews">
      {/* Header */}
      <div className="review-section__header">
        <h2 className="text-[56px] font-medium leading-[80px] tracking-[-0.04em] text-[#121212]">What&rsquo;re they saying?</h2>
        <p className="review-section__label">Review</p>
      </div>

      {/* Carousel */}
      <div className="review-section__carousel">
        <Swiper
          modules={[Autoplay, A11y]}
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          spaceBetween={16}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            /* tablet and up → exactly 2 */
            1024: { slidesPerView: 2, spaceBetween: 28 },
          }}
          a11y={{
            prevSlideMessage: "Previous review",
            nextSlideMessage: "Next review",
          }}
          className="review-swiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <article
                className="review-card"
                aria-label={`Review by ${review.name}`}
              >
                {/* Image — full left on desktop, full top on mobile */}
                <div className="review-card__img-wrap">
                  <Image
                    src={review.image}
                    alt={`${review.name} — happy OnBazar customer`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 22vw"
                    className="review-card__img"
                  />
                </div>

                {/* Text body */}
                <div className="review-card__body">
                  <h3 className="review-card__headline">{review.headline}</h3>
                  <p className="review-card__story">{review.story}</p>
                  <span className="review-card__name">— {review.name}</span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Bottom navigation */}
      <div className="review-section__nav">
        <button
          id="review-prev-btn"
          className="review-section__nav-btn"
          aria-label="Previous review"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          ← Previous
        </button>
        <button
          id="review-next-btn"
          className="review-section__nav-btn"
          aria-label="Next review"
          onClick={() => swiperRef.current?.slideNext()}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
