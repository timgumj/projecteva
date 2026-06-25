<script>
  let { data } = $props();

  let activeCategory = $state("ALL WORK");
  let hoveredWorkId = $state(null);
  let workGridElement = $state(null);

  const artistName = "Eva Eichinger ";

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

    if (categorySlug === "paintings") {
      return `/paintings?post=${work.id}`;
    }

    if (categorySlug === "performances") {
      return `/performances?post=${work.id}`;
    }

    if (categorySlug === "exhibitions") {
      return `/exhibitions?post=${work.id}`;
    }

    if (work.frontendLink && work.frontendLink !== "#") {
      return work.frontendLink;
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

  let categories = $derived(() => {
    const found = new Map();

    allWorks.forEach((work) => {
      const categoryNames = getWorkCategoryNames(work);

      categoryNames.forEach((categoryName) => {
        found.set(categoryName, categoryName);
      });
    });

    return ["ALL WORK", ...Array.from(found.values())];
  });

  let filteredWorks = $derived(() => {
    if (activeCategory === "ALL WORK") {
      return allWorks;
    }

    return allWorks.filter((work) =>
      getWorkCategoryNames(work).includes(activeCategory),
    );
  });

  let activeWork = $derived(
    filteredWorks().find((work) => work.id === hoveredWorkId) ||
      filteredWorks()[0],
  );

  function setCategory(category) {
    activeCategory = category;
    hoveredWorkId = null;

    if (workGridElement) {
      workGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function setHoveredWork(work) {
    hoveredWorkId = work.id;
  }

  function scrollBackToTop() {
    if (workGridElement) {
      workGridElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
</script>

<svelte:head>
  <title>{artistName} | Contemporary Artist in Vienna</title>

  <meta
    name="description"
    content="{artistName} presents selected contemporary artworks, exhibitions, visual projects and case studies in a minimalist artist portfolio."
  />

  <meta name="robots" content="index, follow" />

  {#if activeWork?.featuredImage}
    <meta property="og:image" content={activeWork.featuredImage} />
  {/if}
</svelte:head>

<main class="work-page">
  <section class="work-layout" aria-label="Selected works">
    <aside class="left-column" aria-label="Project information">
      <div class="work-filter" aria-label="Work categories">
        {#each categories() as category}
          <button
            type="button"
            class:active={activeCategory === category}
            onclick={() => setCategory(category)}
          >
            {category}
          </button>
        {/each}
      </div>

      {#if activeWork}
        <div class="project-preview">
          <h1>
            <span class="desktop-title">{activeWork.title}</span>
            <span class="mobile-title">{activeCategory}</span>
          </h1>

          <div class="project-preview-bottom">
            <div class="project-preview-info">
              <strong>{getWorkCategoryNames(activeWork)[0] || "PROJECT"}</strong
              >

              {#if activeWork.excerpt}
                <p>{@html cleanHtml(activeWork.excerpt)}</p>
              {:else if activeWork.description}
                <p>{@html cleanHtml(activeWork.description)}</p>
              {:else}
                <p>{activeWork.title} is part of the selected works archive.</p>
              {/if}
            </div>

            <div class="case-count">
              CASE STUDIES({filteredWorks().length})
            </div>
          </div>
        </div>
      {/if}
    </aside>

    {#if filteredWorks().length > 0}
      <section
        class="work-grid"
        aria-label="Work gallery"
        bind:this={workGridElement}
      >
        {#each filteredWorks() as work, index}
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
</main>

<style>
  :global(html),
  :global(body),
  .work-page {
    font-family: "Inconsolata", monospace;
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

  .work-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 90px 90px 28px;
    background: #ffffff;
    text-transform: uppercase;
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
    display: grid;
    grid-template-columns: 19% 81%;
    gap: 32px;
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

  .work-filter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
  }

  .work-filter button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #bdbdbd;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    text-align: left;
    cursor: pointer;
  }

  .work-filter button.active,
  .work-filter button:hover {
    color: #000000;
  }

  .project-preview {
    width: 100%;
  }

  .project-preview h1 {
    max-width: 340px;
    margin: 0 0 46px;
    color: #000000;
    font-size: clamp(26px, 2.55vw, 24px);
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0em;
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
    max-width: 330px;
  }

  .project-preview-info strong {
    display: block;
    margin: 0 0 8px;
    color: #000000;
    font-size: 16px;
    font-weight: 900;
    line-height: 1;
  }

  .project-preview-info p {
    margin: 0;
    color: #2c2b2b;
    font-size: 16px;
    font-weight: 400;
    line-height: 1;
    text-transform: uppercase;
  }

  .project-preview-info :global(p) {
    margin: 0;
    text-transform: uppercase;
  }

  .case-count {
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
  }

  .work-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 28px;
    row-gap: 34px;
    padding: 6px 0 40px;
  }

  .work-card {
    position: relative;
    display: block;
    min-height: 570px;
    overflow: hidden;
    color: #000000;
    background: #f6f6f4;
    text-decoration: none;
    isolation: isolate;
  }

  .work-card::before {
    content: "";
    position: absolute;
    inset: 14px;
    z-index: 2;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.35s ease,
      inset 0.35s ease;
  }

  .work-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08),
      rgba(0, 0, 0, 0.08)
    );
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }

  .work-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f6f6f4;
  }

  .work-card img {
    width: 100%;
    height: 100%;
    min-height: 570px;
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1.015);
    transition:
      opacity 0.35s ease,
      width 0.6s ease,
      height 0.6s ease,
      transform 0.6s ease,
      filter 0.6s ease;
  }

  .work-grid:hover .work-card img {
    opacity: 0.22;
    filter: grayscale(20%) contrast(0.88);
  }

  .work-grid:hover .work-card:hover,
  .work-grid:hover .work-card.active {
    background: #f8f7f4;
  }

  .work-grid:hover .work-card:hover::before,
  .work-grid:hover .work-card.active::before {
    inset: 18px;
    opacity: 1;
  }

  .work-grid:hover .work-card:hover::after,
  .work-grid:hover .work-card.active::after {
    opacity: 1;
  }

  .work-grid:hover .work-card:hover img,
  .work-grid:hover .work-card.active img {
    width: calc(100% - 54px);
    height: calc(100% - 54px);
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
    top: 24px;
    left: 24px;
    z-index: 4;
    color: #000000;
    font-size: 13px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.04em;
    opacity: 0;
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
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
    .work-card:nth-child(even) {
      transform: translateY(42px);
    }

    .work-card:nth-child(4n + 1) {
      min-height: 640px;
    }

    .work-card:nth-child(4n + 1) img {
      min-height: 640px;
    }

    .work-card:nth-child(4n + 2) {
      min-height: 520px;
    }

    .work-card:nth-child(4n + 2) img {
      min-height: 520px;
    }

    .work-card:nth-child(4n + 3) {
      min-height: 540px;
    }

    .work-card:nth-child(4n + 3) img {
      min-height: 540px;
    }

    .work-card:nth-child(4n + 4) {
      min-height: 650px;
    }

    .work-card:nth-child(4n + 4) img {
      min-height: 650px;
    }
  }

  @media (max-width: 1280px) {
    .work-page {
      padding: 96px 80px 90px 28px;
    }

    .work-layout {
      grid-template-columns: 21% 79%;
      gap: 28px;
    }

    .project-preview h1 {
      font-size: clamp(26px, 2.4vw, 38px);
    }

    .work-grid {
      column-gap: 22px;
      row-gap: 30px;
    }

    .work-card,
    .work-card img {
      min-height: 500px;
    }

    .work-card:nth-child(4n + 1),
    .work-card:nth-child(4n + 1) img {
      min-height: 570px;
    }

    .work-card:nth-child(4n + 2),
    .work-card:nth-child(4n + 2) img {
      min-height: 470px;
    }

    .work-card:nth-child(4n + 3),
    .work-card:nth-child(4n + 3) img {
      min-height: 490px;
    }

    .work-card:nth-child(4n + 4),
    .work-card:nth-child(4n + 4) img {
      min-height: 580px;
    }
  }

  @media (max-width: 1024px) {
    :global(html),
    :global(body) {
      height: 100%;
      overflow: hidden;
    }

    .work-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 118px 24px 0;
    }

    .work-layout {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
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
      padding-top: 86px;
      padding-bottom: 24px;
      background: #ffffff;
    }

    .work-filter {
      position: fixed;
      top: 118px;
      left: 24px;
      right: 24px;
      z-index: 40;
      width: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
      margin: 0;
      padding: 0;
      text-align: right;
      background: #ffffff;
    }

    .work-filter button {
      display: block;
      width: auto;
      margin: 0;
      padding: 0;
      text-align: right;
      font-size: 14px;
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
      font-size: clamp(18px, 3.2vw, 25px);
      text-align: left;
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
      min-height: 0;
      flex: 1 1 auto;
      margin-left: 0;
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
      min-height: auto;
      overflow: visible;
      background: transparent;
      transform: none;
    }

    .work-card::before,
    .work-card::after {
      display: none;
    }

    .work-card figure {
      height: 440px;
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
      min-height: 440px;
      transform: none;
    }

    .work-grid:hover .work-card img {
      opacity: 1;
      filter: none;
    }

    .work-grid:hover .work-card:hover img,
    .work-grid:hover .work-card.active img {
      width: 100%;
      height: 100%;
      min-height: 440px;
      object-fit: cover;
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
    .work-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 108px 16px 0;
    }

    .left-column {
      padding-top: 76px;
      padding-bottom: 22px;
    }

    .work-filter {
      position: fixed;
      top: 108px;
      left: 16px;
      right: 16px;
      z-index: 40;
      width: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
      margin: 0;
      padding: 0;
      text-align: right;
      background: #ffffff;
    }

    .work-filter button {
      display: block;
      width: auto;
      margin: 0;
      padding: 0;
      text-align: right;
      font-size: 12px;
      line-height: 1.08;
    }

    .project-preview h1 {
      max-width: 100%;
      margin: 0 0 8px;
      font-size: clamp(15px, 4.2vw, 20px);
      text-align: left;
    }

    .case-count {
      font-size: 12px;
      text-align: left;
    }

    .work-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 10px;
      padding: 0 0 calc(145px + env(safe-area-inset-bottom));
    }

    .work-card figure {
      height: 260px;
    }

    .work-card img {
      min-height: 260px;
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
    .left-column {
      padding-top: 72px;
      padding-bottom: 20px;
    }

    .project-preview h1 {
      font-size: clamp(14px, 4vw, 18px);
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
