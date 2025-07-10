"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import HeadlineCompo from "./HeadLineCompo";

const SwiperArticle = ({ articles }) => {
  return (
    <Swiper
      pagination={{ clickable: true }}
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      loop
    >
      {articles?.map((article) => (
        <SwiperSlide key={article.id}>
          <HeadlineCompo article={article} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperArticle;
