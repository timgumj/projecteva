<script>
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  const initialPainting =
    data.paintings?.find((painting) => painting.id === data.requestedPostId) ||
    data.paintings?.[0];

  let selectedPaintingSlug = $state(initialPainting?.postSlug || "");
  let selectedImageIndex = $state(null);
  let hoveredImageIndex = $state(null);
  let paintingGridElement = $state(null);
  let infoExpanded = $state(false);

  let selectedPainting = $derived(
    data.paintings?.find(
      (painting) => painting.postSlug === selectedPaintingSlug,
    ) || data.paintings?.[0],
  );

  let selectedImages = $derived(selectedPainting?.images || []);

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  let shouldShowInfoToggle = $derived(
    (selectedPainting?.info || "").length > 200,
  );

  function selectPainting(painting) {
    selectedPaintingSlug = painting.postSlug;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;

    if (paintingGridElement) {
      paintingGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function setHoveredImage(index) {
    hoveredImageIndex = index;
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

  function scrollBackToTop() {
    if (paintingGridElement) {
      paintingGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function handleKeydown(event) {
    if (selectedImageIndex === null) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPreviousImage();
    if (event.key === "ArrowRight") showNextImage();
  }

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>Paintings | Eva Eichinger</title>

  <meta
    name="description"
    content="Explore selected paintings, visual works, image galleries, and contemporary art projects by Eva Eichinger."
  />
</svelte:head>

<main class="paintings-page">
  {#if data.paintings && data.paintings.length > 0}
    <section class="paintings-layout" aria-label="Paintings">
      <aside class="left-column" aria-label="Painting navigation">
        <div class="navigation-area">
          <div class="section-links">
            <button type="button" class="section-button active">
              <span class="section-label">
                <span>Selected Paintings</span>
              </span>
            </button>
          </div>

          <div class="selected-painting-links">
            {#each data.paintings as painting, index}
              <button
                type="button"
                class="selected-painting-button"
                class:active={selectedPainting?.postSlug === painting.postSlug}
                onclick={() => selectPainting(painting)}
              >
                <span class="painting-list-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span class="painting-button-label">
                  <span>{painting.title}</span>
                </span>
              </button>
            {/each}
          </div>
        </div>

        <div class="painting-preview">
          {#if selectedPainting}
            <h1>{selectedPainting.title}</h1>

            <div class="preview-bottom">
              <div class="preview-info">
                {#if selectedPainting.info}
                  <div
                    class="painting-description"
                    class:expanded={infoExpanded}
                  >
                    <p>{selectedPainting.info}</p>
                  </div>

                  {#if shouldShowInfoToggle}
                    <button
                      type="button"
                      class="info-toggle"
                      onclick={() => (infoExpanded = !infoExpanded)}
                    >
                      {infoExpanded ? "Less −" : "More +"}
                    </button>
                  {/if}
                {:else}
                  <p>Selected painting images and documentation.</p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </aside>

      <section class="right-column" aria-label="Painting content">
        {#if selectedPainting?.images?.length}
          {#key selectedPainting.postSlug}
            <div class="image-grid" bind:this={paintingGridElement}>
              {#each selectedPainting.images as image, index}
                <button
                  type="button"
                  class="image-card"
                  class:active={hoveredImageIndex === index}
                  onmouseenter={() => setHoveredImage(index)}
                  onfocus={() => setHoveredImage(index)}
                  onclick={() => openLightbox(index)}
                  aria-label={`Open ${image.alt || selectedPainting.title}`}
                >
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt || selectedPainting.title}
                    />
                  </figure>

                  <span class="image-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              {/each}

              <button
                type="button"
                class="back-to-top"
                onclick={scrollBackToTop}
              >
                BACK TO TOP
              </button>
            </div>
          {/key}
        {:else}
          <p class="empty-message">No images found for this painting.</p>
        {/if}
      </section>
    </section>
  {:else}
    <p class="empty-message">No painting posts found.</p>
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
          alt={selectedImage.alt || selectedPainting.title}
        />

        <div class="lightbox-meta">
          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else}
            <p>{selectedPainting.title}</p>
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
  :global(html),
  :global(body),
  .paintings-page {
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(body) {
    margin: 0;
    overflow-x: hidden;
    background: #ffffff;
    color: #000000;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .paintings-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 72px 90px 28px;
    background: #ffffff;
    text-transform: uppercase;
  }

  .paintings-page button {
    font-family: inherit;
  }

  .paintings-page p {
    text-transform: none;
  }

  .paintings-layout {
    width: 100%;
    display: grid;
    grid-template-columns: clamp(210px, 15vw, 265px) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .left-column {
    position: sticky;
    top: 96px;
    height: calc(100vh - 186px);
    min-height: 620px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .navigation-area {
    width: 100%;
    display: grid;
    grid-template-rows: auto auto;
    align-content: start;
    gap: 12px;
    margin: 0;
    padding: 0;
  }

  .section-links,
  .selected-painting-links {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    margin: 0;
    padding: 0;
    text-align: left;
  }

  .selected-painting-links {
    max-height: 240px;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .selected-painting-links::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .section-button,
  .selected-painting-button {
    position: relative;
    width: auto;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #b8b8b8;
    font-size: clamp(12px, 0.78vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    text-align: left;
    cursor: pointer;
    transition:
      color 0.28s ease,
      opacity 0.28s ease;
    text-transform: uppercase;
  }

  .section-button {
    color: #000000;
  }

  .section-button::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: 0.65;
  }

  .selected-painting-button {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .section-button:hover .section-label span,
  .section-button.active .section-label span,
  .selected-painting-button:hover .painting-button-label span,
  .selected-painting-button.active .painting-button-label span {
    animation: paintingTextLift 0.42s ease both;
  }

  .painting-list-number {
    display: inline-block;
    min-width: 17px;
    flex-shrink: 0;
    color: inherit;
    font-size: 0.82em;
    font-weight: 700;
    letter-spacing: 0.04em;
    opacity: 0.62;
    transform: translateY(-0.5px);
  }

  .section-label,
  .painting-button-label {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }

  .section-label span,
  .painting-button-label span {
    display: inline-block;
  }

  .section-button.active,
  .section-button:hover,
  .section-button:focus,
  .selected-painting-button.active,
  .selected-painting-button:hover,
  .selected-painting-button:focus {
    color: #000000;
  }

  @keyframes paintingTextLift {
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    42% {
      transform: translateY(-110%);
      opacity: 0;
    }

    43% {
      transform: translateY(110%);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .painting-preview {
    width: 100%;
  }

  .painting-preview h1 {
    max-width: 280px;
    margin: 0 0 42px;
    color: #000000;
    font-size: clamp(12px, 0.78vw, 14px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
    animation: previewTitleIn 0.46s ease both;
  }

  @keyframes previewTitleIn {
    0% {
      opacity: 0;
      transform: translateY(5px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .preview-info {
    max-width: 265px;
  }

  .preview-info p {
    margin: 0;
    color: #262626;
    font-size: clamp(11px, 0.66vw, 12px);
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: 0.006em;
    text-transform: uppercase;
  }

  .painting-description {
    max-height: 120px;
    overflow-y: auto;
    padding-right: 6px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .painting-description::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .painting-description p {
    margin: 0;
    text-transform: uppercase;
  }

  .info-toggle {
    display: none;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
    text-transform: uppercase;
  }

  .right-column {
    width: 100%;
    min-width: 0;
  }

  .image-grid {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(20px, 1.6vw, 30px);
    row-gap: clamp(28px, 2vw, 38px);
    padding: 6px 0 40px;
  }

  .image-card {
    position: relative;
    display: block;
    height: clamp(455px, 28vw, 515px);
    min-height: 0;
    overflow: hidden;
    padding: 0;
    border: 0;
    color: #000000;
    background: #f8f8f6;
    text-align: left;
    cursor: pointer;
    isolation: isolate;
    transition:
      background 0.45s ease,
      transform 0.45s ease;
  }

  .image-card::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.22),
        rgba(255, 255, 255, 0) 30%
      ),
      linear-gradient(to top, rgba(0, 0, 0, 0.055), rgba(0, 0, 0, 0) 42%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.42s ease;
  }

  .image-card::after {
    content: "";
    position: absolute;
    inset: 18px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.06);
    opacity: 0;
    pointer-events: none;
    transform: scale(0.985);
    transition:
      opacity 0.42s ease,
      transform 0.42s ease;
  }

  .image-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f6;
  }

  .image-card img {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1.01);
    transition:
      opacity 0.45s ease,
      width 0.65s ease,
      height 0.65s ease,
      transform 0.65s ease,
      filter 0.65s ease;
  }

  .image-grid:hover .image-card img {
    opacity: 0.38;
    filter: grayscale(12%) contrast(0.94) brightness(1.03);
  }

  .image-grid:hover .image-card:hover,
  .image-grid:hover .image-card.active {
    background: #fbfaf7;
  }

  .image-grid:hover .image-card:hover::before,
  .image-grid:hover .image-card.active::before {
    opacity: 1;
  }

  .image-grid:hover .image-card:hover::after,
  .image-grid:hover .image-card.active::after {
    opacity: 1;
    transform: scale(1);
  }

  .image-grid:hover .image-card:hover img,
  .image-grid:hover .image-card.active img {
    width: calc(100% - 46px);
    height: calc(100% - 46px);
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    transform: scale(1);
    filter: none;
  }

  .image-number {
    position: absolute;
    top: 22px;
    left: 22px;
    z-index: 4;
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.05em;
    opacity: 0;
    transform: translateY(4px);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .image-card:hover .image-number,
  .image-card.active .image-number {
    opacity: 1;
    transform: translateY(0);
  }

  .back-to-top {
    display: none;
    grid-column: 1 / -1;
    justify-self: center;
    margin: 48px 0 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
  }

  .empty-message {
    margin: 0;
    padding: 120px 0;
    color: #000000;
    font-size: 15px;
    font-weight: 900;
  }

  .painting-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center;
    padding: 34px 40px;
    background: rgba(255, 255, 255, 0.98);
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
    color: #000000;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.35;
  }

  .lightbox-meta p {
    margin: 0;
    text-transform: none;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 40px;
    z-index: 2;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    cursor: pointer;
    text-transform: uppercase;
  }

  .lightbox-arrow {
    width: 46px;
    height: 46px;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 22px;
    cursor: pointer;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  @media (min-width: 1025px) {
    .image-card:nth-child(4n + 1) {
      transform: translateY(0);
    }

    .image-card:nth-child(4n + 2) {
      transform: translateY(34px);
    }

    .image-card:nth-child(4n + 3) {
      transform: translateY(8px);
    }

    .image-card:nth-child(4n + 4) {
      transform: translateY(42px);
    }

    .image-card:nth-child(4n + 1):hover,
    .image-card:nth-child(4n + 1).active {
      transform: translateY(-3px);
    }

    .image-card:nth-child(4n + 2):hover,
    .image-card:nth-child(4n + 2).active {
      transform: translateY(31px);
    }

    .image-card:nth-child(4n + 3):hover,
    .image-card:nth-child(4n + 3).active {
      transform: translateY(5px);
    }

    .image-card:nth-child(4n + 4):hover,
    .image-card:nth-child(4n + 4).active {
      transform: translateY(39px);
    }
  }

  @media (min-width: 1440px) {
    .paintings-page {
      padding-right: 72px;
    }

    .paintings-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }

    .image-card {
      height: clamp(455px, 27vw, 510px);
    }
  }

  @media (min-width: 1680px) {
    .paintings-page {
      padding-right: 76px;
    }

    .paintings-layout {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 14px;
    }

    .painting-preview h1 {
      max-width: 270px;
    }

    .preview-info {
      max-width: 260px;
    }

    .image-card {
      height: 510px;
    }
  }

  @media (max-width: 1280px) {
    .paintings-page {
      padding: 96px 72px 90px 28px;
    }

    .paintings-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .painting-preview h1 {
      max-width: 280px;
      font-size: clamp(13px, 0.95vw, 15px);
    }

    .image-grid {
      column-gap: 22px;
      row-gap: 32px;
    }

    .image-card {
      height: 455px;
    }
  }

  @media (max-width: 1024px) {
    :global(html),
    :global(body) {
      height: 100%;
      overflow: hidden;
    }

    .paintings-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 118px 24px 0;
    }

    .paintings-layout {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      gap: 0;
    }

    .left-column {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      z-index: 20;
      height: auto;
      min-height: 0;
      flex: 0 0 auto;
      display: block;
      margin: 0;
      padding-bottom: 28px;
      background: #ffffff;
    }

    .navigation-area {
      width: 100%;
      display: grid;
      grid-template-rows: auto auto;
      gap: 10px;
      margin: 0 0 24px;
      padding: 0;
      border-bottom: 0;
    }

    .section-links {
      width: 100%;
      display: block;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .section-button {
      display: block;
      width: auto;
      min-height: 0;
      margin: 0;
      padding: 0;
      color: #000000;
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
      text-align: left;
    }

    .selected-painting-links {
      width: 100%;
      max-height: none;
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 12px;
      row-gap: 7px;
      align-items: start;
      justify-items: stretch;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .selected-painting-button {
      display: flex;
      width: 100%;
      min-width: 0;
      min-height: 0;
      margin: 0;
      padding: 0;
      color: #b8b8b8;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.08;
      text-align: left;
      white-space: normal;
      word-break: normal;
      overflow-wrap: anywhere;
      transform: none;
      letter-spacing: 0;
    }

    .painting-list-number {
      min-width: 22px;
      font-size: 0.82em;
    }

    .selected-painting-button.active,
    .selected-painting-button:hover,
    .selected-painting-button:focus {
      color: #000000;
      transform: none;
      letter-spacing: 0;
    }

    .painting-preview {
      width: 100%;
      max-width: none;
      display: block;
      text-align: left;
    }

    .painting-preview h1 {
      width: 100%;
      max-width: 520px;
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0;
      text-align: left;
    }

    .preview-bottom {
      width: 100%;
      max-width: none;
      gap: 0;
      text-align: left;
    }

    .preview-info {
      width: 100%;
      max-width: none;
      margin-bottom: 0;
      text-align: left;
    }

    .preview-info p {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.12;
    }

    .painting-description {
      width: 100%;
      max-width: none;
      max-height: 72px;
      overflow: hidden;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    .painting-description.expanded {
      max-height: 24vh;
      overflow-y: auto;
      padding-top: 4px;
      padding-right: 8px;
      padding-bottom: 12px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .painting-description.expanded::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .info-toggle {
      display: block;
      margin-top: 12px;
      padding-top: 4px;
      padding-bottom: 4px;
      font-size: 12px;
      font-weight: 900;
      line-height: 1;
    }

    .right-column {
      height: 100%;
      min-height: 0;
      flex: 1 1 auto;
      display: block;
      overflow: hidden;
    }

    .image-grid {
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-content: start;
      gap: 18px 12px;
      padding: 0 0 calc(150px + env(safe-area-inset-bottom));
      scrollbar-width: none;
      scrollbar-color: transparent transparent;
      -ms-overflow-style: none;
      overscroll-behavior: contain;
    }

    .image-grid::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      background: transparent;
    }

    .image-grid::-webkit-scrollbar-track {
      background: transparent;
    }

    .image-grid::-webkit-scrollbar-thumb {
      background: transparent;
    }

    .image-card,
    .image-card:nth-child(even),
    .image-card:nth-child(4n + 1),
    .image-card:nth-child(4n + 2),
    .image-card:nth-child(4n + 3),
    .image-card:nth-child(4n + 4) {
      height: 440px;
      min-height: 0;
      overflow: hidden;
      background: #eeeeee;
      transform: none;
    }

    .image-card:nth-child(4n + 1):hover,
    .image-card:nth-child(4n + 1).active,
    .image-card:nth-child(4n + 2):hover,
    .image-card:nth-child(4n + 2).active,
    .image-card:nth-child(4n + 3):hover,
    .image-card:nth-child(4n + 3).active,
    .image-card:nth-child(4n + 4):hover,
    .image-card:nth-child(4n + 4).active {
      transform: none;
    }

    .image-card::before,
    .image-card::after {
      display: none;
    }

    .image-card figure {
      width: 100%;
      height: 100%;
      background: #eeeeee;
      overflow: hidden;
    }

    .image-card img,
    .image-card:nth-child(4n + 1) img,
    .image-card:nth-child(4n + 2) img,
    .image-card:nth-child(4n + 3) img,
    .image-card:nth-child(4n + 4) img {
      width: 100%;
      height: 100%;
      min-height: 0;
      object-fit: cover;
      transform: none;
    }

    .image-grid:hover .image-card img {
      opacity: 0.42;
      filter: grayscale(10%) contrast(0.96) brightness(1.02);
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: calc(100% - 36px);
      height: calc(100% - 36px);
      min-height: 0;
      object-fit: contain;
      opacity: 1;
      filter: none;
    }

    .image-number {
      display: none;
    }

    .back-to-top {
      display: block;
      margin: 44px 0 0;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 14px;
    }
  }

  @media (max-width: 700px) {
    .paintings-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 108px 16px 0;
    }

    .left-column {
      padding-bottom: 24px;
    }

    .navigation-area {
      gap: 9px;
      margin: 0 0 22px;
      padding: 0;
      border-bottom: 0;
    }

    .section-button {
      font-size: 12px;
      line-height: 1.08;
    }

    .selected-painting-links {
      width: 100%;
      max-height: none;
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 10px;
      row-gap: 6px;
      align-items: start;
      justify-items: stretch;
      margin: 0;
      padding: 0;
      text-align: left;
    }

    .selected-painting-button {
      display: flex;
      width: 100%;
      min-width: 0;
      min-height: 0;
      margin: 0;
      padding: 0;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.08;
      text-align: left;
      white-space: normal;
      overflow-wrap: anywhere;
      transform: none;
      letter-spacing: 0;
    }

    .painting-list-number {
      min-width: 18px;
      font-size: 0.82em;
    }

    .selected-painting-button.active,
    .selected-painting-button:hover,
    .selected-painting-button:focus {
      transform: none;
      letter-spacing: 0;
    }

    .painting-preview h1,
    .preview-bottom,
    .preview-info,
    .painting-description {
      width: 100%;
      max-width: none;
    }

    .painting-preview h1 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
      text-align: left;
    }

    .preview-info p {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.12;
    }

    .painting-description {
      max-height: 58px;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    .painting-description.expanded {
      max-height: 22vh;
      overflow-y: auto;
      padding-top: 4px;
      padding-bottom: 14px;
    }

    .info-toggle {
      margin-top: 12px;
      padding-top: 5px;
      padding-bottom: 5px;
      font-size: 11px;
    }

    .right-column {
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    .image-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 10px;
      padding: 0 0 calc(145px + env(safe-area-inset-bottom));
    }

    .image-card,
    .image-card:nth-child(even),
    .image-card:nth-child(4n + 1),
    .image-card:nth-child(4n + 2),
    .image-card:nth-child(4n + 3),
    .image-card:nth-child(4n + 4) {
      height: auto;
      min-height: auto;
      overflow: visible;
      background: transparent;
    }

    .image-card figure {
      height: 260px;
      background: #eeeeee;
      overflow: hidden;
    }

    .image-card img {
      width: 100%;
      height: 100%;
      min-height: 260px;
      object-fit: cover;
    }

    .image-grid:hover .image-card img {
      opacity: 1;
      filter: none;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 260px;
      object-fit: cover;
    }

    .back-to-top {
      display: block;
      margin-top: 38px;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 12px;
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
      max-height: 60vh;
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

  @media (max-width: 420px) {
    .left-column {
      padding-bottom: 22px;
    }

    .navigation-area {
      margin-bottom: 20px;
    }

    .painting-preview h1 {
      font-size: 14px;
    }

    .selected-painting-links {
      column-gap: 9px;
      row-gap: 5px;
    }

    .selected-painting-button {
      font-size: 11px;
      line-height: 1.08;
    }

    .painting-list-number {
      min-width: 17px;
    }

    .painting-description {
      max-height: 54px;
    }

    .painting-description.expanded {
      max-height: 21vh;
      padding-bottom: 14px;
    }

    .info-toggle {
      margin-top: 11px;
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .image-card figure {
      height: 220px;
    }

    .image-card img {
      min-height: 220px;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      min-height: 220px;
    }
  }
</style>
