<script>
  import { onMount } from "svelte";

  let { data } = $props();

  let currentSlide = $state(0);
  let intervalId;

  let currentSlideNumber = $derived(String(currentSlide + 1).padStart(2, "0"));
  let totalSlidesNumber = $derived(String(data.images.length).padStart(2, "0"));

  function nextSlide() {
    currentSlide =
      currentSlide === data.images.length - 1 ? 0 : currentSlide + 1;
  }

  function previousSlide() {
    currentSlide =
      currentSlide === 0 ? data.images.length - 1 : currentSlide - 1;
  }

  function goToSlide(index) {
    currentSlide = index;
  }

  onMount(() => {
    intervalId = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  });
</script>

<main class="home-page">
  <section class="hero-slider">
    {#if data.images.length > 0}
      <div class="slider-stage">
        <button
          class="slider-arrow slider-arrow-left"
          onclick={previousSlide}
          aria-label="Previous slide"
        >
          ←
        </button>

        <div class="image-frame">
          <img
            src={data.images[currentSlide].src}
            alt={data.images[currentSlide].alt}
          />
        </div>

        <button
          class="slider-arrow slider-arrow-right"
          onclick={nextSlide}
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      <div class="slide-counter">
        <span>{currentSlideNumber}</span>
        <span class="counter-line"></span>
        <span>{totalSlidesNumber}</span>
      </div>

      <div class="slider-bottom">
        <div class="progress-dashes">
          {#each data.images as image, index}
            <button
              class:active={index === currentSlide}
              onclick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          {/each}
        </div>

        <a href="/exhibitions/2026" class="view-works-link"> View works </a>
      </div>
    {/if}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    font-family: Georgia, "Times New Roman", serif;
    background: #f7f6f4;
    color: #6f6b68;
  }

  .home-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 100px;
    padding-bottom: 100px;
    box-sizing: border-box;
    overflow: hidden;
    background: radial-gradient(circle at center, #ffffff 0%, #f7f6f4 65%);
  }

  .hero-slider {
    width: min(76vw, 1200px);
    margin: auto;
  }

  .slider-stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-frame {
    width: min(60vw, 760px);
    height: min(70vh, 760px);
    overflow: hidden;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-frame img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    object-position: center;
  }

  .slider-arrow {
    position: absolute;
    top: 50%;
    z-index: 5;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    color: #6f6b68;
    font-family: inherit;
    font-size: 34px;
    line-height: 1;
    cursor: pointer;
    padding: 12px;
  }

  .slider-arrow-left {
    left: -72px;
  }

  .slider-arrow-right {
    right: -72px;
  }

  .slide-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 14px;
    color: #9d9691;
    font-size: 13px;
    font-style: normal;
    letter-spacing: 0.08em;
  }

  .counter-line {
    width: 28px;
    height: 1px;
    background: #c8c0ba;
  }

  .slider-bottom {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    margin-top: 26px;
  }

  .progress-dashes {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transform: translateX(95px);
  }

  .progress-dashes button {
    width: 46px;
    height: 2px;
    border: 0;
    background: #d7d1cc;
    padding: 0;
    cursor: pointer;
  }

  .progress-dashes button.active {
    background: #6f6b68;
  }

  .view-works-link {
    color: #6f6b68;
    font-size: 18px;
    font-style: normal;
    line-height: 1.2;
    text-decoration: underline;
    text-underline-offset: 5px;
    text-decoration-thickness: 1px;
    white-space: nowrap;
  }

  .view-works-link:hover {
    color: #4f4a46;
  }

  @media (max-width: 900px) {
    .hero-slider {
      width: 78vw;
    }

    .slider-arrow-left {
      left: -48px;
    }

    .slider-arrow-right {
      right: -48px;
    }

    .slider-bottom {
      grid-template-columns: 1fr;
      gap: 24px;
      text-align: center;
    }

    .progress-dashes {
      transform: none;
    }

    .view-works-link {
      justify-self: center;
    }
  }

  @media (max-width: 600px) {
    .hero-slider {
      width: 76vw;
    }

    .image-frame {
      width: 82vw;
      height: 62vh;
    }

    .slider-arrow {
      font-size: 28px;
      padding: 8px;
    }

    .slider-arrow-left {
      left: -38px;
    }

    .slider-arrow-right {
      right: -38px;
    }

    .slide-counter {
      font-size: 12px;
      margin-top: 12px;
    }

    .counter-line {
      width: 22px;
    }

    .progress-dashes button {
      width: 34px;
    }

    .view-works-link {
      font-size: 16px;
    }
  }
</style>
