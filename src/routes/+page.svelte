<script>
  let { data } = $props();

  let selectedWorkId = $state(null);

  let worksByYear = $derived(
    data.works?.reduce((groups, work) => {
      const year = work.year || "Works";

      if (!groups[year]) {
        groups[year] = [];
      }

      groups[year].push(work);

      return groups;
    }, {}) || {},
  );

  let sortedWorksByYear = $derived(
    Object.entries(worksByYear).sort(([yearA], [yearB]) => {
      const numberA = Number(yearA);
      const numberB = Number(yearB);

      if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
        return numberB - numberA;
      }

      return yearB.localeCompare(yearA);
    }),
  );

  let selectedWork = $derived(
    data.works?.find((work) => work.id === selectedWorkId) ||
      sortedWorksByYear?.[0]?.[1]?.[0],
  );

  function selectWork(work) {
    selectedWorkId = work.id;
  }
</script>

<svelte:head>
  <title>Project Eva | Contemporary Artist Portfolio</title>

  <meta
    name="description"
    content="Project Eva is a minimalist contemporary artist portfolio featuring selected works, exhibitions, and visual projects."
  />

  <meta name="robots" content="index, follow" />

  <meta
    property="og:title"
    content="Project Eva | Contemporary Artist Portfolio"
  />

  <meta
    property="og:description"
    content="Explore selected works and exhibitions from Project Eva."
  />

  <meta property="og:type" content="website" />

  {#if selectedWork?.featuredImage}
    <meta property="og:image" content={selectedWork.featuredImage} />
  {/if}
</svelte:head>

<main class="home-page">
  <section class="homepage-intro" aria-label="Homepage introduction">
    <p>Selected Works</p>
    <h1>Project Eva</h1>
  </section>

  {#if data.works && data.works.length > 0}
    <section class="works-feature" aria-label="Selected works">
      <aside class="works-list-column" aria-label="Works list">
        <div class="works-heading">
          <h2 class="works-label">SELECTED WORKS</h2>
        </div>

        <div class="works-scroll-area">
          <p class="mobile-helper">Tap title to preview, View to open</p>

          {#each sortedWorksByYear as [year, works]}
            <section
              class="works-year-group"
              aria-labelledby={`works-year-${year}`}
            >
              <h3 class="works-year" id={`works-year-${year}`}>{year}</h3>

              <div class="works-links">
                {#each works as work}
                  <div class="work-item">
                    <a
                      href={work.frontendLink}
                      class="desktop-work-link"
                      class:active={selectedWork?.id === work.id}
                      onmouseenter={() => selectWork(work)}
                      onfocus={() => selectWork(work)}
                      aria-label={`Open ${work.title}`}
                    >
                      {#if work.featuredImage}
                        <img
                          src={work.featuredImage}
                          alt=""
                          class="desktop-thumbnail"
                          loading="lazy"
                        />
                      {/if}

                      <h4>{work.title}</h4>
                    </a>

                    <div class="touch-work-row">
                      <button
                        type="button"
                        class="touch-preview-button"
                        class:active={selectedWork?.id === work.id}
                        onclick={() => selectWork(work)}
                        aria-label={`Preview ${work.title}`}
                      >
                        {#if work.featuredImage}
                          <img
                            src={work.featuredImage}
                            alt=""
                            class="work-thumbnail"
                            loading="lazy"
                          />
                        {/if}

                        <h4>{work.title}</h4>
                      </button>

                      <a
                        href={work.frontendLink}
                        class="touch-view-link"
                        aria-label={`Open ${work.title}`}
                      >
                        View
                      </a>
                    </div>
                  </div>
                {/each}
              </div>
            </section>
          {/each}
        </div>
      </aside>

      <div class="works-image-column">
        <div class="image-frame">
          {#if selectedWork?.featuredImage}
            {#key selectedWork.id}
              <img
                src={selectedWork.featuredImage}
                alt={selectedWork.title}
                class="featured-image"
              />
            {/key}
          {/if}
        </div>
      </div>
    </section>
  {:else}
    <p class="empty-message">No works found.</p>
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

  .home-page {
    width: 100%;
    min-height: 100vh;
    padding: 116px 40px 92px;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .homepage-intro {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .homepage-intro p,
  .homepage-intro h1 {
    margin: 0;
  }

  .works-feature {
    width: 100%;
    display: grid;
    grid-template-columns: 320px minmax(0, 1fr);
    gap: clamp(38px, 5vw, 88px);
    align-items: center;
  }

  .works-list-column {
    width: 100%;
    max-width: 320px;
    height: min(76vh, 820px);
    justify-self: start;
    display: flex;
    flex-direction: column;
  }

  .works-heading {
    margin-bottom: 42px;
  }

  .works-label {
    margin: 0;
    color: #3f3c39;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.15;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .works-scroll-area {
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .works-scroll-area::-webkit-scrollbar {
    display: none;
  }

  .mobile-helper {
    display: none;
  }

  .works-year-group {
    padding: 0;
    margin-bottom: 32px;
    border-bottom: 0;
  }

  .works-year-group:last-child {
    margin-bottom: 0;
  }

  .works-year {
    margin: 0 0 15px;
    color: #aaa39d;
    font-size: 10px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .works-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .work-item {
    width: 100%;
  }

  .desktop-work-link {
    width: fit-content;
    max-width: 100%;
    display: inline-flex;
    color: #77716d;
    text-decoration: none;
    transition:
      color 0.35s ease,
      opacity 0.35s ease;
  }

  .desktop-work-link {
    width: fit-content;
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #77716d;
    text-decoration: none;
    transition:
      color 0.35s ease,
      opacity 0.35s ease;
  }

  .desktop-thumbnail {
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    display: block;
    object-fit: cover;
    object-position: center;
    opacity: 0.7;
    filter: none;
    transition:
      opacity 0.35s ease,
      transform 0.35s ease;
  }

  .desktop-work-link:hover .desktop-thumbnail,
  .desktop-work-link:focus .desktop-thumbnail,
  .desktop-work-link.active .desktop-thumbnail {
    opacity: 1;
    transform: scale(1.06);
  }

  .desktop-work-link h4,
  .touch-preview-button h4 {
    display: inline-block;
    position: relative;
    margin: 0;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .desktop-work-link h4::after,
  .touch-preview-button h4::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 0;
    height: 1px;
    background: currentColor;
    transition: width 0.5s ease;
  }

  .desktop-work-link:hover,
  .desktop-work-link:focus,
  .desktop-work-link.active {
    color: #1f1f1f;
  }

  .desktop-work-link:hover h4::after,
  .desktop-work-link:focus h4::after,
  .desktop-work-link.active h4::after {
    width: 100%;
  }

  .touch-work-row {
    display: none;
  }

  .works-image-column {
    width: 100%;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image-frame {
    width: 100%;
    height: min(76vh, 820px);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f6f4;
  }

  .featured-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    animation: imageReveal 0.85s ease both;
  }

  .empty-message {
    margin: 0;
    color: #6f6b68;
    font-size: 14px;
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
    .home-page {
      padding: 120px 40px 92px;
    }

    .works-feature {
      grid-template-columns: 300px minmax(0, 1fr);
      gap: 34px;
    }

    .works-list-column {
      max-width: 300px;
      height: min(68vh, 720px);
    }

    .image-frame {
      height: min(68vh, 720px);
    }

    .desktop-work-link {
      display: none;
    }

    .touch-work-row {
      display: grid;
      grid-template-columns: 46px minmax(0, 1fr);
      grid-template-rows: auto auto;
      column-gap: 14px;
      row-gap: 4px;
      align-items: start;
    }

    .touch-preview-button {
      display: contents;
      padding: 0;
      border: 0;
      background: transparent;
      color: #77716d;
      font-family: inherit;
      text-align: left;
      cursor: pointer;
    }

    .work-thumbnail {
      grid-column: 1;
      grid-row: 1 / 3;
      width: 46px;
      height: 46px;
      display: block;
      object-fit: cover;
      object-position: center;
      opacity: 0.7;
      filter: none;
      transition:
        opacity 0.35s ease,
        transform 0.35s ease;
    }

    .touch-preview-button h4 {
      grid-column: 2;
      grid-row: 1;
      margin: 0;
      padding: 0;
      color: #77716d;
      cursor: pointer;
      transition: color 0.35s ease;
    }

    .touch-preview-button:hover h4,
    .touch-preview-button:focus h4,
    .touch-preview-button.active h4 {
      color: #1f1f1f;
    }

    .touch-preview-button:hover .work-thumbnail,
    .touch-preview-button:focus .work-thumbnail,
    .touch-preview-button.active .work-thumbnail {
      opacity: 1;
      transform: scale(1.04);
    }

    .touch-preview-button:hover h4::after,
    .touch-preview-button:focus h4::after,
    .touch-preview-button.active h4::after {
      width: 100%;
    }

    .touch-view-link {
      grid-column: 2;
      grid-row: 2;
      width: fit-content;
      margin: 0;
      color: #aaa39d;
      font-size: 9px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.12em;
      text-decoration: none;
      text-transform: uppercase;
      white-space: nowrap;
      transition: color 0.3s ease;
    }

    .touch-view-link::after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      margin-top: 3px;
      background: currentColor;
      opacity: 0.45;
    }

    .touch-view-link:hover,
    .touch-view-link:focus {
      color: #1f1f1f;
    }
  }

  @media (max-width: 700px) {
    :global(body) {
      overflow: hidden;
    }

    .home-page {
      height: 100dvh;
      min-height: 100dvh;
      padding: 118px 24px 0;
      align-items: stretch;
      overflow: hidden;
    }

    .works-feature {
      width: 100%;
      height: calc(100dvh - 118px);
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 42dvh minmax(0, 1fr);
      gap: 22px;
      align-items: stretch;
      overflow: hidden;
    }

    .works-image-column {
      order: 1;
      display: flex;
      min-height: 0;
      align-items: stretch;
    }

    .image-frame {
      width: 100%;
      height: 100%;
      max-height: none;
    }

    .featured-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .works-list-column {
      order: 2;
      max-width: none;
      height: auto;
      min-height: 0;
      overflow: hidden;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .works-heading {
      flex-shrink: 0;
      margin-bottom: 18px;
    }

    .works-label {
      font-size: 18px;
    }

    .works-scroll-area {
      min-height: 0;
      overflow-y: auto;
      padding-right: 0;
      padding-bottom: 60px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
    }

    .works-scroll-area::-webkit-scrollbar {
      display: none;
    }

    .mobile-helper {
      display: block;
      margin: 0 0 24px;
      color: #aaa39d;
      font-size: 10px;
      line-height: 1;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .works-year-group {
      margin-bottom: 34px;
    }

    .works-year-group:last-child {
      margin-bottom: 30px;
    }

    .works-year {
      margin-bottom: 14px;
      font-size: 10px;
    }

    .works-links {
      gap: 18px;
    }

    .touch-work-row {
      grid-template-columns: 52px minmax(0, 1fr);
      grid-template-rows: auto auto;
      column-gap: 14px;
      row-gap: 4px;
      align-items: start;
    }

    .work-thumbnail {
      grid-column: 1;
      grid-row: 1 / 3;
      width: 52px;
      height: 52px;
      opacity: 0.7;
      filter: none;
    }

    .touch-preview-button.active .work-thumbnail {
      opacity: 1;
      transform: scale(1.04);
    }

    .touch-preview-button h4 {
      grid-column: 2;
      grid-row: 1;
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 1.35;
    }

    .touch-preview-button h4::after {
      display: none;
    }

    .touch-view-link {
      grid-column: 2;
      grid-row: 2;
      margin: 0;
    }
  }
</style>
