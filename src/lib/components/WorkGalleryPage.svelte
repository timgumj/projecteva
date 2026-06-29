<script>
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";

  let {
    items = [],
    requestedPostId = null,
    allLabel = "ALL WORKS",
    itemLabel = "Work",
    itemLabelPlural = "Works",
    themeColor = "#ff5c01",
    metaTitle = "Works | Eva Eichinger",
    metaDescription = "Explore selected works, image galleries, and contemporary art projects by Eva Eichinger.",
    allIntroText = "",
    fallbackGalleryText = "",
    emptyItemsText = "",
    noFeaturedText = "",
    noGalleryText = "",
  } = $props();

  let selectedItemSlug = $state("");
  let selectedImageIndex = $state(null);
  let hoveredImageIndex = $state(null);
  let gridElement = $state(null);
  let filterElement = $state(null);
  let showScrollHint = $state(false);
  let infoExpanded = $state(false);

  let normalizedItems = $derived.by(() => {
    return (items || []).map((item) => ({
      ...item,
      postSlug: item.postSlug || item.slug || "",
      title: item.title || item.name || "Untitled",
      info:
        item.info ||
        item.description ||
        item.content ||
        item.contentHtml ||
        item.excerpt ||
        "",
    }));
  });

  let initialItem = $derived(
    normalizedItems?.find((item) => item.id === requestedPostId) ??
      normalizedItems?.[0],
  );

  $effect(() => {
    if (!selectedItemSlug && normalizedItems?.length) {
      selectedItemSlug =
        requestedPostId && initialItem ? initialItem.postSlug : allLabel;
    }
  });

  function isAllItems() {
    return selectedItemSlug === allLabel || !selectedItemSlug;
  }

  let selectedItem = $derived.by(() => {
    if (isAllItems()) return null;

    return (
      normalizedItems?.find((item) => item.postSlug === selectedItemSlug) ||
      normalizedItems?.[0]
    );
  });

  function normalizeImage(image, item, imageIndex = 0, isFeatured = false) {
    if (!image) return null;

    if (typeof image === "string") {
      return {
        src: image,
        alt: item?.title || `${itemLabel} image`,
        imageIndex,
        itemTitle: item?.title || itemLabel,
        itemPostSlug: item?.postSlug || "",
        isFeatured,
      };
    }

    const src =
      image.src ||
      image.url ||
      image.source_url ||
      image.full ||
      image.large ||
      image.medium ||
      image.thumbnail ||
      image.media_details?.sizes?.full?.source_url ||
      image.media_details?.sizes?.large?.source_url ||
      image.media_details?.sizes?.medium_large?.source_url ||
      image.media_details?.sizes?.medium?.source_url ||
      image.media_details?.sizes?.thumbnail?.source_url ||
      "";

    if (!src) return null;

    return {
      ...image,
      src,
      alt:
        image.alt ||
        image.alt_text ||
        image.title ||
        image.caption ||
        item?.title ||
        `${itemLabel} image`,
      imageIndex,
      itemTitle: item?.title || itemLabel,
      itemPostSlug: item?.postSlug || "",
      isFeatured,
    };
  }

  function getItemFeaturedImage(item) {
    if (!item) return null;

    const featuredImage =
      item.featuredImage ||
      item.featured_image ||
      item.featuredImageUrl ||
      item.featured_image_url ||
      item.featuredMedia ||
      item.featured_media ||
      item.thumbnail ||
      item.coverImage ||
      item.cover_image ||
      item.image ||
      item.heroImage ||
      item.hero_image;

    return (
      normalizeImage(featuredImage, item, 0, true) ||
      normalizeImage(item.images?.[0], item, 0, true)
    );
  }

  function getItemGalleryImages(item) {
    return (item?.images || [])
      .map((image, imageIndex) =>
        normalizeImage(image, item, imageIndex, false),
      )
      .filter(Boolean);
  }

  let allFeaturedImages = $derived.by(() => {
    return normalizedItems
      .map((item, index) => {
        const featuredImage = getItemFeaturedImage(item);

        if (!featuredImage) return null;

        return {
          ...featuredImage,
          imageIndex: index,
          itemTitle: item.title,
          itemPostSlug: item.postSlug,
          isFeatured: true,
        };
      })
      .filter(Boolean);
  });

  let selectedItemFeaturedImages = $derived.by(() => {
    const featuredImage = getItemFeaturedImage(selectedItem);

    if (!featuredImage || !selectedItem) return [];

    return [
      {
        ...featuredImage,
        imageIndex: 0,
        itemTitle: selectedItem.title,
        itemPostSlug: selectedItem.postSlug,
        isFeatured: true,
      },
    ];
  });

  let selectedGalleryImages = $derived.by(() => {
    return getItemGalleryImages(selectedItem);
  });

  let selectedImages = $derived.by(() => {
    if (isAllItems()) {
      return allFeaturedImages;
    }

    if (selectedGalleryImages.length) {
      return selectedGalleryImages;
    }

    return selectedItemFeaturedImages;
  });

  let isSingleGalleryImage = $derived(
    !isAllItems() && selectedImages.length === 1,
  );

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  let previewTitle = $derived(
    isAllItems() ? allLabel : selectedItem?.title || allLabel,
  );

  let selectedItemInfo = $derived(selectedItem?.info || "");

  let shouldShowInfoToggle = $derived(
    !isAllItems() && selectedItemInfo.length > 200,
  );

  let computedAllIntroText = $derived(
    allIntroText ||
      `Selected ${itemLabelPlural.toLowerCase()} posts. Click a featured image to view its gallery.`,
  );

  let computedFallbackGalleryText = $derived(
    fallbackGalleryText ||
      `Selected ${itemLabel.toLowerCase()} images and documentation.`,
  );

  let computedEmptyItemsText = $derived(
    emptyItemsText || `No ${itemLabel.toLowerCase()} posts found.`,
  );

  let computedNoFeaturedText = $derived(
    noFeaturedText || "No featured images found.",
  );

  let computedNoGalleryText = $derived(
    noGalleryText ||
      `No gallery images found for this ${itemLabel.toLowerCase()}.`,
  );

  function cleanHtml(value) {
    return value || "";
  }

  function getDesktopLastCardOffset(count) {
    const position = count % 4;

    if (position === 1) return 0;
    if (position === 2) return 34;
    if (position === 3) return 8;

    return 42;
  }

  function updateScrollHint() {
    if (!browser || !filterElement) return;

    const hasOverflow =
      filterElement.scrollHeight > filterElement.clientHeight + 6;

    const isNotAtBottom =
      filterElement.scrollTop + filterElement.clientHeight <
      filterElement.scrollHeight - 6;

    showScrollHint = hasOverflow && isNotAtBottom;
  }

  function handleFilterScroll() {
    updateScrollHint();
  }

  function unlockPageLocks() {
    if (!browser) return;

    document.documentElement.classList.remove("menu-open-lock");
    document.body.classList.remove("menu-open-lock");

    document.documentElement.style.overflow = "";
    document.documentElement.style.height = "";
    document.documentElement.style.position = "";
    document.documentElement.style.width = "";
    document.documentElement.style.touchAction = "";

    document.body.style.overflow = "";
    document.body.style.height = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.body.style.touchAction = "";
  }

  function scrollGridToTop() {
    if (gridElement) {
      gridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function selectAllItems() {
    selectedItemSlug = allLabel;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;
    scrollGridToTop();
  }

  function selectItem(item) {
    selectedItemSlug = item.postSlug;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;
    scrollGridToTop();
  }

  function openGalleryFromFeaturedImage(image) {
    const item = normalizedItems?.find(
      (entry) => entry.postSlug === image.itemPostSlug,
    );

    if (!item) return;

    selectedItemSlug = item.postSlug;
    selectedImageIndex = null;
    hoveredImageIndex = null;
    infoExpanded = false;
    scrollGridToTop();
  }

  function setHoveredImage(index) {
    hoveredImageIndex = index;
  }

  function handleImageCardClick(image, index) {
    if (isAllItems() && image.isFeatured) {
      openGalleryFromFeaturedImage(image);
      return;
    }

    if (isSingleGalleryImage) {
      return;
    }

    openLightbox(index);
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
    scrollGridToTop();
  }

  function handleKeydown(event) {
    if (selectedImageIndex === null) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPreviousImage();
    if (event.key === "ArrowRight") showNextImage();
  }

  onMount(() => {
    unlockPageLocks();

    requestAnimationFrame(() => {
      unlockPageLocks();
      updateScrollHint();
    });

    setTimeout(() => {
      unlockPageLocks();
      updateScrollHint();
    }, 0);

    window.addEventListener("resize", updateScrollHint);

    return () => {
      unlockPageLocks();
      window.removeEventListener("resize", updateScrollHint);
    };
  });

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>{metaTitle}</title>

  <meta name="description" content={metaDescription} />
</svelte:head>

<main class="paintings-page" style={`--painting-color: ${themeColor};`}>
  {#if normalizedItems && normalizedItems.length > 0}
    <section class="paintings-layout" aria-label={itemLabelPlural}>
      <aside class="left-column" aria-label={`${itemLabel} navigation`}>
        <div
          class="painting-filter"
          aria-label={`${itemLabel} categories`}
          bind:this={filterElement}
          onscroll={handleFilterScroll}
        >
          <button
            type="button"
            class="all-paintings-button"
            class:active={isAllItems()}
            onclick={selectAllItems}
          >
            <span class="painting-button-label">
              <span>{allLabel}</span>
            </span>
          </button>

          {#each normalizedItems as item, index}
            <button
              type="button"
              class="selected-painting-button"
              class:active={selectedItem?.postSlug === item.postSlug}
              onclick={() => selectItem(item)}
            >
              <span class="painting-list-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span class="painting-button-label">
                <span>{item.title}</span>
              </span>
            </button>
          {/each}

          {#if showScrollHint}
            <span class="painting-scroll-hint" aria-hidden="true">
              SCROLL ↓
            </span>
          {/if}
        </div>

        <div class="painting-preview">
          <h1>{previewTitle}</h1>

          <div class="preview-bottom">
            <div class="preview-info">
              {#if isAllItems()}
                <strong>{itemLabelPlural}</strong>
                <p>{computedAllIntroText}</p>
              {:else if selectedItemInfo}
                <strong>GALLERY</strong>

                <div class="painting-description" class:expanded={infoExpanded}>
                  <p>{@html cleanHtml(selectedItemInfo)}</p>
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
                <strong>GALLERY</strong>
                <p>{computedFallbackGalleryText}</p>
              {/if}
            </div>
          </div>
        </div>
      </aside>

      <section class="right-column" aria-label={`${itemLabel} content`}>
        {#if selectedImages.length}
          {#key selectedItemSlug}
            <div
              class="image-grid"
              class:single-image-grid={isSingleGalleryImage}
              bind:this={gridElement}
              style={`--last-desktop-offset: ${getDesktopLastCardOffset(selectedImages.length)}px;`}
            >
              {#each selectedImages as image, index}
                <button
                  type="button"
                  class="image-card"
                  class:single-image-card={isSingleGalleryImage}
                  class:active={hoveredImageIndex === index}
                  onmouseenter={() => setHoveredImage(index)}
                  onmouseleave={() => setHoveredImage(null)}
                  onfocus={() => setHoveredImage(index)}
                  onblur={() => setHoveredImage(null)}
                  onclick={() => handleImageCardClick(image, index)}
                  aria-label={isAllItems()
                    ? `Open gallery for ${image.itemTitle || itemLabel.toLowerCase()}`
                    : `View ${image.alt || image.itemTitle || `${itemLabel.toLowerCase()} image`}`}
                >
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt || image.itemTitle || `${itemLabel} image`}
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  </figure>

                  {#if isSingleGalleryImage}
                    <div class="single-image-caption">
                      {image.alt || image.itemTitle || `${itemLabel} image`}
                    </div>
                  {/if}

                  <span class="magnify-icon" aria-hidden="true">
                    {isAllItems() ? "→" : "⛶"}
                  </span>

                  <span class="image-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              {/each}

              {#if !isSingleGalleryImage}
                <button
                  type="button"
                  class="back-to-top"
                  onclick={scrollBackToTop}
                >
                  BACK TO TOP
                </button>
              {/if}
            </div>
          {/key}
        {:else}
          <p class="empty-message">
            {isAllItems() ? computedNoFeaturedText : computedNoGalleryText}
          </p>
        {/if}
      </section>
    </section>
  {:else}
    <p class="empty-message">{computedEmptyItemsText}</p>
  {/if}

  {#if selectedImage && !isAllItems() && !isSingleGalleryImage}
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
          alt={selectedImage.alt ||
            selectedImage.itemTitle ||
            `${itemLabel} image`}
        />

        <div class="lightbox-meta">
          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else if selectedImage.itemTitle}
            <p>{selectedImage.itemTitle}</p>
          {:else}
            <p>{itemLabel} image</p>
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

  :global(html),
  :global(body) {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  :global(html::-webkit-scrollbar),
  :global(body::-webkit-scrollbar) {
    width: 0;
    height: 0;
    display: none;
    background: transparent;
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
    --desktop-card-height: clamp(455px, 28vw, 515px);

    width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
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
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: clamp(210px, 15vw, 265px) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
    overflow: hidden;
  }

  .left-column {
    position: relative;
    top: auto;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .painting-filter {
    width: 100%;
    max-height: 44vh;
    overflow-y: auto;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .painting-filter::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  .painting-scroll-hint {
    display: none;
  }

  .all-paintings-button,
  .selected-painting-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: auto;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #b8b8b8;
    font-size: clamp(12px, 0.78vw, 12px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.01em;
    text-align: left;
    cursor: pointer;
    transition:
      color 0.28s ease,
      opacity 0.28s ease;
    text-transform: uppercase;
  }

  .all-paintings-button .painting-button-label > span {
    text-decoration-line: none;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .all-paintings-button.active .painting-button-label > span,
  .all-paintings-button:hover .painting-button-label > span {
    text-decoration-line: underline;
  }

  .all-paintings-button.active,
  .all-paintings-button:hover,
  .all-paintings-button:focus,
  .selected-painting-button.active,
  .selected-painting-button:hover,
  .selected-painting-button:focus {
    color: var(--painting-color);
  }

  .all-paintings-button:hover .painting-button-label span,
  .all-paintings-button.active .painting-button-label span,
  .selected-painting-button:hover .painting-button-label span,
  .selected-painting-button.active .painting-button-label span {
    animation: paintingTextLift 0.42s ease both;
  }

  .painting-list-number {
    display: inline-block;
    flex: 0 0 auto;
    min-width: 0;
    margin-right: 0;
    color: inherit;
    font-size: 0.82em;
    font-weight: 700;
    opacity: 0.62;
    transform: translateY(-0.5px);
  }

  .painting-button-label {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }

  .painting-button-label span {
    display: inline-block;
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
    color: var(--painting-color);
    font-size: clamp(18px, calc(0.78vw + 6px), 20px);
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

  .preview-info strong {
    display: block;
    margin: 0 0 9px;
    color: #000000;
    font-size: clamp(12px, 0.72vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .preview-info p {
    margin: 0;
    color: #000000;
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
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  .image-grid {
    --image-card-gap: clamp(22px, 1.6vw, 30px);

    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: start;
    gap: var(--image-card-gap);
    padding: 0 0 var(--last-desktop-offset, 0px);
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    -ms-overflow-style: none;
  }

  .image-grid::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
    background: transparent;
  }

  .image-card {
    position: relative;
    display: block;
    height: var(--desktop-card-height);
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

  .magnify-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 5;
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000000;
    border-radius: 50%;
    color: #000000;
    background: rgba(255, 255, 255, 0.76);
    font-size: 28px;
    font-weight: 400;
    line-height: 1;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.92);
    transition:
      opacity 0.32s ease,
      transform 0.32s ease,
      background 0.32s ease;
  }

  .image-card:hover .magnify-icon,
  .image-card.active .magnify-icon {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
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

  .single-image-caption {
    display: none;
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

    .image-grid.single-image-grid {
      display: block;
      height: 100%;
      padding: 0;
      overflow: hidden;
    }

    .image-grid.single-image-grid:hover .image-card img {
      opacity: 1;
      filter: none;
    }

    .image-card.single-image-card,
    .image-card.single-image-card:nth-child(4n + 1),
    .image-card.single-image-card:nth-child(4n + 2),
    .image-card.single-image-card:nth-child(4n + 3),
    .image-card.single-image-card:nth-child(4n + 4),
    .image-card.single-image-card:hover,
    .image-card.single-image-card.active,
    .image-card.single-image-card:nth-child(4n + 1):hover,
    .image-card.single-image-card:nth-child(4n + 2):hover,
    .image-card.single-image-card:nth-child(4n + 3):hover,
    .image-card.single-image-card:nth-child(4n + 4):hover {
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: transparent;
      cursor: default;
      transform: none;
    }

    .image-card.single-image-card::before,
    .image-card.single-image-card::after {
      display: none;
    }

    .image-card.single-image-card figure {
      width: 100%;
      height: calc(100% - 42px);
      flex: 1 1 auto;
      margin: 0;
      background: #f8f8f6;
      overflow: hidden;
    }

    .image-card.single-image-card img,
    .image-grid:hover .image-card.single-image-card img,
    .image-grid:hover .image-card.single-image-card:hover img,
    .image-grid:hover .image-card.single-image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 0;
      opacity: 1;
      object-fit: cover;
      transform: none;
      filter: none;
    }

    .image-card.single-image-card:hover img,
    .image-card.single-image-card.active img,
    .image-grid.single-image-grid:hover .image-card.single-image-card:hover img,
    .image-grid.single-image-grid .image-card.single-image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 0;
      object-fit: contain;
      transform: none;
      opacity: 1;
      filter: none;
    }

    .image-card.single-image-card .magnify-icon,
    .image-card.single-image-card .image-number {
      display: none;
    }

    .single-image-caption {
      width: 100%;
      display: block;
      flex: 0 0 auto;
      margin: 12px 0 0;
      color: #000000;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: 0.02em;
      text-align: left;
      text-transform: uppercase;
    }
  }

  @media (min-width: 1440px) {
    .paintings-page {
      --desktop-card-height: clamp(455px, 27vw, 510px);
      padding-right: 72px;
    }

    .paintings-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }
  }

  @media (min-width: 1680px) {
    .paintings-page {
      --desktop-card-height: 510px;
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
  }

  @media (max-width: 1280px) {
    .paintings-page {
      --desktop-card-height: 455px;
      padding: 96px 72px 90px 28px;
    }

    .paintings-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .painting-preview h1 {
      max-width: 280px;
      font-size: clamp(19px, calc(0.95vw + 6px), 21px);
    }

    .image-grid {
      column-gap: 22px;
      row-gap: 32px;
    }
  }

  @media (max-width: 1024px) {
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
      z-index: 20;
      height: auto;
      min-height: 0;
      flex: 0 0 auto;
      display: block;
      margin: 0;
      padding-top: 136px;
      padding-bottom: 30px;
      background: #ffffff;
    }

    .painting-filter {
      position: fixed;
      top: 108px;
      left: 16px;
      right: 16px;
      z-index: 40;
      width: calc(100% - 32px);
      max-height: 106px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
      margin: 0;
      padding: 0;
      text-align: right;
      background: #ffffff;
    }

    .painting-scroll-hint {
      position: sticky;
      bottom: 0;
      align-self: flex-end;
      display: inline-flex;
      justify-content: flex-end;
      width: 100%;
      padding: 7px 0 0;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        #ffffff 45%,
        #ffffff 100%
      );
      color: var(--painting-color);
      font-size: 10px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0.08em;
      text-align: right;
      pointer-events: none;
    }

    .all-paintings-button,
    .selected-painting-button {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 0;
      text-align: right;
      font-size: 12px;
      line-height: 1.08;
      white-space: nowrap;
    }

    .painting-button-label {
      max-width: calc(100% - 24px);
      text-align: right;
    }

    .painting-button-label span {
      white-space: nowrap;
    }

    .painting-preview {
      width: 100%;
      max-width: none;
      display: block;
      text-align: left;
    }

    .painting-preview h1 {
      max-width: 520px;
      margin: 0 0 8px;
      font-size: 16px;
      text-align: left;
      line-height: 1;
    }

    .preview-info {
      width: 100%;
      max-width: none;
      margin-bottom: 0;
      text-align: left;
    }

    .preview-info strong {
      font-size: 14px;
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
      width: 100%;
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
    }

    .image-grid.single-image-grid {
      display: block;
      height: 100%;
      padding: 0 0 calc(70px + env(safe-area-inset-bottom));
      overflow-y: auto;
      overflow-x: hidden;
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

    .image-card img {
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

    .image-card.single-image-card,
    .image-card.single-image-card:nth-child(even),
    .image-card.single-image-card:nth-child(4n + 1),
    .image-card.single-image-card:nth-child(4n + 2),
    .image-card.single-image-card:nth-child(4n + 3),
    .image-card.single-image-card:nth-child(4n + 4),
    .image-card.single-image-card:hover,
    .image-card.single-image-card.active {
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: transparent;
      cursor: default;
      transform: none;
    }

    .image-card.single-image-card figure {
      width: 100%;
      height: calc(100% - 42px);
      flex: 1 1 auto;
      margin: 0;
      background: #eeeeee;
      overflow: hidden;
    }

    .image-card.single-image-card img,
    .image-grid:hover .image-card.single-image-card img,
    .image-grid:hover .image-card.single-image-card:hover img,
    .image-grid:hover .image-card.single-image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 0;
      opacity: 1;
      object-fit: cover;
      transform: none;
      filter: none;
    }

    .image-card.single-image-card:hover img,
    .image-card.single-image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 0;
      object-fit: contain;
      opacity: 1;
      filter: none;
    }

    .image-card.single-image-card .magnify-icon,
    .image-card.single-image-card .image-number {
      display: none;
    }

    .single-image-caption {
      width: 100%;
      display: block;
      flex: 0 0 auto;
      margin: 12px 0 0;
      color: #000000;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: 0.02em;
      text-align: left;
      text-transform: uppercase;
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
      padding-top: 128px;
      padding-bottom: 28px;
    }

    .painting-filter {
      position: fixed;
      top: 108px;
      left: 16px;
      right: 16px;
      z-index: 40;
      width: calc(100% - 32px);
      max-height: 100px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
      margin: 0;
      padding: 0;
      text-align: right;
      background: #ffffff;
    }

    .painting-scroll-hint {
      font-size: 9px;
      padding-top: 6px;
    }

    .all-paintings-button,
    .selected-painting-button {
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 0;
      text-align: right;
      font-size: 12px;
      line-height: 1.08;
      white-space: nowrap;
    }

    .painting-button-label {
      max-width: calc(100% - 24px);
      text-align: right;
    }

    .painting-button-label span {
      white-space: nowrap;
    }

    .painting-preview h1 {
      max-width: 100%;
      margin: 0 0 8px;
      font-size: 14px;
      text-align: left;
    }

    .preview-info strong {
      font-size: 12px;
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

    .image-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 10px;
      padding: 0 0 calc(145px + env(safe-area-inset-bottom));
    }

    .image-grid.single-image-grid {
      display: block;
      height: 100%;
      padding: 0 0 calc(60px + env(safe-area-inset-bottom));
      overflow-y: auto;
      overflow-x: hidden;
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

    .image-card.single-image-card,
    .image-card.single-image-card:nth-child(even),
    .image-card.single-image-card:nth-child(4n + 1),
    .image-card.single-image-card:nth-child(4n + 2),
    .image-card.single-image-card:nth-child(4n + 3),
    .image-card.single-image-card:nth-child(4n + 4),
    .image-card.single-image-card:hover,
    .image-card.single-image-card.active {
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: transparent;
      cursor: default;
      transform: none;
    }

    .image-card.single-image-card figure {
      width: 100%;
      height: calc(100% - 40px);
      flex: 1 1 auto;
      margin: 0;
      background: #eeeeee;
      overflow: hidden;
    }

    .image-card.single-image-card img,
    .image-grid:hover .image-card.single-image-card img,
    .image-grid:hover .image-card.single-image-card:hover img,
    .image-grid:hover .image-card.single-image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 0;
      opacity: 1;
      object-fit: cover;
      transform: none;
      filter: none;
    }

    .image-card.single-image-card:hover img,
    .image-card.single-image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 0;
      object-fit: contain;
      opacity: 1;
      filter: none;
    }

    .image-card.single-image-card .magnify-icon,
    .image-card.single-image-card .image-number {
      display: none;
    }

    .single-image-caption {
      width: 100%;
      display: block;
      flex: 0 0 auto;
      margin: 10px 0 0;
      color: #000000;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: 0.02em;
      text-align: left;
      text-transform: uppercase;
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
      padding-top: 124px;
      padding-bottom: 26px;
    }

    .painting-preview h1 {
      font-size: 14px;
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

    .image-grid.single-image-grid {
      height: 100%;
      padding-bottom: calc(56px + env(safe-area-inset-bottom));
    }

    .image-card.single-image-card,
    .image-card.single-image-card:nth-child(even),
    .image-card.single-image-card:nth-child(4n + 1),
    .image-card.single-image-card:nth-child(4n + 2),
    .image-card.single-image-card:nth-child(4n + 3),
    .image-card.single-image-card:nth-child(4n + 4) {
      height: 100%;
      min-height: 0;
    }

    .image-card.single-image-card figure {
      height: calc(100% - 38px);
    }

    .image-card.single-image-card img,
    .image-grid:hover .image-card.single-image-card:hover img,
    .image-grid:hover .image-card.single-image-card.active img {
      min-height: 0;
    }

    .single-image-caption {
      font-size: 10px;
    }
  }
</style>
