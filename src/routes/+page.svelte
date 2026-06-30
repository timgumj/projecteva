<script>
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let { data } = $props();

  let activeCategory = $state("ALL WORK");
  let hoveredCategory = $state(null);
  let hoveredWorkId = $state(null);
  let previewHasStarted = $state(false);
  let workGridElement = $state(null);
  let workSectionElement = $state(null);

  const artistName = "Eva Eichinger ";
  const welcomeTitle = "Eva Eichinger";
  const welcomeInfoTitle = "Contemporary Artist in Vienna";
  const welcomeDescription =
    '"when going down the rabbit hole prepare to chill with lions" - EVA.';

  let allWorks = $derived(data.works || []);

  function cleanHtml(value) {
    return value || "";
  }

  function slugify(value = "") {
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getCategoryColor(category = "") {
    const slug = slugify(category);

    if (slug === "painting" || slug === "paintings") return "#ff5c01";
    if (slug === "exhibition" || slug === "exhibitions") return "#24d480";
    if (slug === "performance" || slug === "performances") return "#ab9bf2";

    return "#000000";
  }

  function normalizeCategorySlug(work) {
    const rawSlug =
      work.categorySlug ||
      work.slug ||
      work.groupSlug ||
      slugify(work.group || "");

    const slug = slugify(rawSlug);

    if (slug === "painting" || slug === "paintings") return "paintings";
    if (slug === "performance" || slug === "performances")
      return "performances";
    if (slug === "exhibition" || slug === "exhibitions") return "exhibitions";

    return slug;
  }

  function getWorkLink(work) {
    const categorySlug = normalizeCategorySlug(work);

    if (work.frontendLink && work.frontendLink !== "#") {
      return work.frontendLink;
    }

    if (categorySlug === "paintings") {
      return `/painting?post=${work.id}`;
    }

    if (categorySlug === "performances") {
      return `/performances?post=${work.id}`;
    }

    if (categorySlug === "exhibitions") {
      return `/exhibitions?post=${work.id}`;
    }

    return `/works?post=${work.id}`;
  }

  function getRawCategories(work) {
    const possibleCategories =
      work.categories ||
      work.category ||
      work.parentCategories ||
      work.projectCategories ||
      work.workCategories ||
      [];

    if (!Array.isArray(possibleCategories)) {
      return [];
    }

    return possibleCategories;
  }

  function getParentCategories(work) {
    return getRawCategories(work)
      .filter((category) => {
        if (!category) return false;

        if (category.parent === 0 || category.parent === null) return true;
        if (category.parentId === 0 || category.parentId === null) return true;
        if (category.parent === undefined && category.parentId === undefined)
          return true;

        return false;
      })
      .map((category) => ({
        name: category.name || category.title || category.slug || "",
        slug: category.slug || category.name || category.title || "",
      }))
      .filter((category) => category.name);
  }

  function getWorkCategoryNames(work) {
    const parentCategories = getParentCategories(work);

    if (parentCategories.length > 0) {
      return parentCategories.map((category) => category.name.toUpperCase());
    }

    if (work.group) {
      return [work.group.toUpperCase()];
    }

    return ["HOME PAGE"];
  }

  function getPreviewCategory(work) {
    if (activeCategory !== "ALL WORK") {
      return activeCategory;
    }

    return getWorkCategoryNames(work)[0] || "";
  }

  function isIntroPreview() {
    return (
      !previewHasStarted ||
      hoveredCategory === "ALL WORK" ||
      (activeCategory === "ALL WORK" && !hoveredWorkId)
    );
  }

  function getPreviewColor() {
    if (isIntroPreview()) {
      return "#000000";
    }

    if (hoveredCategory) {
      return getCategoryColor(hoveredCategory);
    }

    if (activeWork) {
      return getCategoryColor(getPreviewCategory(activeWork));
    }

    return "#000000";
  }

  function getDesktopPreviewTitle() {
    if (isIntroPreview()) {
      return welcomeTitle;
    }

    return activeWork?.title || welcomeTitle;
  }

  function getDesktopLastCardOffset(count) {
    const position = count % 4;

    if (position === 1) return 0;
    if (position === 2) return 34;
    if (position === 3) return 8;

    return 42;
  }

  let categories = $derived.by(() => {
    const found = new Map();

    allWorks.forEach((work) => {
      const categoryNames = getWorkCategoryNames(work);

      categoryNames.forEach((categoryName) => {
        found.set(categoryName, categoryName);
      });
    });

    const preferredOrder = ["PAINTINGS", "EXHIBITIONS", "PERFORMANCES"];

    const orderedCategories = preferredOrder.filter((categoryName) =>
      found.has(categoryName),
    );

    const remainingCategories = Array.from(found.values()).filter(
      (categoryName) => !preferredOrder.includes(categoryName),
    );

    return ["ALL WORK", ...orderedCategories, ...remainingCategories];
  });

  let filteredWorks = $derived.by(() => {
    if (activeCategory === "ALL WORK") {
      return allWorks;
    }

    return allWorks.filter((work) =>
      getWorkCategoryNames(work).includes(activeCategory),
    );
  });

  let activeWork = $derived.by(
    () =>
      filteredWorks.find((work) => work.id === hoveredWorkId) ||
      filteredWorks[0],
  );

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

  function isDesktopViewport() {
    if (!browser) return false;

    return window.matchMedia("(min-width: 1025px)").matches;
  }

  function scrollToWorks() {
    if (!browser || !workSectionElement) return;

    const top = workSectionElement.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  function scrollGridToTop() {
    if (!browser) return;

    if (!isDesktopViewport() && workSectionElement) {
      const top =
        workSectionElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      return;
    }

    if (workGridElement) {
      workGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function getGridMaxScroll() {
    if (!workGridElement) return 0;

    return Math.max(
      0,
      workGridElement.scrollHeight - workGridElement.clientHeight,
    );
  }

  function isWorkSectionReadyForInternalScroll() {
    if (!browser || !workSectionElement || !isDesktopViewport()) return false;

    const rect = workSectionElement.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return rect.top <= 4 && rect.bottom >= viewportHeight - 4;
  }

  function canRouteGridScroll(deltaY) {
    if (!workGridElement) return false;

    const maxScroll = getGridMaxScroll();

    if (maxScroll <= 1) return false;

    if (deltaY > 0) {
      return workGridElement.scrollTop < maxScroll - 1;
    }

    if (deltaY < 0) {
      return workGridElement.scrollTop > 1;
    }

    return false;
  }

  function routeWorkSectionWheel(event) {
    if (!isWorkSectionReadyForInternalScroll()) return;

    const deltaY = event.deltaY;

    if (canRouteGridScroll(deltaY)) {
      event.preventDefault();
      workGridElement.scrollTop += deltaY;
    }
  }

  function setCategory(category) {
    activeCategory = category;
    hoveredWorkId = null;

    if (category === "ALL WORK") {
      previewHasStarted = false;
    } else {
      previewHasStarted = true;
    }

    scrollGridToTop();
  }

  function setHoveredCategory(category) {
    hoveredCategory = category;

    if (category !== "ALL WORK") {
      previewHasStarted = true;
    }
  }

  function clearHoveredCategory() {
    hoveredCategory = null;
  }

  function setHoveredWork(work) {
    previewHasStarted = true;
    hoveredWorkId = work.id;
  }

  function scrollBackToTop() {
    scrollGridToTop();
  }

  onMount(() => {
    unlockPageLocks();

    requestAnimationFrame(() => {
      unlockPageLocks();
    });

    setTimeout(() => {
      unlockPageLocks();
    }, 0);

    const wheelHandler = (event) => routeWorkSectionWheel(event);

    if (workSectionElement) {
      workSectionElement.addEventListener("wheel", wheelHandler, {
        passive: false,
      });
    }

    return () => {
      unlockPageLocks();

      if (workSectionElement) {
        workSectionElement.removeEventListener("wheel", wheelHandler);
      }
    };
  });
</script>

<svelte:head>
  <title>{artistName} | Contemporary Artist in Vienna</title>

  <meta
    name="description"
    content={`${artistName} presents selected contemporary artworks, exhibitions, visual projects and case studies in a minimalist artist portfolio.`}
  />

  <meta name="robots" content="index, follow" />

  {#if activeWork?.featuredImage}
    <meta property="og:image" content={activeWork.featuredImage} />
  {/if}
</svelte:head>

<main class="home-page">
  <section class="announcement-hero" aria-label="Linz exhibition announcement">
    <a href="/event" class="hero-side-link hero-side-link-left">
      VIEW THE FULL SCHEDULE ↗
    </a>

    <a href="/flyer.pdf" class="hero-side-link hero-side-link-right" download>
      DOWNLOAD THE FLYER ↗
    </a>

    <div class="hero-center">
      <p class="hero-kicker">UPCOMING</p>

      <h1>
        <span>LINZ</span>
        <span>EXHIBITION</span>
      </h1>

      <div class="hero-details">
        <p>SEPTEMBER, 10TH-15TH 2026</p>
        <p>OÖ KULTURQUARTIER</p>
        <p>OK PLATZ 1, 4020 LINZ</p>
      </div>

      <div class="hero-list">
        <p>↗ OPENING 10 SEPTEMBER</p>
        <p>↗ ARTIST TALK 12 SEPTEMBER</p>
        <p>↗ SELECTED WORKS 2026</p>
      </div>
    </div>

    <div class="hero-bottom-type">
      <div class="hero-bottom-item">
        <span class="hero-bottom-main">RELATIONS</span>
        <span class="hero-bottom-label">NEW EXHIBITION ANNOUNCEMENT</span>
      </div>

      <div class="hero-bottom-item hero-bottom-item-right">
        <span class="hero-bottom-main">2026</span>
        <span class="hero-bottom-label">LINZ / AUSTRIA</span>
      </div>
    </div>

    <button
      type="button"
      class="hero-scroll-indicator"
      aria-label="Scroll to selected works"
      onclick={scrollToWorks}
    >
      <lord-icon
        src="https://cdn.lordicon.com/evxithfv.json"
        trigger="in"
        delay="1500"
        stroke="light"
        state="in-reveal"
        colors="primary:#000000,secondary:#000000"
        style="width:60px;height:60px"
      >
      </lord-icon>

      <span>⌵</span>
    </button>
  </section>

  <section
    class="work-page"
    id="selected-works"
    aria-label="Selected works"
    bind:this={workSectionElement}
  >
    <section class="work-layout" aria-label="Selected works">
      <aside class="left-column" aria-label="Project information">
        <div class="work-filter" aria-label="Work categories">
          {#each categories as category, index}
            <button
              type="button"
              class:active={activeCategory === category}
              class:all-work-button={category === "ALL WORK"}
              style={`--category-color: ${getCategoryColor(category)};`}
              onmouseenter={() => setHoveredCategory(category)}
              onmouseleave={clearHoveredCategory}
              onfocus={() => setHoveredCategory(category)}
              onblur={clearHoveredCategory}
              onclick={() => setCategory(category)}
            >
              {#if category !== "ALL WORK"}
                <span class="filter-number">
                  {String(index).padStart(2, "0")}
                </span>
              {/if}<span class="filter-label">
                <span>{category}</span>
              </span>
            </button>
          {/each}
        </div>

        {#if activeWork}
          <div
            class="project-preview"
            style={`--preview-category-color: ${getPreviewColor()};`}
          >
            <h1>
              <span class="desktop-title">{getDesktopPreviewTitle()}</span>
              <span class="mobile-title">{activeCategory}</span>
            </h1>

            <div class="project-preview-bottom">
              <div class="project-preview-info">
                {#if isIntroPreview()}
                  <strong>{welcomeInfoTitle}</strong>
                  <p>{welcomeDescription}</p>
                {:else}
                  <strong>
                    {getWorkCategoryNames(activeWork)[0] || "PROJECT"}
                  </strong>

                  {#if activeWork.excerpt}
                    <p>{@html cleanHtml(activeWork.excerpt)}</p>
                  {:else if activeWork.description}
                    <p>{@html cleanHtml(activeWork.description)}</p>
                  {:else}
                    <p>
                      {activeWork.title} is part of the selected works archive.
                    </p>
                  {/if}
                {/if}
              </div>

              <div class="case-count">
                CASE STUDIES({filteredWorks.length})
              </div>
            </div>
          </div>
        {/if}
      </aside>

      {#if filteredWorks.length > 0}
        <section
          class="work-grid"
          aria-label="Work gallery"
          bind:this={workGridElement}
          style={`--last-desktop-offset: ${getDesktopLastCardOffset(filteredWorks.length)}px;`}
        >
          {#each filteredWorks as work, index}
            <a
              href={getWorkLink(work)}
              class="work-card"
              class:active={activeWork?.id === work.id}
              onmouseenter={() => setHoveredWork(work)}
              onfocus={() => setHoveredWork(work)}
            >
              {#if work.featuredImage}
                <figure>
                  <img
                    src={work.featuredImage}
                    alt={work.title}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </figure>
              {/if}

              <div class="mobile-card-text">
                <span class="work-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span class="mobile-work-title">
                  {work.title}
                </span>
              </div>
            </a>
          {/each}

          <button type="button" class="back-to-top" onclick={scrollBackToTop}>
            BACK TO TOP
          </button>
        </section>
      {:else}
        <p class="empty-message">No works found.</p>
      {/if}
    </section>
  </section>
</main>

<style>
  :global(html),
  :global(body),
  .home-page,
  .work-page {
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(html) {
    scroll-behavior: smooth;
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
    overscroll-behavior-y: auto;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .home-page {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    background: #ffffff;
  }

  .announcement-hero {
    position: relative;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 96px 72px 72px 28px;
    background-image: url("https://testing.zorawebdesign.com/wp-content/uploads/2026/06/paper-installation1_result.webp");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: #000000;
    text-transform: uppercase;
    isolation: isolate;
  }

  .announcement-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: none;
  }

  .announcement-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.16),
        rgba(255, 255, 255, 0.02) 34%,
        rgba(255, 255, 255, 0.02) 66%,
        rgba(255, 255, 255, 0.16)
      ),
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.12),
        rgba(255, 255, 255, 0.01) 42%,
        rgba(255, 255, 255, 0.12)
      );
    pointer-events: none;
  }

  .hero-side-link {
    position: absolute;
    top: 50%;
    z-index: 4;
    color: #ffffff;
    font-size: clamp(18px, 1.45vw, 28px);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: 0.01em;
    text-decoration-line: underline;
    text-decoration-color: #ffffff;
    text-decoration-thickness: 1px;
    text-underline-offset: 6px;
    writing-mode: vertical-rl;
    transform: translateY(-50%) rotate(180deg);
    opacity: 0.96;
    mix-blend-mode: normal;
    transition: opacity 0.3s ease;
  }

  .hero-side-link:hover {
    opacity: 0.96;
    color: #ffffff;
    text-decoration-line: underline;
    text-decoration-color: #ffffff;
    text-decoration-thickness: 1px;
    text-underline-offset: 6px;
    transform: translateY(-50%) rotate(180deg);
  }

  .hero-side-link-left {
    left: 30px;
  }

  .hero-side-link-right {
    right: 90px;
  }

  .hero-center {
    position: relative;
    z-index: 3;
    width: min(520px, 72vw);
    margin: 0 auto;
    color: #000000;
  }

  .hero-kicker {
    margin: 0 0 12px;
    font-size: clamp(11px, 0.72vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .hero-center h1 {
    margin: 0 0 18px;
    font-size: clamp(38px, 4.4vw, 88px);
    font-weight: 400;
    line-height: 0.88;
    letter-spacing: -0.055em;
  }

  .hero-center h1 span {
    display: block;
  }

  .hero-details,
  .hero-list {
    color: #000000;
    font-size: clamp(13px, 1vw, 18px);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }

  .hero-details {
    margin-top: 0;
  }

  .hero-details p,
  .hero-list p {
    margin: 0;
  }

  .hero-list {
    margin-top: 28px;
  }

  .hero-bottom-type {
    position: absolute;
    left: 28px;
    right: 72px;
    bottom: 48px;
    z-index: 3;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    color: #000000;
    font-size: clamp(40px, 4.4vw, 60px);
    font-weight: 400;
    line-height: 0.78;
    letter-spacing: -0.065em;
    pointer-events: none;
  }

  .hero-bottom-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .hero-bottom-item-right {
    align-items: flex-end;
    text-align: right;
  }

  .hero-bottom-main {
    display: block;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
  }

  .hero-bottom-label {
    display: block;
    color: #000000;
    font-size: clamp(10px, 0.72vw, 12px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .hero-scroll-indicator {
    position: absolute;
    left: 50%;
    bottom: 12px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    width: 30px;
    height: auto;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    transform: translateX(-50%);
    cursor: pointer;
  }

  .hero-scroll-indicator span {
    display: block;
    margin-top: -3px;
    color: #000000;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .work-page {
    --desktop-card-height: clamp(455px, 28vw, 515px);

    width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 100vh;
    min-height: 100dvh;
    overflow: hidden;
    padding: 96px 72px 90px 28px;
    background: #ffffff;
    text-transform: uppercase;
    scroll-margin-top: 0;
  }

  .work-page button,
  .work-page a {
    font-family: inherit;
  }

  .work-page p {
    text-transform: none;
  }

  .work-layout {
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

  .work-filter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
  }

  .work-filter button {
    --category-color: #000000;

    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #b8b8b8;
    font-size: clamp(12px, 0.78vw, 13px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.01em;
    text-align: left;
    cursor: pointer;
    transition:
      color 0.28s ease,
      opacity 0.28s ease;
  }

  .work-filter button::before {
    content: none;
  }

  .work-filter button.all-work-button::before {
    content: none;
  }

  .work-filter button.all-work-button .filter-label > span {
    text-decoration-line: none;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .work-filter button.all-work-button.active .filter-label > span,
  .work-filter button.all-work-button:hover .filter-label > span {
    text-decoration-line: underline;
  }

  .work-filter button.active,
  .work-filter button:hover {
    color: var(--category-color, #000000);
  }

  .work-filter button:hover .filter-label span,
  .work-filter button.active .filter-label span {
    animation: filterTextLift 0.42s ease both;
  }

  .filter-number {
    display: inline-block;
    min-width: 0;
    margin-right: 0;
    color: inherit;
    font-size: 0.82em;
    font-weight: 700;
    opacity: 0.62;
    transform: translateY(-0.5px);
  }

  .filter-label {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }

  .filter-label span {
    display: inline-block;
  }

  @keyframes filterTextLift {
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

  .project-preview {
    width: 100%;
  }

  .project-preview h1 {
    max-width: 280px;
    margin: 0 0 42px;
    color: var(--preview-category-color, #000000);
    font-size: clamp(18px, calc(0.78vw + 6px), 20px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
    transition:
      color 0.28s ease,
      opacity 0.35s ease,
      transform 0.35s ease;
  }

  .desktop-title {
    display: inline-block;
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

  .mobile-title {
    display: none;
  }

  .project-preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .project-preview-info {
    max-width: 265px;
  }

  .project-preview-info strong {
    display: block;
    margin: 0 0 9px;
    color: #000000;
    font-size: clamp(12px, 0.72vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .project-preview-info p {
    margin: 0;
    color: #000000;
    font-size: clamp(11px, 0.66vw, 12px);
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: 0.006em;
    text-transform: uppercase;
  }

  .project-preview-info :global(p) {
    margin: 0;
    text-transform: uppercase;
  }

  .case-count {
    color: #000000;
    font-size: clamp(11px, 0.66vw, 12px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .work-grid {
    --work-card-gap: clamp(22px, 1.6vw, 30px);

    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: start;
    gap: var(--work-card-gap);
    padding: 0 0 var(--last-desktop-offset, 0px);
    overscroll-behavior: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    -ms-overflow-style: none;
  }

  .work-grid::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
    background: transparent;
  }

  .work-grid::-webkit-scrollbar-track {
    background: transparent;
  }

  .work-grid::-webkit-scrollbar-thumb {
    background: transparent;
  }

  .work-card {
    position: relative;
    display: block;
    height: var(--desktop-card-height);
    min-height: 0;
    overflow: hidden;
    color: #000000;
    background: #f8f8f6;
    text-decoration: none;
    isolation: isolate;
    transition:
      background 0.45s ease,
      transform 0.45s ease;
  }

  .work-card::before {
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

  .work-card::after {
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

  .work-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f6;
  }

  .work-card img {
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

  .work-grid:hover .work-card img {
    opacity: 0.38;
    filter: grayscale(12%) contrast(0.94) brightness(1.03);
  }

  .work-grid:hover .work-card:hover,
  .work-grid:hover .work-card.active {
    background: #fbfaf7;
  }

  .work-grid:hover .work-card:hover::before,
  .work-grid:hover .work-card.active::before {
    opacity: 1;
  }

  .work-grid:hover .work-card:hover::after,
  .work-grid:hover .work-card.active::after {
    opacity: 1;
    transform: scale(1);
  }

  .work-grid:hover .work-card:hover img,
  .work-grid:hover .work-card.active img {
    width: calc(100% - 46px);
    height: calc(100% - 46px);
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    transform: scale(1);
    filter: none;
  }

  .mobile-card-text {
    display: contents;
  }

  .work-number {
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

  .mobile-work-title {
    display: none;
  }

  .work-card:hover .work-number,
  .work-card.active .work-number {
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
    font-size: 15px;
    font-weight: 900;
  }

  @media (min-width: 1025px) {
    .work-card:nth-child(4n + 1) {
      transform: translateY(0);
    }

    .work-card:nth-child(4n + 2) {
      transform: translateY(34px);
    }

    .work-card:nth-child(4n + 3) {
      transform: translateY(8px);
    }

    .work-card:nth-child(4n + 4) {
      transform: translateY(42px);
    }

    .work-card:nth-child(4n + 1):hover,
    .work-card:nth-child(4n + 1).active {
      transform: translateY(-3px);
    }

    .work-card:nth-child(4n + 2):hover,
    .work-card:nth-child(4n + 2).active {
      transform: translateY(31px);
    }

    .work-card:nth-child(4n + 3):hover,
    .work-card:nth-child(4n + 3).active {
      transform: translateY(5px);
    }

    .work-card:nth-child(4n + 4):hover,
    .work-card:nth-child(4n + 4).active {
      transform: translateY(39px);
    }
  }

  @media (min-width: 1440px) {
    .work-page {
      --desktop-card-height: clamp(455px, 27vw, 510px);

      padding-right: 72px;
    }

    .work-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }
  }

  @media (min-width: 1680px) {
    .work-page {
      --desktop-card-height: 510px;

      padding-right: 76px;
    }

    .work-layout {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 14px;
    }

    .project-preview h1 {
      max-width: 270px;
    }

    .project-preview-info {
      max-width: 260px;
    }
  }

  @media (max-width: 1280px) {
    .work-page {
      --desktop-card-height: 455px;

      padding: 96px 72px 90px 28px;
    }

    .work-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .project-preview h1 {
      max-width: 280px;
      font-size: clamp(19px, calc(0.95vw + 6px), 21px);
    }

    .work-grid {
      column-gap: 22px;
      row-gap: 32px;
    }
  }

  @media (max-width: 1024px) {
    .announcement-hero {
      height: calc(100svh - 118px);
      min-height: calc(100svh - 118px);
      margin-top: 118px;
      padding: 24px 24px 64px;
      background-position: center;
    }

    .hero-side-link {
      font-size: clamp(11px, 2vw, 18px);
      line-height: 0.95;
    }

    .hero-side-link-left {
      left: 24px;
    }

    .hero-side-link-right {
      right: 24px;
    }

    .hero-center {
      width: min(460px, 68vw);
    }

    .hero-center h1 {
      font-size: clamp(42px, 8.2vw, 84px);
    }

    .hero-details,
    .hero-list {
      font-size: clamp(13px, 2vw, 17px);
    }

    .hero-bottom-type {
      left: 24px;
      right: 24px;
      bottom: 42px;
      font-size: clamp(23px, 4.5vw, 46px);
    }

    .hero-bottom-item {
      gap: 6px;
    }

    .hero-bottom-label {
      font-size: clamp(8px, 1.1vw, 10px);
    }

    .hero-scroll-indicator {
      bottom: 12px;
    }

    .work-page {
      height: auto;
      min-height: 100svh;
      overflow: visible;
      padding: 118px 24px 80px;
    }

    .work-layout {
      height: auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: visible;
      gap: 0;
    }

    .left-column {
      position: sticky;
      top: 118px;
      left: auto;
      right: auto;
      z-index: 60;
      width: 100%;
      height: auto;
      min-height: 0;
      flex: 0 0 auto;
      display: block;
      margin: 0;
      padding: 0 0 24px;
      background: #ffffff;
      overflow: visible;
    }

    .work-filter {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      z-index: 40;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 7px;
      margin: 0 0 22px;
      padding: 0;
      text-align: left;
      background: #ffffff;
      overflow: visible;
    }

    .work-filter button {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      width: auto;
      max-width: 100%;
      margin: 0;
      padding: 0;
      text-align: left;
      font-size: 12px;
      line-height: 1.08;
      white-space: nowrap;
      overflow: visible;
    }

    .filter-label {
      display: inline-block;
      overflow: visible;
    }

    .filter-label span {
      display: inline-block;
      white-space: nowrap;
    }

    .work-filter button.all-work-button::before {
      left: 0;
      right: auto;
    }

    .project-preview {
      width: 100%;
      max-width: none;
      display: block;
      text-align: left;
    }

    .project-preview h1 {
      max-width: 520px;
      margin: 0 0 8px;
      font-size: 16px;
      text-align: left;
      line-height: 1;
    }

    .desktop-title {
      display: none;
    }

    .mobile-title {
      display: inline;
    }

    .project-preview-info {
      display: none;
    }

    .project-preview-bottom {
      gap: 0;
      text-align: left;
    }

    .case-count {
      font-size: 14px;
      text-align: left;
    }

    .work-grid {
      width: 100%;
      height: auto;
      min-height: 0;
      flex: none;
      margin-left: 0;
      overflow: visible;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-content: start;
      gap: 18px 12px;
      padding: 16px 0 calc(110px + env(safe-area-inset-bottom));
      scrollbar-width: none;
      scrollbar-color: transparent transparent;
      -ms-overflow-style: none;
      overscroll-behavior: auto;
      -webkit-overflow-scrolling: touch;
    }

    .work-grid::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      background: transparent;
    }

    .work-grid::-webkit-scrollbar-track {
      background: transparent;
    }

    .work-grid::-webkit-scrollbar-thumb {
      background: transparent;
    }

    .work-card,
    .work-card:nth-child(even),
    .work-card:nth-child(4n + 1),
    .work-card:nth-child(4n + 2),
    .work-card:nth-child(4n + 3),
    .work-card:nth-child(4n + 4) {
      height: 440px;
      min-height: 0;
      overflow: hidden;
      background: #eeeeee;
      transform: none;
    }

    .work-card:nth-child(4n + 1):hover,
    .work-card:nth-child(4n + 1).active,
    .work-card:nth-child(4n + 2):hover,
    .work-card:nth-child(4n + 2).active,
    .work-card:nth-child(4n + 3):hover,
    .work-card:nth-child(4n + 3).active,
    .work-card:nth-child(4n + 4):hover,
    .work-card:nth-child(4n + 4).active {
      transform: none;
    }

    .work-card::before,
    .work-card::after {
      display: none;
    }

    .work-card figure {
      width: 100%;
      height: 100%;
      background: #eeeeee;
      overflow: hidden;
    }

    .work-card img,
    .work-card:nth-child(4n + 1) img,
    .work-card:nth-child(4n + 2) img,
    .work-card:nth-child(4n + 3) img,
    .work-card:nth-child(4n + 4) img {
      width: 100%;
      height: 100%;
      min-height: 0;
      object-fit: cover;
      transform: none;
    }

    .work-grid:hover .work-card img {
      opacity: 0.42;
      filter: grayscale(10%) contrast(0.96) brightness(1.02);
    }

    .work-grid:hover .work-card:hover img,
    .work-grid:hover .work-card.active img {
      width: calc(100% - 36px);
      height: calc(100% - 36px);
      min-height: 0;
      object-fit: contain;
      opacity: 1;
      filter: none;
    }

    .mobile-card-text {
      display: block;
      margin-top: 8px;
    }

    .work-number {
      position: static;
      display: block;
      opacity: 1;
      font-size: 14px;
      transform: none;
    }

    .mobile-work-title {
      display: block;
      margin-top: 4px;
      color: #000000;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.08;
    }

    .back-to-top {
      display: block;
      margin: 44px 0 0;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 14px;
    }
  }

  @media (max-width: 700px) {
    .announcement-hero {
      height: calc(100svh - 108px);
      min-height: calc(100svh - 108px);
      margin-top: 108px;
      padding: 24px 16px 54px;
      align-items: center;
      background-position: center;
    }

    .announcement-hero::before {
      background: rgba(255, 255, 255, 0.16);
    }

    .hero-side-link {
      font-size: clamp(9px, 3.2vw, 14px);
      line-height: 0.95;
      text-underline-offset: 4px;
    }

    .hero-side-link-left {
      left: 16px;
    }

    .hero-side-link-right {
      right: 16px;
    }

    .hero-center {
      width: min(320px, 66vw);
    }

    .hero-kicker {
      margin-bottom: 10px;
      font-size: 10px;
    }

    .hero-center h1 {
      margin-bottom: 14px;
      font-size: clamp(37px, 14vw, 66px);
      line-height: 0.88;
    }

    .hero-details,
    .hero-list {
      font-size: 12px;
      line-height: 1.08;
    }

    .hero-list {
      margin-top: 22px;
    }

    .hero-bottom-type {
      left: 16px;
      right: 16px;
      bottom: 36px;
      font-size: clamp(19px, 7vw, 34px);
      letter-spacing: -0.07em;
    }

    .hero-bottom-item {
      gap: 5px;
    }

    .hero-bottom-label {
      font-size: clamp(7px, 2vw, 9px);
      line-height: 1.05;
    }

    .hero-scroll-indicator {
      bottom: 10px;
    }

    .hero-scroll-indicator span {
      font-size: 12px;
    }

    .work-page {
      height: auto;
      min-height: 100svh;
      overflow: visible;
      padding: 108px 16px 80px;
    }

    .left-column {
      position: sticky;
      top: 108px;
      padding: 0 0 22px;
    }

    .work-filter {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      z-index: 40;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 7px;
      margin: 0 0 22px;
      padding: 0;
      text-align: left;
      background: #ffffff;
      overflow: visible;
    }

    .work-filter button {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      width: auto;
      max-width: 100%;
      margin: 0;
      padding: 0;
      text-align: left;
      font-size: 12px;
      line-height: 1.08;
      white-space: nowrap;
      overflow: visible;
    }

    .filter-label {
      display: inline-block;
      overflow: visible;
    }

    .filter-label span {
      display: inline-block;
      white-space: nowrap;
    }

    .project-preview h1 {
      max-width: 100%;
      margin: 0 0 8px;
      font-size: 14px;
      text-align: left;
    }

    .case-count {
      font-size: 12px;
      text-align: left;
    }

    .work-grid {
      height: auto;
      overflow: visible;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 10px;
      padding: 16px 0 calc(100px + env(safe-area-inset-bottom));
      overscroll-behavior: auto;
    }

    .work-card,
    .work-card:nth-child(even),
    .work-card:nth-child(4n + 1),
    .work-card:nth-child(4n + 2),
    .work-card:nth-child(4n + 3),
    .work-card:nth-child(4n + 4) {
      height: auto;
      min-height: auto;
      overflow: visible;
      background: transparent;
    }

    .work-card figure {
      height: 260px;
      background: #eeeeee;
      overflow: hidden;
    }

    .work-card img {
      width: 100%;
      height: 100%;
      min-height: 260px;
      object-fit: cover;
    }

    .work-grid:hover .work-card img {
      opacity: 1;
      filter: none;
    }

    .work-grid:hover .work-card:hover img,
    .work-grid:hover .work-card.active img {
      width: 100%;
      height: 100%;
      min-height: 260px;
      object-fit: cover;
    }

    .work-number {
      font-size: 12px;
    }

    .mobile-work-title {
      font-size: 10px;
      font-weight: 700;
      line-height: 1.08;
    }

    .back-to-top {
      display: block;
      margin-top: 38px;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 12px;
    }
  }

  @media (max-width: 420px) {
    .hero-center {
      width: min(280px, 64vw);
    }

    .hero-bottom-type {
      font-size: clamp(17px, 7vw, 28px);
    }

    .hero-bottom-label {
      max-width: 120px;
    }

    .left-column {
      padding-bottom: 20px;
    }

    .project-preview h1 {
      font-size: 14px;
    }

    .work-card figure {
      height: 220px;
    }

    .work-card img {
      min-height: 220px;
    }

    .work-grid:hover .work-card:hover img,
    .work-grid:hover .work-card.active img {
      min-height: 220px;
    }
  }
</style>
