<script>
  import { onMount, onDestroy } from "svelte";

  let { data } = $props();

  let aboutTextBlockElement = $state(null);

  let aboutVideo = $state(null);
  let showVideoThumbnail = $state(true);
  let videoStartTimer;

  const aboutVideoSrc =
    "https://testing.zorawebdesign.com/wp-content/uploads/2026/06/Video-Project-eva.mp4";

  const aboutVideoThumbnail =
    "https://testing.zorawebdesign.com/wp-content/uploads/2026/06/atelierportrait.webp";

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

  let aboutSections = $derived.by(() => [
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
  ]);

  let activeSectionId = $state("");

  $effect(() => {
    if (!activeSectionId && aboutSections.length > 0) {
      activeSectionId = aboutSections[0].id;
    }
  });

  let activeSection = $derived.by(
    () =>
      aboutSections.find((section) => section.id === activeSectionId) ||
      aboutSections[0],
  );

  onMount(() => {
    videoStartTimer = setTimeout(() => {
      playAboutVideoOnce();
    }, 3500);
  });

  onDestroy(() => {
    clearTimeout(videoStartTimer);
  });

  async function playAboutVideoOnce() {
    if (!aboutVideo) return;

    showVideoThumbnail = false;
    aboutVideo.currentTime = 0;

    try {
      await aboutVideo.play();
    } catch (error) {
      showVideoThumbnail = true;
    }
  }

  function handleAboutVideoEnded() {
    if (!aboutVideo) return;

    aboutVideo.pause();
    aboutVideo.currentTime = 0;
    showVideoThumbnail = true;
  }

  function selectSection(sectionId) {
    activeSectionId = sectionId;

    if (aboutTextBlockElement) {
      aboutTextBlockElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
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

      <div class="about-text-block" bind:this={aboutTextBlockElement}>
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
        {#if showVideoThumbnail}
          <img
            class="about-video-thumbnail"
            src={aboutVideoThumbnail}
            alt="Eva Eichinger video preview"
          />
        {/if}

        <video
          bind:this={aboutVideo}
          muted
          playsinline
          preload="auto"
          poster={aboutVideoThumbnail}
          onended={handleAboutVideoEnded}
        >
          <source src={aboutVideoSrc} type="video/mp4" />
        </video>
      </div>
    </section>
  </section>
</main>

<style>
  :global(:root) {
    --site-font-family: Arial, Helvetica, sans-serif;
  }

  :global(html),
  :global(body),
  .about-page {
    font-family: var(--site-font-family);
  }

  :global(body) {
    margin: 0;
    background: #ffffff;
    color: #000000;
    overflow-x: hidden;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .about-page {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    padding: 96px 72px 90px 28px;
    overflow: hidden;
    background: #ffffff;
    text-transform: uppercase;
  }

  .about-page p {
    text-transform: none;
  }

  .about-layout {
    width: 100%;
    height: calc(100vh - 186px);
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(310px, 36vw) minmax(0, 1fr);
    gap: clamp(20px, 2.2vw, 42px);
    align-items: stretch;
    overflow: hidden;
  }

  .about-left {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: clamp(52px, 7vh, 86px);
    padding-right: 0;
    overflow: hidden;
  }

  .about-links {
    width: 100%;
    max-width: 310px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    padding: 0;
    margin: 0;
  }

  .about-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: auto;
    max-width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #b8b8b8;
    font-size: clamp(12px, 0.78vw, 13px);
    font-weight: 900;
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

  .about-link.active .about-link-label span,
  .about-link:hover .about-link-label span,
  .about-link:focus .about-link-label span {
    animation: aboutTextLift 0.42s ease both;
  }

  .about-link-number {
    display: inline-block;
    flex: 0 0 auto;
    min-width: 0;
    margin-right: 0;
    color: inherit;
    font-size: 0.82em;
    font-weight: 700;
    line-height: 1;
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
    min-width: 0;
    min-height: 0;
    justify-self: stretch;
    align-self: end;
    overflow-y: auto;
    padding: 0 12px 4px 0;
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
    margin: 0 0 clamp(22px, 3.5vh, 42px);
    color: #000000;
    font-size: clamp(13px, 0.9vw, 16px);
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
    min-width: 0;
  }

  .about-section-text p {
    width: 100%;
    max-width: 100%;
    margin: 0 0 13px;
    color: #242424;
    font-size: clamp(11px, 0.68vw, 13px);
    font-weight: 500;
    line-height: 1.42;
    letter-spacing: 0.008em;
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
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
  }

  .about-video-frame {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background: #ffffff;
  }

  .about-video-frame video,
  .about-video-thumbnail {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  .about-video-frame video {
    background: #ffffff;
  }

  .about-video-thumbnail {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  @media (min-width: 1025px) and (max-width: 1280px) {
    .about-page {
      padding: 96px 72px 90px 28px;
    }

    .about-layout {
      height: calc(100vh - 186px);
      grid-template-columns: minmax(290px, 38vw) minmax(0, 1fr);
      gap: clamp(18px, 2vw, 34px);
    }

    .about-left {
      gap: clamp(40px, 6vh, 70px);
    }

    .about-links {
      max-width: 300px;
    }

    .about-text-block,
    .about-text-block h1,
    .about-section-text,
    .about-section-text p {
      width: 100%;
      max-width: 100%;
    }

    .about-text-block h1 {
      font-size: clamp(13px, 0.95vw, 15px);
    }
  }

  @media (min-width: 1440px) {
    .about-page {
      padding: 96px 72px 90px 28px;
    }

    .about-layout {
      height: calc(100vh - 186px);
      grid-template-columns: minmax(360px, 34vw) minmax(0, 1fr);
      gap: clamp(26px, 2.4vw, 50px);
    }

    .about-text-block,
    .about-text-block h1,
    .about-section-text,
    .about-section-text p {
      width: 100%;
      max-width: 100%;
    }
  }

  @media (min-width: 1680px) {
    .about-page {
      padding: 96px 76px 90px 28px;
    }

    .about-layout {
      height: calc(100vh - 186px);
      grid-template-columns: 540px minmax(0, 1fr);
      gap: 52px;
    }

    .about-links {
      max-width: 340px;
    }

    .about-text-block,
    .about-text-block h1,
    .about-section-text,
    .about-section-text p {
      width: 100%;
      max-width: 100%;
    }
  }

  @media (max-width: 1024px) {
    .about-page {
      width: 100%;
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 68px 24px 0;
    }

    .about-layout {
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
      overflow: hidden;
    }

    .about-right {
      order: 1;
      width: 100%;
      height: 43vh;
      height: 43dvh;
      min-height: 0;
      flex: 0 0 43vh;
      flex-basis: 43dvh;
      display: block;
      overflow: hidden;
      margin: 0 0 16px;
    }

    .about-video-frame {
      width: 100%;
      height: 100%;
      min-height: 0;
      margin: 0;
      background: #ffffff;
      overflow: hidden;
    }

    .about-video-frame video {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
      background: #ffffff;
    }

    .about-left {
      order: 2;
      width: 100%;
      min-height: 0;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: 0;
      padding-right: 0;
      margin: 0;
      overflow: hidden;
    }

    .about-links {
      width: 100%;
      max-height: 22vh;
      max-height: 22dvh;
      flex: 0 0 auto;
      overflow-y: auto;
      overflow-x: hidden;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 12px;
      row-gap: 7px;
      align-items: start;
      justify-items: stretch;
      margin: 0 0 18px;
      padding: 0;
      text-align: left;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .about-links::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .about-link {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      min-height: 0;
      margin: 0;
      padding: 0;
      color: #b8b8b8;
      font-size: 12px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: 0.01em;
      text-align: left;
      white-space: nowrap;
      word-break: normal;
      overflow-wrap: normal;
      transform: none;
    }

    .about-link-number {
      display: inline-block;
      flex: 0 0 auto;
      min-width: 0;
      margin-right: 0;
      font-size: 0.82em;
      font-weight: 700;
      line-height: 1;
      opacity: 0.62;
      transform: translateY(-0.5px);
    }

    .about-link-label {
      max-width: calc(100% - 24px);
      overflow: hidden;
      text-align: left;
    }

    .about-link-label span {
      display: inline-block;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .about-link.active,
    .about-link:hover,
    .about-link:focus {
      color: #000000;
      transform: none;
      letter-spacing: 0.01em;
    }

    .about-text-block {
      width: 100%;
      max-width: 100%;
      min-height: 0;
      flex: 1 1 auto;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0 0 calc(90px + env(safe-area-inset-bottom));
      margin: 0;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    .about-text-block::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .about-text-block h1 {
      width: 100%;
      max-width: 100%;
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.005em;
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
      letter-spacing: 0.006em;
    }

    :global(.about-section-text a) {
      text-underline-offset: 2px;
    }
  }

  @media (max-width: 700px) {
    .about-page {
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 62px 16px 0;
    }

    .about-right {
      height: 42vh;
      height: 42dvh;
      flex: 0 0 42vh;
      flex-basis: 42dvh;
      margin-bottom: 14px;
    }

    .about-links {
      max-height: 23vh;
      max-height: 23dvh;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 10px;
      row-gap: 6px;
      margin-bottom: 16px;
    }

    .about-link {
      font-size: 12px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: 0.01em;
    }

    .about-link-number {
      font-size: 0.82em;
    }

    .about-text-block {
      padding-bottom: calc(90px + env(safe-area-inset-bottom));
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
    .about-page {
      padding-top: 58px;
    }

    .about-right {
      height: 40vh;
      height: 40dvh;
      flex: 0 0 40vh;
      flex-basis: 40dvh;
      margin-bottom: 13px;
    }

    .about-links {
      max-height: 24vh;
      max-height: 24dvh;
      column-gap: 9px;
      row-gap: 5px;
      margin-bottom: 14px;
    }

    .about-link {
      font-size: 11px;
      line-height: 1.08;
    }

    .about-text-block h1 {
      font-size: 14px;
    }
  }
</style>
