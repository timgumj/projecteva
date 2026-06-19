<script>
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  let selectedYearSlug = $state(data.years?.[0]?.yearSlug || "");
  let selectedImageIndex = $state(null);

  let selectedYear = $derived(
    data.years?.find((year) => year.yearSlug === selectedYearSlug) ||
      data.years?.[0],
  );

  let selectedImages = $derived(selectedYear?.images || []);

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  function selectYear(year) {
    selectedYearSlug = year.yearSlug;
    selectedImageIndex = null;
  }

  function openLightbox(index) {
    selectedImageIndex = index;

    if (browser) {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    selectedImageIndex = null;

    if (browser) {
      document.body.style.overflow = "";
    }
  }

  function showPreviousImage() {
    if (!selectedImages.length || selectedImageIndex === null) return;

    selectedImageIndex =
      selectedImageIndex === 0
        ? selectedImages.length - 1
        : selectedImageIndex - 1;
  }

  function showNextImage() {
    if (!selectedImages.length || selectedImageIndex === null) return;

    selectedImageIndex =
      selectedImageIndex === selectedImages.length - 1
        ? 0
        : selectedImageIndex + 1;
  }

  function handleKeydown(event) {
    if (selectedImageIndex === null) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPreviousImage();
    }

    if (event.key === "ArrowRight") {
      showNextImage();
    }
  }

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>Painting | Eva Eichinger</title>

  <meta
    name="description"
    content="Explore painting works by Eva Eichinger, arranged by year."
  />
</svelte:head>

