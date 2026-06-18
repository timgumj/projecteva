<script>
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  let selectedIndex = $state(null);

  let images = $derived(Array.isArray(data.images) ? data.images : []);

  let pageTitle = $derived(data.title || "Exhibition");
  let pageYear = $derived(data.year || "");
  let pageCredit = $derived(data.credit || "");
  let heroImage = $derived(data.featuredImage || images[0]?.src || "");

  let selectedImage = $derived(
    selectedIndex !== null ? images[selectedIndex] : null,
  );

  function openLightbox(index) {
    selectedIndex = index;

    if (browser) {
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    selectedIndex = null;

    if (browser) {
      document.body.style.overflow = "";
    }
  }

  function showPreviousImage() {
    if (!images.length || selectedIndex === null) return;

    selectedIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
  }

  function showNextImage() {
    if (!images.length || selectedIndex === null) return;

    selectedIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
  }

  function handleKeydown(event) {
    if (selectedIndex === null) return;

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
  <title>{pageTitle} | Eva Eichinger</title>

  <meta
    name="description"
    content={`${pageTitle} exhibition by Eva Eichinger. View selected works, images, and documentation from ${pageYear}.`}
  />
</svelte:head>

<main class="exhibition-page">
  <section
    class="exhibition-hero"
    style={`background-image: linear-gradient(rgba(33,38,31,0.34), rgba(33,38,31,0.52))${heroImage ? `, url("${heroImage}")` : ""}`}
  >
    <div class="hero-content">
      <div class="hero-meta">
        <p>Exhibition</p>
        <span>{pageYear}</span>
      </div>

      <div class="hero-title">
        <h1>{pageTitle}</h1>

        {#if pageCredit}
          <p>{pageCredit}</p>
        {/if}
      </div>
    </div>
  </section>

  <section class="artwork-overview" aria-label="Artwork overview">
    <div class="overview-header">
      <h2>Selected Artworks</h2>
      <span>{String(images.length).padStart(2, "0")} Works</span>
    </div>

    {#if images.length}
      <div class="thumbnail-grid">
        {#each images as image, index}
          <button
            class="thumbnail-card"
            type="button"
            onclick={() => openLightbox(index)}
          >
            <span class="thumbnail-image">
              <img src={image.src} alt={image.alt || pageTitle} />
            </span>

            <span class="thumbnail-meta">
              <span>{image.alt || pageTitle}</span>
            </span>
          </button>
        {/each}
      </div>
    {:else}
      <p class="empty-message">No artworks found for this exhibition.</p>
    {/if}
  </section>

  <nav class="exhibition-navigation" aria-label="Exhibition navigation">
    {#if data.previousYear}
      <a
        href={`/exhibitions/${data.previousYear}`}
        class="year-link previous-year-link"
      >
        <span class="nav-label">Previous exhibition</span>
        <span class="nav-main">
          <span class="nav-arrow">←</span>
          <strong>{data.previousYear}</strong>
        </span>
      </a>
    {:else}
      <span></span>
    {/if}

    {#if data.nextYear}
      <a
        href={`/exhibitions/${data.nextYear}`}
        class="year-link next-year-link"
      >
        <span class="nav-label">Next exhibition</span>
        <span class="nav-main">
          <strong>{data.nextYear}</strong>
          <span class="nav-arrow">→</span>
        </span>
      </a>
    {/if}
  </nav>

  {#if selectedImage}
    <div class="lightbox" role="dialog" aria-modal="true">
      <button class="lightbox-close" type="button" onclick={closeLightbox}>
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
        <img src={selectedImage.src} alt={selectedImage.alt || pageTitle} />

        <div class="lightbox-meta">
          <span>
            {String(selectedIndex + 1).padStart(2, "0")} / {String(
              images.length,
            ).padStart(2, "0")}
          </span>

          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else}
            <p>{pageTitle}</p>
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
    overflow: auto;
    font-family: Georgia, "Times New Roman", serif;
    background: #ffffff;
    color: #4d4a47;
  }

  .exhibition-page {
    min-height: 100vh;
    background: #ffffff;
  }

  .exhibition-hero {
    width: calc(100% - 80px);
    min-height: 80vh;
    margin: 0 auto;
    padding: 118px 40px 70px;
    box-sizing: border-box;
    background-color: #2f332b;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
  }

  .hero-content {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: end;
  }

  .hero-meta,
  .hero-title {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hero-title {
    justify-self: end;
    align-items: flex-start;
    text-align: left;
    max-width: 520px;
    width: 100%;
  }

  .hero-meta p,
  .hero-meta span,
  .hero-title h1,
  .hero-title p {
    margin: 0;
    color: #fffaf0;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-shadow: 0 1px 18px rgba(0, 0, 0, 0.28);
  }

  .hero-title p {
    color: rgba(255, 250, 240, 0.86);
    letter-spacing: 0.08em;
    line-height: 1.35;
  }

  .artwork-overview {
    padding: 34px 40px 80px;
    box-sizing: border-box;
  }

  .overview-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .overview-header h2 {
    margin: 0;
    color: #2f2d2b;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .overview-header h2::after {
    content: "";
    display: block;
    width: 34px;
    height: 1px;
    margin-top: 10px;
    background: #6f8f72;
  }

  .overview-header span {
    color: #9b958f;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .thumbnail-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 26px;
  }

  .thumbnail-card {
    border: 0;
    background: transparent;
    padding: 0;
    text-align: left;
    font-family: inherit;
    cursor: pointer;
  }

  .thumbnail-image {
    width: 100%;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    display: block;
    background: #f7f6f3;
  }

  .thumbnail-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    transition:
      transform 0.45s ease,
      opacity 0.3s ease;
  }

  .thumbnail-card:hover img,
  .thumbnail-card:focus img {
    transform: scale(1.025);
    opacity: 0.94;
  }

  .thumbnail-card:focus-visible {
    outline: 1px solid #6f8f72;
    outline-offset: 6px;
  }

  .thumbnail-meta {
    display: block;
    margin-top: 22px;
    color: #8f8883;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.35;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .empty-message {
    margin: 0;
    color: #8f8883;
    font-size: 14px;
    font-weight: 300;
  }

  .exhibition-navigation {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin: 0 40px;
    padding: 0 0 80px;
    background: #ffffff;
  }

  .year-link {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-top: 24px;
    color: #4d4a47;
    text-decoration: none;
    border-top: 1px solid #e7e1dc;
    transition:
      border-color 0.3s ease,
      color 0.3s ease;
  }

  .year-link::before {
    content: "";
    position: absolute;
    top: -1px;
    width: 44px;
    height: 1px;
    background: #6f8f72;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .previous-year-link {
    align-items: flex-start;
    text-align: left;
  }

  .previous-year-link::before {
    left: 0;
    transform-origin: left;
  }

  .next-year-link {
    align-items: flex-end;
    text-align: right;
  }

  .next-year-link::before {
    right: 0;
    transform-origin: right;
  }

  .nav-label {
    color: #aaa39d;
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .nav-main {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .nav-main strong {
    color: #4d4a47;
    font-size: 24px;
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: 0.04em;
  }

  .nav-arrow {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ded7d1;
    border-radius: 50%;
    color: #6f8f72;
    font-size: 15px;
    line-height: 1;
    transition:
      border-color 0.3s ease,
      transform 0.3s ease;
  }

  .year-link:hover,
  .year-link:focus {
    border-color: #cfc7bf;
  }

  .year-link:hover::before,
  .year-link:focus::before {
    transform: scaleX(1);
  }

  .previous-year-link:hover .nav-arrow,
  .previous-year-link:focus .nav-arrow {
    transform: translateX(-3px);
    border-color: #6f8f72;
  }

  .next-year-link:hover .nav-arrow,
  .next-year-link:focus .nav-arrow {
    transform: translateX(3px);
    border-color: #6f8f72;
  }

  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(20, 22, 19, 0.96);
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
  }

  .lightbox-meta {
    margin: 18px auto 0;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: rgba(255, 250, 240, 0.78);
    font-size: 12px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .lightbox-meta p {
    margin: 0;
    color: rgba(255, 250, 240, 0.86);
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
    color: rgba(255, 250, 240, 0.84);
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
    border: 1px solid rgba(255, 250, 240, 0.28);
    border-radius: 50%;
    background: transparent;
    color: #fffaf0;
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
    color: #9fbd91;
  }

  .lightbox-arrow-left:hover,
  .lightbox-arrow-left:focus {
    transform: translateX(-4px);
  }

  .lightbox-arrow-right:hover,
  .lightbox-arrow-right:focus {
    transform: translateX(4px);
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  @media (max-width: 900px) {
    .exhibition-hero {
      width: calc(100% - 48px);
      min-height: 75vh;
      padding: 112px 24px 56px;
    }

    .thumbnail-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .nav-main strong {
      font-size: 20px;
    }

    .lightbox {
      grid-template-columns: 60px 1fr 60px;
      padding: 34px 24px;
    }
  }

  @media (max-width: 700px) {
    .exhibition-hero {
      width: calc(100% - 48px);
      min-height: 70vh;
      padding: 104px 24px 44px;
    }

    .hero-content {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .hero-title {
      justify-self: start;
      max-width: 100%;
    }

    .hero-meta p,
    .hero-meta span,
    .hero-title h1,
    .hero-title p {
      font-size: 14px;
      line-height: 1.3;
    }

    .artwork-overview {
      padding: 28px 24px 50px;
    }

    .overview-header {
      margin-bottom: 22px;
    }

    .thumbnail-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 22px 16px;
    }

    .thumbnail-meta {
      min-height: 50px;
      font-size: 10px;
      grid-template-columns: 24px 1fr;
    }

    .exhibition-navigation {
      grid-template-columns: 1fr;
      margin: -20px 24px 0;
      padding-bottom: 80px;
      gap: 34px;
    }

    .next-year-link {
      align-items: flex-start;
      text-align: left;
    }

    .next-year-link::before {
      left: 0;
      right: auto;
      transform-origin: left;
    }

    .nav-main strong {
      font-size: 19px;
    }

    .lightbox {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "image image"
        "left right";
      gap: 22px;
      padding: 78px 24px 28px;
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
