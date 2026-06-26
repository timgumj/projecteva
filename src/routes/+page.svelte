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
        {#each categories() as category, index}
          <button
            type="button"
            class:active={activeCategory === category}
            class:all-work-button={category === "ALL WORK"}
            onclick={() => setCategory(category)}
          >
            {#if category !== "ALL WORK"}
              <span class="filter-number">
                {String(index).padStart(2, "0")}
              </span>
            {/if}

            <span class="filter-label">
              <span>{category}</span>
            </span>
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

  .work-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 72px 90px 28px;
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

  .work-filter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
  }

  .work-filter button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
  }

  .work-filter button::before {
    content: none;
  }

  .work-filter button.all-work-button::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 0;
    height: 1px;
    background: currentColor;
    opacity: 0.65;
    transition: width 0.32s ease;
  }

  .work-filter button.active,
  .work-filter button:hover {
    color: #000000;
  }

  .work-filter button.all-work-button.active::before,
  .work-filter button.all-work-button:hover::before {
    width: 100%;
  }

  .work-filter button:hover .filter-label span,
  .work-filter button.active .filter-label span {
    animation: filterTextLift 0.42s ease both;
  }

  .filter-number {
    display: inline-block;
    min-width: 17px;
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
    color: #000000;
    font-size: clamp(12px, 0.78vw, 14px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
    transition:
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
    color: #262626;
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
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(20px, 1.6vw, 30px);
    row-gap: clamp(28px, 2vw, 38px);
    padding: 6px 0 40px;
  }

  .work-card {
    position: relative;
    display: block;
    height: clamp(455px, 28vw, 515px);
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
      padding-right: 72px;
    }

    .work-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }

    .work-card {
      height: clamp(455px, 27vw, 510px);
    }
  }

  @media (min-width: 1680px) {
    .work-page {
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

    .work-card {
      height: 510px;
    }
  }

  @media (max-width: 1280px) {
    .work-page {
      padding: 96px 72px 90px 28px;
    }

    .work-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .project-preview h1 {
      max-width: 280px;
      font-size: clamp(13px, 0.95vw, 15px);
    }

    .work-grid {
      column-gap: 22px;
      row-gap: 32px;
    }

    .work-card {
      height: 455px;
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
      display: inline-flex;
      width: auto;
      margin: 0;
      padding: 0;
      text-align: right;
      font-size: 14px;
    }

    .work-filter button.all-work-button::before {
      left: auto;
      right: 0;
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
      display: inline-flex;
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
      font-size: 14px;
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
    .left-column {
      padding-top: 72px;
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
