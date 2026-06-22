<script>
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  const sections = [
    {
      id: "selected",
      label: "Selected Paintings",
      heading: "Selected Paintings",
      entries: [],
    },
  ];

  const initialPainting =
    data.paintings?.find((painting) => painting.id === data.requestedPostId) ||
    data.paintings?.[0];

  let activeSectionId = $state("selected");
  let selectedPaintingSlug = $state(initialPainting?.postSlug || "");
  let selectedImageIndex = $state(null);
  let hoveredImageIndex = $state(null);

  let activeSection = $derived(
    sections.find((section) => section.id === activeSectionId) || sections[0],
  );

  let selectedPainting = $derived(
    data.paintings?.find(
      (painting) => painting.postSlug === selectedPaintingSlug,
    ) || data.paintings?.[0],
  );

  let selectedImages = $derived(selectedPainting?.images || []);

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  function selectSection(sectionId) {
    activeSectionId = sectionId;
    selectedImageIndex = null;
    hoveredImageIndex = null;
  }

  function selectPainting(painting) {
    selectedPaintingSlug = painting.postSlug;
    selectedImageIndex = null;
    hoveredImageIndex = null;
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
  <section class="paintings-layout" aria-label="Paintings">
    <aside class="left-column" aria-label="Painting navigation">
      <div class="section-links">
        {#each sections as section}
          <button
            type="button"
            class="section-button"
            class:active={activeSectionId === section.id}
            onclick={() => selectSection(section.id)}
          >
            {section.label}
          </button>
        {/each}
      </div>

      <div class="painting-preview">
        {#if selectedPainting}
          <h1>{selectedPainting.title}</h1>

          <div class="preview-bottom">
            <div class="preview-info">
              {#if selectedPainting.year}
                <strong>{selectedPainting.year}</strong>
              {:else}
                <strong>PAINTINGS</strong>
              {/if}

              {#if selectedPainting.info}
                <p>{selectedPainting.info}</p>
              {:else}
                <p>Selected painting images and documentation.</p>
              {/if}
            </div>

            <div class="case-count">
              IMAGES({selectedImages.length})
            </div>
          </div>
        {:else}
          <h1>{activeSection.heading}</h1>

          <div class="preview-bottom">
            <div class="preview-info">
              <strong>PAINTINGS</strong>
              <p>Selected paintings and visual works.</p>
            </div>

            <div class="case-count">
              WORKS({data.paintings?.length || 0})
            </div>
          </div>
        {/if}
      </div>
    </aside>

    <section class="right-column" aria-label="Painting content">
      {#if data.paintings?.length}
        <div class="selected-painting-links">
          {#each data.paintings as painting}
            <button
              type="button"
              class="selected-painting-button"
              class:active={selectedPainting?.postSlug === painting.postSlug}
              onclick={() => selectPainting(painting)}
            >
              {painting.title}
            </button>
          {/each}
        </div>
      {/if}

      {#if selectedPainting?.images?.length}
        {#key selectedPainting.postSlug}
          <div class="image-grid">
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

                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            {/each}
          </div>
        {/key}
      {:else}
        <p class="empty-message">No images found for this painting.</p>
      {/if}
    </section>
  </section>

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
          <span>
            {String(selectedImageIndex + 1).padStart(2, "0")} — {String(
              selectedImages.length,
            ).padStart(2, "0")}
          </span>

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
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    color: #000000;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .paintings-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 90px 90px 28px;
    background: #ffffff;
  }

  .paintings-layout {
    width: 100%;
    display: grid;
    grid-template-columns: 19% 81%;
    gap: 34px;
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

  .section-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
  }

  .section-button,
  .selected-painting-button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #bdbdbd;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1.08;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .section-button.active,
  .section-button:hover,
  .section-button:focus,
  .selected-painting-button.active,
  .selected-painting-button:hover,
  .selected-painting-button:focus {
    color: #000000;
  }

  .painting-preview {
    width: 100%;
  }

  .painting-preview h1 {
    max-width: 340px;
    margin: 0 0 72px;
    color: #000000;
    font-size: clamp(27px, 2.55vw, 45px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.055em;
  }

  .preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .preview-info {
    max-width: 330px;
  }

  .preview-info strong {
    display: block;
    margin: 0 0 8px;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .preview-info p {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
  }

  .case-count {
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .right-column {
    width: 100%;
    min-width: 0;
  }

  .selected-painting-links {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 34px;
  }

  .image-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 12px;
    row-gap: 12px;
    padding: 0 0 68px;
  }

  .image-card {
    position: relative;
    display: block;
    min-height: 560px;
    overflow: hidden;
    padding: 0;
    border: 0;
    color: #000000;
    background: #eeeeee;
    text-align: left;
    cursor: pointer;
  }

  .image-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eeeeee;
  }

  .image-card img {
    width: 100%;
    height: 100%;
    min-height: 560px;
    display: block;
    object-fit: cover;
    object-position: center;
    transition:
      opacity 0.35s ease,
      width 0.55s ease,
      height 0.55s ease,
      filter 0.55s ease;
  }

  .image-grid:hover .image-card img {
    opacity: 0.12;
    filter: grayscale(10%);
  }

  .image-grid:hover .image-card:hover img,
  .image-grid:hover .image-card.active img {
    width: 92%;
    height: 92%;
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    filter: none;
  }

  .image-card span {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 4;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .image-card:hover span,
  .image-card.active span {
    opacity: 1;
  }

  .empty-message {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
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
    text-transform: uppercase;
  }

  .lightbox-meta p {
    margin: 0;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 40px;
    z-index: 2;
    border: 0;
    background: transparent;
    color: #000000;
    font-family: inherit;
    font-size: 13px;
    text-transform: uppercase;
    cursor: pointer;
  }

  .lightbox-arrow {
    width: 46px;
    height: 46px;
    border: 1px solid #d8d2cc;
    border-radius: 50%;
    background: #ffffff;
    color: #000000;
    font-family: inherit;
    font-size: 18px;
    cursor: pointer;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  @media (max-width: 1280px) {
    .paintings-page {
      padding: 96px 80px 90px 28px;
    }

    .paintings-layout {
      grid-template-columns: 21% 79%;
    }

    .painting-preview h1 {
      font-size: clamp(26px, 2.4vw, 38px);
    }

    .image-card,
    .image-card img {
      min-height: 500px;
    }
  }

  @media (max-width: 1024px) {
    .paintings-page {
      padding: 118px 24px 110px;
    }

    .paintings-layout {
      display: block;
    }

    .left-column {
      position: relative;
      top: auto;
      height: auto;
      min-height: 0;
      display: block;
      margin-bottom: 34px;
    }

    .section-links {
      margin-bottom: 28px;
    }

    .painting-preview h1 {
      max-width: 640px;
      margin: 0 0 28px;
      font-size: clamp(29px, 5.6vw, 50px);
    }

    .preview-info {
      margin-bottom: 10px;
    }

    .selected-painting-links {
      margin-bottom: 28px;
    }

    .image-grid {
      padding-bottom: 40px;
    }

    .image-card,
    .image-card img {
      min-height: 440px;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: 92%;
      height: 92%;
      min-height: 0;
      object-fit: contain;
    }
  }

  @media (max-width: 700px) {
    .paintings-page {
      padding: 108px 24px 120px;
    }

    .section-button,
    .selected-painting-button {
      font-size: 14px;
    }

    .painting-preview h1 {
      font-size: clamp(27px, 8vw, 40px);
    }

    .preview-info strong,
    .preview-info p,
    .case-count {
      font-size: 14px;
    }

    .image-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .image-card,
    .image-card img {
      min-height: 420px;
    }

    .image-grid:hover .image-card img {
      opacity: 1;
      filter: none;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 420px;
      object-fit: cover;
    }

    .image-card span {
      opacity: 1;
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
</style>
