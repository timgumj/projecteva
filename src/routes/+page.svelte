<script>
  import { tick } from "svelte";

  let { data } = $props();

  let selectedWorkId = $state(null);
  let currentSlideIndex = $state(0);
  let mobileThumbnailStrip = $state(null);

  let worksByGroup = $derived(
    data.works?.reduce((groups, work) => {
      const group = work.group || "Works";

      if (!groups[group]) {
        groups[group] = [];
      }

      if (groups[group].length < 4) {
        groups[group].push(work);
      }

      return groups;
    }, {}) || {},
  );

  let sortedWorksByGroup = $derived(
    Object.entries(worksByGroup).sort(([groupA], [groupB]) => {
      if (groupA === "Exhibitions") return 1;
      if (groupB === "Exhibitions") return -1;

      const numberA = Number(groupA);
      const numberB = Number(groupB);

      if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
        return numberB - numberA;
      }

      return groupA.localeCompare(groupB);
    }),
  );

  let displayWorksByGroup = $derived(() => {
    const paintings = [];
    const exhibitions = [];

    sortedWorksByGroup.forEach(([group, works]) => {
      if (group === "Exhibitions") {
        exhibitions.push(...works);
      } else {
        paintings.push(...works);
      }
    });

    const groups = [];

    if (paintings.length > 0) {
      groups.push(["PAINTINGS", paintings]);
    }

    if (exhibitions.length > 0) {
      groups.push(["Exhibitions", exhibitions]);
    }

    return groups;
  });

  let mobileWorks = $derived(
    displayWorksByGroup().flatMap(([group, works]) =>
      works.map((work) => ({
        ...work,
        displayGroup: group,
      })),
    ),
  );

  let selectedWork = $derived(
    data.works?.find((work) => work.id === selectedWorkId) ||
      displayWorksByGroup()?.[0]?.[1]?.[0],
  );

  let currentMobileWork = $derived(
    mobileWorks[currentSlideIndex] || selectedWork || mobileWorks[0],
  );

  async function scrollActiveMobileThumb() {
    await tick();

    if (!mobileThumbnailStrip) return;

    const activeThumb = mobileThumbnailStrip.querySelector(
      ".mobile-thumb.active",
    );

    if (!activeThumb) return;

    activeThumb.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function selectWork(work) {
    selectedWorkId = work.id;

    const index = mobileWorks.findIndex((item) => item.id === work.id);

    if (index >= 0) {
      currentSlideIndex = index;
      scrollActiveMobileThumb();
    }
  }

  function selectMobileWork(index) {
    currentSlideIndex = index;
    selectedWorkId = mobileWorks[index]?.id || null;
    scrollActiveMobileThumb();
  }

  function previousSlide() {
    if (!mobileWorks.length) return;

    currentSlideIndex =
      currentSlideIndex === 0 ? mobileWorks.length - 1 : currentSlideIndex - 1;

    selectedWorkId = mobileWorks[currentSlideIndex]?.id || null;
    scrollActiveMobileThumb();
  }

  function nextSlide() {
    if (!mobileWorks.length) return;

    currentSlideIndex =
      currentSlideIndex === mobileWorks.length - 1 ? 0 : currentSlideIndex + 1;

    selectedWorkId = mobileWorks[currentSlideIndex]?.id || null;
    scrollActiveMobileThumb();
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
          {#each displayWorksByGroup() as [groupTitle, works]}
            <section
              class="works-year-group"
              aria-labelledby={`works-group-${groupTitle}`}
            >
              <h3 class="works-year" id={`works-group-${groupTitle}`}>
                {groupTitle}
              </h3>

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

      <section class="mobile-slider" aria-label="Mobile works slider">
        <div class="mobile-top-controls">
          <button
            type="button"
            onclick={previousSlide}
            aria-label="Previous work"
          >
            ←
          </button>

          <button type="button" onclick={nextSlide} aria-label="Next work">
            →
          </button>
        </div>

        {#if currentMobileWork}
          <h2 class="mobile-current-title">{currentMobileWork.title}</h2>
        {/if}

        <div class="mobile-image-frame">
          {#if currentMobileWork}
            <a
              href={currentMobileWork.frontendLink}
              class="mobile-image-link"
              aria-label={`Open ${currentMobileWork.title}`}
            >
              {#if currentMobileWork.featuredImage}
                {#key currentMobileWork.id}
                  <img
                    src={currentMobileWork.featuredImage}
                    alt={currentMobileWork.title}
                    class="mobile-main-image"
                  />
                {/key}
              {/if}
            </a>
          {/if}
        </div>

        <div
          class="mobile-thumbnail-strip"
          bind:this={mobileThumbnailStrip}
          aria-label="Slider thumbnails"
        >
          {#each mobileWorks as work, index}
            <button
              type="button"
              class="mobile-thumb"
              class:active={index === currentSlideIndex}
              onclick={() => selectMobileWork(index)}
              aria-label={`Preview ${work.title}`}
            >
              {#if work.featuredImage}
                <img src={work.featuredImage} alt="" loading="lazy" />
              {/if}
            </button>
          {/each}
        </div>
      </section>
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
    padding: 116px clamp(28px, 5vw, 72px) 92px;
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
    max-width: 1500px;
    display: grid;
    grid-template-columns: 20% minmax(0, 80%);
    gap: clamp(14px, 2vw, 32px);
    align-items: center;
    background: #ffffff;
  }

  .works-list-column {
    width: 100%;
    height: min(76vh, 820px);
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  .works-heading {
    margin-bottom: 34px;
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
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .works-scroll-area::-webkit-scrollbar {
    display: none;
  }

  .works-year-group {
    padding: 0;
    margin-bottom: 30px;
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
    align-items: center;
    gap: 12px;
    color: #77716d;
    text-decoration: none;
    transition:
      color 0.35s ease,
      opacity 0.35s ease;
  }

  .desktop-thumbnail {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    display: block;
    object-fit: cover;
    object-position: center;
    opacity: 0.7;
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

  .desktop-work-link h4 {
    display: inline-block;
    position: relative;
    margin: 0;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .desktop-work-link h4::after {
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

  .works-image-column {
    width: 100%;
    min-width: 0;
    height: min(76vh, 820px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
  }

  .image-frame {
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
  }

  .featured-image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    object-position: center;
    animation: imageReveal 0.85s ease both;
  }

  .mobile-slider {
    display: none;
  }

  .empty-message {
    margin: 0;
    color: #6f6b68;
    font-size: 14px;
  }

  @keyframes imageReveal {
    from {
      opacity: 0;
      transform: scale(1.01);
      filter: blur(3px);
    }

    to {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }

  @media (max-width: 700px) {
    :global(body) {
      overflow-x: hidden;
      overflow-y: auto;
      background: #ffffff;
    }

    .home-page {
      width: 100%;
      min-height: auto;
      padding: 118px 22px 0;
      display: block;
      overflow: visible;
      background: #ffffff;
    }

    .works-feature {
      width: 100%;
      max-width: none;
      display: block;
      overflow: visible;
      background: #ffffff;
    }

    .works-list-column,
    .works-image-column {
      display: none;
    }

    .mobile-slider {
      --mobile-space: 10px;
      --thumb-gap: 4px;
      --thumb-size: calc((100vw - 14px - (7 * var(--thumb-gap))) / 8);

      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--mobile-space);
      overflow: visible;
      background: #ffffff;
    }

    .mobile-top-controls {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 18px;
      background: #ffffff;
    }

    .mobile-top-controls button {
      width: auto;
      height: auto;
      padding: 0;
      border: 0;
      background: transparent;
      color: #2f2d2b;
      font-family: inherit;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      appearance: none;
    }

    .mobile-current-title {
      display: block;
      margin: 0;
      color: #2f2d2b;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.2;
      letter-spacing: 0.08em;
      text-align: left;
      text-transform: uppercase;
      background: #ffffff;
    }

    .mobile-image-frame {
      width: 100%;
      height: clamp(300px, 48vh, 370px);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
    }

    .mobile-image-link {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      text-decoration: none;
      background: #ffffff;
    }

    .mobile-main-image {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
      animation: imageReveal 0.7s ease both;
      background: #ffffff;
    }

    .mobile-thumbnail-strip {
      width: 100%;
      height: var(--thumb-size);
      display: flex;
      gap: var(--thumb-gap);
      overflow-x: auto;
      overflow-y: hidden;
      padding: 0;
      background: #ffffff;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x proximity;
      scroll-behavior: smooth;
      touch-action: pan-x;
    }

    .mobile-thumbnail-strip::-webkit-scrollbar {
      display: none;
    }

    .mobile-thumb {
      width: var(--thumb-size);
      height: var(--thumb-size);
      flex: 0 0 var(--thumb-size);
      aspect-ratio: 1 / 1;
      padding: 0;
      border: 0;
      background: #ffffff;
      opacity: 0.45;
      cursor: pointer;
      scroll-snap-align: center;
      transition: opacity 0.3s ease;
    }

    .mobile-thumb img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
      background: #ffffff;
    }

    .mobile-thumb.active {
      opacity: 1;
    }
  }

  @media (max-width: 420px) {
    .home-page {
      padding: 118px 22px 0;
    }

    .mobile-slider {
      --mobile-space: 10px;
      --thumb-gap: 4px;
      --thumb-size: calc((100vw - 14px - (7 * var(--thumb-gap))) / 8);
    }

    .mobile-image-frame {
      height: clamp(280px, 46vh, 350px);
    }

    .mobile-current-title {
      font-size: 13px;
    }
  }
</style>