<main class="painting-page">
  {#if data.years && data.years.length > 0}
    <section class="painting-feature" aria-label="Painting works by year">
      <aside class="painting-list-column" aria-label="Painting years">
        <div class="painting-heading">
          <h1 class="painting-label">Painting</h1>
        </div>

        <div class="painting-scroll-area">
          <p class="mobile-helper">Tap year to preview works</p>

          <div class="painting-year-links">
            {#each data.years as year}
              <button
                type="button"
                class="painting-year-button"
                class:active={selectedYear?.yearSlug === year.yearSlug}
                onmouseenter={() => selectYear(year)}
                onfocus={() => selectYear(year)}
                onclick={() => selectYear(year)}
              >
                {year.year}
              </button>
            {/each}
          </div>
        </div>
      </aside>

      <div class="painting-image-column">
        <div class="painting-grid-frame">
          <div class="painting-info">
            <span>{selectedYear?.year}</span>

            {#if selectedYear?.title}
              <h2>{selectedYear.title}</h2>
            {/if}

            {#if selectedYear?.info}
              <p>{selectedYear.info}</p>
            {/if}
          </div>

          {#if selectedYear?.images?.length}
            {#key selectedYear.yearSlug}
              <div class="painting-grid">
                {#each selectedYear.images as image, index}
                  <button
                    type="button"
                    class="painting-card"
                    onclick={() => openLightbox(index)}
                    aria-label={`Open ${image.alt || selectedYear.year}`}
                  >
                    <img src={image.src} alt={image.alt || selectedYear.year} />

                    {#if image.alt}
                      <span>{image.alt}</span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/key}
          {:else}
            <p class="empty-message">No images found for this year.</p>
          {/if}
        </div>
      </div>
    </section>
  {:else}
    <p class="empty-message">No painting years found.</p>
  {/if}

  {#if selectedImage}
    <div class="painting-lightbox" role="dialog" aria-modal="true">
      <button
        class="lightbox-close"
        type="button"
        onclick={closeLightbox}
        aria-label="Close image viewer"
      >
        Close ×
      </button>

      <button
        class="lightbox-arrow lightbox-arrow-left"
        type="button"
        onclick={showPreviousImage}
        aria-label="Previous image"
      >
        ←
      </button>

      <div class="lightbox-content">
        <img
          src={selectedImage.src}
          alt={selectedImage.alt || selectedYear.year}
        />

        <div class="lightbox-meta">
          <span>
            {String(selectedImageIndex + 1).padStart(2, "0")} — {String(
              selectedImages.length,
            ).padStart(2, "0")}
          </span>

          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else}
            <p>{selectedYear.year}</p>
          {/if}
        </div>
      </div>

      <button
        class="lightbox-arrow lightbox-arrow-right"
        type="button"
        onclick={showNextImage}
        aria-label="Next image"
      >
        →
      </button>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    font-family: Georgia, "Times New Roman", serif;
    background: #ffffff;
    color: #4d4a47;
  }

  .painting-page {
    width: 100%;
    min-height: 100vh;
    padding: 116px 40px 92px;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .painting-feature {
    width: 100%;
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: clamp(34px, 5vw, 82px);
    align-items: center;
  }

  .painting-list-column {
    width: 100%;
    max-width: 220px;
    height: min(58vh, 620px);
    justify-self: start;
    display: flex;
    flex-direction: column;
  }

  .painting-heading {
    margin-bottom: 34px;
  }

  .painting-label {
    margin: 0;
    color: #3f3c39;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.15;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .painting-scroll-area {
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .painting-scroll-area::-webkit-scrollbar {
    display: none;
  }

  .mobile-helper {
    display: none;
  }

  .painting-year-links {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .painting-year-button {
    width: fit-content;
    max-width: 100%;
    display: inline-block;
    padding: 0;
    border: 0;
    background: transparent;
    color: #77716d;
    font-family: inherit;
    font-size: 18px;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.08em;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      color 0.35s ease,
      opacity 0.35s ease;
  }

  .painting-year-button::after {
    content: "";
    display: block;
    width: 0;
    height: 1px;
    margin-top: 5px;
    background: currentColor;
    transition: width 0.5s ease;
  }

  .painting-year-button:hover,
  .painting-year-button:focus,
  .painting-year-button.active {
    color: #1f1f1f;
  }

  .painting-year-button:hover::after,
  .painting-year-button:focus::after,
  .painting-year-button.active::after {
    width: 100%;
  }

  .painting-image-column {
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .painting-grid-frame {
    width: 100%;
    height: min(82vh, 880px);
    overflow-y: auto;
    overflow-x: hidden;
    background: #ffffff;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .painting-grid-frame::-webkit-scrollbar {
    display: none;
  }

  .painting-info {
    max-width: 760px;
    margin-bottom: 34px;
  }

  .painting-info span,
  .painting-info h2,
  .painting-info p {
    margin: 0;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .painting-info span {
    display: block;
    margin-bottom: 10px;
    color: #6f8f72;
    font-size: 12px;
  }

  .painting-info h2 {
    color: #2f2d2b;
    font-size: 22px;
  }

  .painting-info p {
    margin-top: 10px;
    color: #8f8883;
    font-size: 13px;
    line-height: 1.4;
  }

  .painting-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 26px;
    animation: imageReveal 0.85s ease both;
  }

  .painting-card {
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
  }

  .painting-card img {
    width: 100%;
    aspect-ratio: 4 / 5;
    display: block;
    object-fit: cover;
    object-position: center;
    background: #f8f6f4;
    transition:
      transform 0.45s ease,
      opacity 0.3s ease;
  }

  .painting-card:hover img,
  .painting-card:focus img {
    transform: scale(1.025);
    opacity: 0.94;
  }

  .painting-card:focus-visible {
    outline: 1px solid #6f8f72;
    outline-offset: 6px;
  }

  .painting-card span {
    display: block;
    margin-top: 18px;
    color: #8f8883;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .empty-message {
    margin: 0;
    color: #6f6b68;
    font-size: 14px;
  }

  .painting-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.98);
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center;
    padding: 34px 40px;
    box-sizing: border-box;
  }

  .lightbox-content {
    max-width: 100%;
    max-height: 100%;
    text-align: center;
  }

  .lightbox-content img {
    max-width: 100%;
    max-height: 78vh;
    display: block;
    margin: 0 auto;
    object-fit: contain;
    animation: imageReveal 0.55s ease both;
  }

  .lightbox-meta {
    margin: 18px auto 0;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #8f8883;
    font-size: 12px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .lightbox-meta p {
    margin: 0;
    color: #4d4a47;
    font-size: 13px;
    line-height: 1.35;
    letter-spacing: 0.04em;
    text-transform: none;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 40px;
    z-index: 2;
    border: 0;
    background: transparent;
    color: #4d4a47;
    font-family: inherit;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .lightbox-close::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    margin-top: 5px;
    background: #6f8f72;
    opacity: 0.9;
  }

  .lightbox-arrow {
    width: 46px;
    height: 46px;
    border: 1px solid #d8d2cc;
    border-radius: 50%;
    background: #ffffff;
    color: #4d4a47;
    font-family: inherit;
    font-size: 18px;
    cursor: pointer;
    transition:
      border-color 0.3s ease,
      color 0.3s ease,
      transform 0.3s ease;
  }

  .lightbox-arrow:hover,
  .lightbox-arrow:focus {
    border-color: #6f8f72;
    color: #6f8f72;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  .lightbox-arrow-left:hover,
  .lightbox-arrow-left:focus {
    transform: translateX(-4px);
  }

  .lightbox-arrow-right:hover,
  .lightbox-arrow-right:focus {
    transform: translateX(4px);
  }

  @keyframes imageReveal {
    from {
      opacity: 0;
      transform: scale(1.015);
      filter: blur(4px);
    }

    to {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }

  @media (max-width: 900px) {
    .painting-page {
      padding: 120px 40px 92px;
    }

    .painting-feature {
      grid-template-columns: 190px minmax(0, 1fr);
      gap: 34px;
    }

    .painting-list-column {
      max-width: 190px;
      height: min(54vh, 560px);
    }

    .painting-grid-frame {
      height: min(76vh, 760px);
    }

    .painting-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }

    .painting-lightbox {
      grid-template-columns: 60px 1fr 60px;
      padding: 34px 24px;
    }
  }

  @media (max-width: 700px) {
    :global(body) {
      overflow: hidden;
    }

    .painting-page {
      height: 100dvh;
      min-height: 100dvh;
      padding: 118px 24px 0;
      align-items: stretch;
      overflow: hidden;
    }

    .painting-feature {
      width: 100%;
      height: calc(100dvh - 118px);
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto minmax(0, 1fr);
      gap: 24px;
      align-items: stretch;
      overflow: hidden;
    }

    .painting-list-column {
      order: 1;
      max-width: none;
      height: auto;
      min-height: auto;
      overflow: visible;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .painting-heading {
      flex-shrink: 0;
      margin-bottom: 18px;
    }

    .painting-label {
      font-size: 18px;
    }

    .painting-scroll-area {
      min-height: auto;
      overflow-x: auto;
      overflow-y: hidden;
      padding-right: 0;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
    }

    .mobile-helper {
      display: block;
      margin: 0 0 18px;
      color: #aaa39d;
      font-size: 10px;
      line-height: 1;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .painting-year-links {
      width: max-content;
      display: flex;
      flex-direction: row;
      gap: 22px;
      padding-bottom: 4px;
    }

    .painting-year-button {
      font-size: 15px;
      white-space: nowrap;
    }

    .painting-image-column {
      order: 2;
      display: flex;
      min-height: 0;
      align-items: stretch;
    }
    .painting-grid-frame {
      width: 100%;
      height: 100%;
      max-height: none;
      overflow-y: auto;
      padding-bottom: 130px;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
    }

    .painting-info {
      margin-bottom: 28px;
    }

    .painting-info h2 {
      font-size: 20px;
    }

    .painting-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 22px 16px;
    }

    .painting-card span {
      margin-top: 14px;
      font-size: 10px;
      line-height: 1.35;
    }

    .painting-lightbox {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "image image"
        "left right";
      gap: 22px;
      padding: 78px 24px 90px;
    }

    .lightbox-content {
      grid-area: image;
    }

    .lightbox-content img {
      max-height: 68vh;
    }

    .lightbox-arrow-left {
      grid-area: left;
      justify-self: start;
    }

    .lightbox-arrow-right {
      grid-area: right;
      justify-self: end;
    }

    .lightbox-close {
      top: 24px;
      right: 24px;
    }
  }
</style>
