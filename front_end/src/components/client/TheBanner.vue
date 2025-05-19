<template>
  <div class="sec-banner bg0 p-t-80 p-b-50">
    <div class="container">
      <div class="banner-slideshow">
        <div class="slides-container" ref="slidesContainer">
          <div
            v-for="(banner, index) in banners"
            :key="index"
            class="slide-item"
          >
            <div class="block1 wrap-pic-w">
              <img :src="banner.image" alt="IMG-BANNER" class="banner-image" />
              <a
                class="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
              >
                <div class="block1-txt-child1 flex-col-l"></div>
                <div class="block1-txt-child2 p-b-4 trans-05">
                  <div class="block1-link stext-101 cl0 trans-09 f-arial">
                    Đặt ngay
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="slide-controls">
          <button class="slide-btn prev-btn" @click="prevSlide">&lt;</button>
          <button class="slide-btn next-btn" @click="nextSlide">&gt;</button>
        </div>

        <div class="slide-indicators">
          <span
            v-for="(banner, index) in banners"
            :key="index"
            :class="['indicator', { active: currentSlide === index }]"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import config from "@/configs/config";

export default {
  setup() {
    const banners = ref([
      { image: "/images/banner/banner1.jpg" },
      { image: "/images/banner/banner2.jpg" },
      { image: "/images/banner/banner3.jpg" },
    ]);

    const currentSlide = ref(0);
    const slidesContainer = ref(null);
    let slideInterval = null;

    const goToSlide = (index) => {
      currentSlide.value = index;
      updateSlidePosition();
    };

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % banners.value.length;
      updateSlidePosition();
    };

    const prevSlide = () => {
      currentSlide.value =
        (currentSlide.value - 1 + banners.value.length) % banners.value.length;
      updateSlidePosition();
    };

    const updateSlidePosition = () => {
      if (slidesContainer.value) {
        const translateValue = -currentSlide.value * 100;
        slidesContainer.value.style.transform = `translateX(${translateValue}%)`;
      }
    };

    const startAutoSlide = () => {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    };

    const stopAutoSlide = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };

    onMounted(() => {
      updateSlidePosition();
      startAutoSlide();

      if (slidesContainer.value) {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
          touchStartX = e.touches[0].clientX;
          stopAutoSlide();
        };

        const handleTouchMove = (e) => {
          touchEndX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
          const touchDiff = touchStartX - touchEndX;

          if (Math.abs(touchDiff) > 50) {
            if (touchDiff > 0) {
              nextSlide();
            } else {
              prevSlide();
            }
          }

          startAutoSlide();
        };

        slidesContainer.value.addEventListener("touchstart", handleTouchStart);
        slidesContainer.value.addEventListener("touchmove", handleTouchMove);
        slidesContainer.value.addEventListener("touchend", handleTouchEnd);
      }
    });

    onBeforeUnmount(() => {
      stopAutoSlide();
    });

    return {
      config,
      banners,
      currentSlide,
      slidesContainer,
      nextSlide,
      prevSlide,
      goToSlide,
    };
  },
};
</script>

<style scoped>
.f-arial,
span {
  color: #ccc;
}

.banner-slideshow {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slides-container {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.slide-item {
  min-width: 100%;
  flex-shrink: 0;
}

.block1 {
  position: relative;
  height: 500px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
  transition: transform 0.5s ease;
}

.block1:hover .banner-image {
  transform: scale(1.05);
}

.slide-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  z-index: 10;
}

.slide-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.slide-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.slide-indicators {
  position: absolute;
  bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.indicator.active {
  background-color: white;
}

@media (max-width: 768px) {
  .slide-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .indicator {
    width: 8px;
    height: 8px;
  }
}
</style>
