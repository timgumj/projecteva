<script>
  let { data } = $props();

  const dummySections = [
    {
      id: "studio",
      title: "Studio",
      text: [
        "Studio text will be added here later. This is placeholder content for now.",
      ],
    },
    {
      id: "press",
      title: "Artist in Residence",
      text: [
        "/// 2021-2028: Atelierstipendium Westbahnstraße des BMOEKS",
        "/// 2022: Atelierstipendium des Landes OÖ in Český Krumlov, Tschechien",
        "/// 2020: Atelierstipendium des Landes OÖ in Český Krumlov, Tschechien",
        "/// 2019: Ankauf durch „DieKunstsammlung des Landes OÖ“",
        "/// 2019: Atelieraufenthalt in Kopenhagen, Dänemark",
        "/// 2014: Aquarellhappening in Tux, Tirol",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      text: [
        "Contact details will be added here later. This is placeholder content for now.",
      ],
    },
  ];

  const aboutSections = [
    ...(data.sections || []).map((section, index) => ({
      id: `section-${index}`,
      title: section.title,
      text: section.text,
      image: data.featuredImage || "",
    })),
    ...dummySections.map((section) => ({
      ...section,
      image: data.featuredImage || "",
    })),
  ];

  let activeSectionId = $state(aboutSections[0]?.id || "");

  let activeSection = $derived(
    aboutSections.find((section) => section.id === activeSectionId) ||
      aboutSections[0],
  );

  function selectSection(sectionId) {
    activeSectionId = sectionId;
  }
</script>

<svelte:head>
  <title>{data.pageTitle || "About"} | Eva Eichinger</title>
</svelte:head>

<main class="about-page">
  <section class="about-layout" aria-label="About Eva Eichinger">
    <aside class="about-left">
      <div class="about-links">
        {#each aboutSections as section, index}
          <button
            type="button"
            class="about-link"
            class:active={activeSectionId === section.id}
            onclick={() => selectSection(section.id)}
          >
            <span class="about-link-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span class="about-link-label">
              <span>{@html section.title}</span>
            </span>
          </button>
        {/each}
      </div>

      <div class="about-text-block">
        {#if activeSection}
          <h1>{@html activeSection.title}</h1>

          <div class="about-section-text">
            {#each activeSection.text as paragraph}
              <p>{@html paragraph}</p>
            {/each}
          </div>
        {/if}
      </div>
    </aside>

    <section class="about-right" aria-label="About video">
      <div class="about-video-frame">
        <video autoplay muted loop playsinline preload="auto">
          <source
            src="https://testing.zorawebdesign.com/wp-content/uploads/2026/06/Video-Project-eva.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </section>
  </section>
</main>

<style>
  :global(html),
  :global(body),
  .about-page {
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(body) {
    margin: 0;
    overflow: hidden;
    background: #ffffff;
    color: #000000;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .about-page {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    padding: 96px 56px 38px 28px;
    overflow: hidden;
    background: #ffffff;
    text-transform: uppercase;
  }

  .about-page p {
    text-transform: none;
  }

  .about-layout {
    width: 100%;
    height: calc(100vh - 150px);
    min-height: 0;
    display: grid;
    grid-template-columns: 35% minmax(0, 65%);
    gap: 8px;
    align-items: stretch;
    overflow: hidden;
  }

  .about-left {
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 34px;
    padding-right: 4px;
    overflow: hidden;
  }

  .about-links {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    padding: 0;
  }

  .about-link {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    width: fit-content;
    max-width: 100%;
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
    text-transform: uppercase;
    cursor: pointer;
    transition:
      color 0.28s ease,
      opacity 0.28s ease;
  }

  .about-link.active,
  .about-link:hover,
  .about-link:focus {
    color: #000000;
  }

  .about-link.active .about-link-label span {
    animation: aboutTextLift 0.42s ease both;
  }

  .about-link-number {
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

  .about-link-label {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }

  .about-link-label span {
    display: inline-block;
  }

  @keyframes aboutTextLift {
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

  .about-text-block {
    width: 100%;
    max-width: 100%;
    min-height: 0;
    overflow-y: auto;
    padding-top: 0;
    padding-right: 18px;
    padding-bottom: 24px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .about-text-block::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .about-text-block h1 {
    width: 100%;
    max-width: 100%;
    margin: 0 0 38px;
    color: #000000;
    font-size: clamp(12px, 0.78vw, 14px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
    text-transform: uppercase;
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

  .about-section-text {
    width: 100%;
    max-width: 100%;
  }

  .about-section-text p {
    width: 100%;
    margin: 0 0 12px;
    color: #262626;
    font-size: clamp(11px, 0.66vw, 12px);
    font-weight: 500;
    line-height: 1.34;
    letter-spacing: 0.006em;
    text-transform: uppercase;
  }

  :global(.about-section-text a) {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  .about-right {
    position: relative;
    height: 100%;
    min-height: 0;
    display: block;
    overflow: hidden;
  }

  .about-video-frame {
    width: 100%;
    height: calc(100% - 26px);
    min-height: 0;
    overflow: hidden;
    background: #ffffff;
  }

  .about-video-frame video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    object-position: center;
    background: #ffffff;
  }

  @media (max-width: 1280px) {
    .about-page {
      padding-right: 48px;
    }

    .about-layout {
      grid-template-columns: 35% minmax(0, 65%);
      gap: 8px;
    }

    .about-left {
      gap: 32px;
      padding-right: 4px;
    }

    .about-text-block h1 {
      font-size: clamp(13px, 0.95vw, 15px);
    }
  }

  @media (max-width: 1024px) {
    :global(html),
    :global(body) {
      height: auto;
      overflow-y: auto;
    }

    .about-page {
      height: auto;
      min-height: 100vh;
      padding: 118px 24px 110px;
      overflow: visible;
    }

    .about-layout {
      display: flex;
      flex-direction: column;
      height: auto;
      min-height: auto;
      gap: 0;
      overflow: visible;
    }

    .about-right {
      order: 1;
      width: 100%;
      height: auto;
      min-height: 0;
      display: block;
      overflow: visible;
      margin: 0 0 10px;
    }

    .about-video-frame {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      min-height: 0;
      margin: 0;
      background: #ffffff;
      overflow: hidden;
    }

    .about-video-frame video {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
      object-position: center;
      background: #ffffff;
    }

    .about-left {
      order: 2;
      width: 100%;
      height: auto;
      min-height: auto;
      display: block;
      padding-right: 0;
      margin: 0;
      overflow: visible;
    }

    .about-links {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 12px;
      row-gap: 7px;
      align-items: start;
      justify-items: stretch;
      margin: 0 0 24px;
      padding: 0;
      text-align: left;
    }

    .about-link {
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

    .about-link-number {
      min-width: 22px;
      font-size: 0.82em;
    }

    .about-link.active,
    .about-link:hover,
    .about-link:focus {
      color: #000000;
      transform: none;
      letter-spacing: 0;
    }

    .about-text-block {
      width: 100%;
      max-width: 100%;
      overflow: visible;
      padding: 0;
      margin: 0;
    }

    .about-text-block h1 {
      width: 100%;
      max-width: 100%;
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0;
      text-align: left;
    }

    .about-section-text {
      width: 100%;
      max-width: 100%;
    }

    .about-section-text p {
      width: 100%;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.34;
    }

    :global(.about-section-text a) {
      text-underline-offset: 2px;
    }
  }

  @media (max-width: 700px) {
    .about-page {
      padding: 108px 16px 120px;
    }

    .about-video-frame {
      height: auto;
      aspect-ratio: 16 / 9;
    }

    .about-links {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 10px;
      row-gap: 6px;
      margin-bottom: 24px;
    }

    .about-link {
      font-size: 12px;
      line-height: 1.08;
    }

    .about-link-number {
      min-width: 18px;
      font-size: 0.82em;
    }

    .about-text-block h1 {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 1;
      text-align: left;
    }

    .about-section-text p {
      font-size: 12px;
      font-weight: 500;
      line-height: 1.34;
    }
  }

  @media (max-width: 420px) {
    .about-video-frame {
      height: auto;
      aspect-ratio: 16 / 9;
    }

    .about-links {
      column-gap: 9px;
      row-gap: 5px;
    }

    .about-link {
      font-size: 11px;
      line-height: 1.08;
    }

    .about-link-number {
      min-width: 17px;
    }

    .about-text-block h1 {
      font-size: 14px;
    }
  }
</style>
