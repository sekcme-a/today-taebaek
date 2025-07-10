import ClientSwiperInit from "./ClientSwiperInit";
import { useId } from "react";

const SeoSafeSwiper = ({ articles, renderSlide }) => {
  const rawId = useId();
  const swiperId = `swiper-${rawId.replace(/[^a-zA-Z0-9-_]/g, "")}`;

  return (
    <div className={`swiper ${swiperId}`}>
      <ul className="swiper-wrapper">
        {articles?.map((article) => (
          <li key={article.id} className="swiper-slide">
            {renderSlide(article)}
          </li>
        ))}
      </ul>

      <div
        className={`custom-pagination ${swiperId} flex justify-center mt-3 hidden`}
      >
        {articles?.map((_, idx) => (
          <button
            key={idx}
            className="pagination-bullet w-2 h-2 bg-gray-500 rounded-full mx-1"
            data-index={idx}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div
        className={`custom-navigation ${swiperId} justify-end hidden md:flex`}
      >
        <button className="swiper-button-prev" aria-label="Previous slide">
          ◀
        </button>
        <button className="swiper-button-next" aria-label="Next slide">
          ▶
        </button>
      </div>

      <ClientSwiperInit swiperId={swiperId} totalSlides={articles.length} />
    </div>
  );
};

export default SeoSafeSwiper;
