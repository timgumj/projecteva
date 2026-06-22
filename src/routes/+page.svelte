<script>
  let { data } = $props();

  let activeCategory = $state("ALL WORK");
  let hoveredWorkId = $state(null);
  let workGridElement = $state(null);

  let allWorks = $derived(data.works || []);

  function cleanHtml(value) {
    return value || "";
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

    return [];
  }

  let categories = $derived(() => {
    const found = new Map();

    allWorks.forEach((work) => {
      const parentCategories = getParentCategories(work);

      parentCategories.forEach((category) => {
        found.set(category.name.toUpperCase(), category.name.toUpperCase());
      });

      if (parentCategories.length === 0 && work.group) {
        found.set(work.group.toUpperCase(), work.group.toUpperCase());
      }
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
  <title>Project Eva | Contemporary Artist Portfolio</title>

  <meta
    name="description"
    content="Project Eva is a minimalist contemporary artist portfolio featuring selected works, exhibitions, and visual projects."
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
          <h1>{activeWork.title}</h1>

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
            href={work.frontendLink}
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

            <span class="work-number">
              {String(index + 1).padStart(2, "0")}
            </span>
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

  .work-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 90px 90px 28px;
    background: #ffffff;
  }

  .work-layout {
    width: 100%;
    display: grid;
    grid-template-columns: 19% 81%;
    gap: 24px;
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
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1.08;
    text-align: left;
    text-transform: uppercase;
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
    font-size: clamp(27px, 2.55vw, 45px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.055em;
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
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .project-preview-info p {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
  }

  .project-preview-info :global(p) {
    margin: 0;
  }

  .case-count {
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .work-grid {
    width: calc(100% + 10px);
    margin-left: -10px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 12px;
    row-gap: 12px;
    padding: 0 0 68px;
  }

  .work-card {
    position: relative;
    display: block;
    min-height: 560px;
    overflow: hidden;
    color: #000000;
    background: #eeeeee;
    text-decoration: none;
  }

  .work-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eeeeee;
  }

  .work-card img {
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
      transform 0.55s ease,
      filter 0.55s ease;
  }

  .work-grid:hover .work-card img {
    opacity: 0.12;
    filter: grayscale(10%);
  }

  .work-grid:hover .work-card:hover img,
  .work-grid:hover .work-card.active img {
    width: 92%;
    height: 92%;
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    transform: scale(1);
    filter: none;
  }

  .work-number {
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

  .work-card:hover .work-number,
  .work-card.active .work-number {
    opacity: 1;
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
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
    cursor: pointer;
  }

  .empty-message {
    margin: 0;
    padding: 120px 0;
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
  }

  @media (max-width: 1280px) {
    .work-page {
      padding: 96px 80px 90px 28px;
    }

    .work-layout {
      grid-template-columns: 21% 79%;
      gap: 24px;
    }

    .project-preview h1 {
      font-size: clamp(26px, 2.4vw, 38px);
    }

    .work-card,
    .work-card img {
      min-height: 500px;
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
      padding-bottom: 22px;
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
      margin: 0 0 14px;
      font-size: clamp(22px, 4.2vw, 34px);
      text-align: left;
    }

    .project-preview-bottom {
      gap: 8px;
      text-align: left;
    }

    .project-preview-info {
      max-width: 420px;
      text-align: left;
    }

    .project-preview-info strong,
    .project-preview-info p,
    .case-count {
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
      gap: 12px;
      padding: 0 0 calc(140px + env(safe-area-inset-bottom));
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
    .work-card img {
      min-height: 440px;
    }

    .work-grid:hover .work-card:hover img,
    .work-grid:hover .work-card.active img {
      width: 92%;
      height: 92%;
      min-height: 0;
      object-fit: contain;
    }

    .back-to-top {
      display: block;
      margin: 44px 0 0;
      padding-bottom: calc(56px + env(safe-area-inset-bottom));
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
      padding-bottom: 20px;
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

    .project-preview {
      width: 100%;
      max-width: none;
      display: block;
      text-align: left;
    }

    .project-preview h1 {
      max-width: 100%;
      margin: 0 0 10px;
      font-size: clamp(18px, 5.4vw, 25px);
      text-align: left;
    }

    .project-preview-info {
      max-width: 76%;
      text-align: left;
    }

    .project-preview-info strong,
    .project-preview-info p,
    .case-count {
      font-size: 12px;
      text-align: left;
    }

    .work-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      padding: 0 0 calc(130px + env(safe-area-inset-bottom));
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

    .work-card,
    .work-card img {
      min-height: 260px;
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
      opacity: 1;
      font-size: 12px;
    }

    .back-to-top {
      display: block;
      margin-top: 38px;
      padding-bottom: calc(56px + env(safe-area-inset-bottom));
      font-size: 12px;
    }
  }

  @media (max-width: 420px) {
    .left-column {
      padding-top: 72px;
      padding-bottom: 18px;
    }

    .project-preview h1 {
      font-size: clamp(17px, 5vw, 22px);
    }

    .project-preview-info {
      max-width: 82%;
    }

    .work-card,
    .work-card img {
      min-height: 220px;
    }

    .work-grid:hover .work-card:hover img,
    .work-grid:hover .work-card.active img {
      min-height: 220px;
    }
  }
</style>
