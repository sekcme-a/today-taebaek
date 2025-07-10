"use client";

import { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import { Navigation, Autoplay } from "swiper/modules"; // ⬅️ Autoplay 추가

const ClientSwiperInit = ({ swiperId, totalSlides }) => {
  useEffect(() => {
    const swiperContainer = document.querySelector(`.${swiperId}`);
    const paginationEl = document.querySelector(
      `.custom-pagination.${swiperId}`
    );
    const navPrevEl = document.querySelector(
      `.custom-navigation.${swiperId} .swiper-button-prev`
    );
    const navNextEl = document.querySelector(
      `.custom-navigation.${swiperId} .swiper-button-next`
    );

    if (!swiperContainer || !paginationEl || !navPrevEl || !navNextEl) {
      console.warn("Swiper or one of the controls not found");
      return;
    }

    const bullets = paginationEl.querySelectorAll(".pagination-bullet");

    const updateActivePagination = (activeIndex) => {
      bullets.forEach((bullet, idx) => {
        bullet.classList.toggle("active", idx === activeIndex);
      });
    };

    const swiper = new Swiper(swiperContainer, {
      modules: [Navigation, Autoplay], // ⬅️ Autoplay 포함
      spaceBetween: 20,
      slidesPerView: 1,
      navigation: {
        prevEl: navPrevEl,
        nextEl: navNextEl,
      },
      loop: true,
      autoplay: {
        delay: 3000, // 3초마다 자동 넘김
        disableOnInteraction: false, // 사용자 조작 후에도 계속 자동
      },
      on: {
        slideChange(swiperInstance) {
          updateActivePagination(swiperInstance.activeIndex);
        },
      },
    });

    bullets.forEach((bullet, idx) => {
      bullet.addEventListener("click", () => {
        swiper.slideTo(idx);
      });
    });

    updateActivePagination(0);

    return () => {
      swiper.destroy(true, false);
    };
  }, [swiperId, totalSlides]);

  return null;
};

export default ClientSwiperInit;
