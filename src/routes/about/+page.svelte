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

      <div class="about-links">
        {#each aboutSections as section}
          <button
            type="button"
            class="about-link"
            class:active={activeSectionId === section.id}
            onmouseenter={() => selectSection(section.id)}
            onfocus={() => selectSection(section.id)}
            onclick={() => selectSection(section.id)}
          >
            {@html section.title}
          </button>
        {/each}
      </div>
    </aside>

    <section class="about-right" aria-label="About image and navigation">
      {#if activeSection?.image || data.featuredImage}
        <div class="about-image-frame">
          <img
            src={activeSection?.image || data.featuredImage}
            alt={data.pageTitle || "Eva Eichinger"}
          />
        </div>
      {/if}

      <nav class="about-bottom-nav" aria-label="Page navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/painting">Paintings</a>
        <a href="/exhibitions">Exhibitions</a>
        <a href="/archive">Archive</a>
        <a href="/contact">Contact</a>
      </nav>

      <div class="about-socials">
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>

        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
          Linkedin
        </a>
      </div>

      <a class="about-email" href="mailto:info@evaeichinger.com">
        info@evaeichinger.com
      </a>
    </section>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
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
    padding: 96px 96px 38px 28px;
    overflow: hidden;
    background: #ffffff;
  }

  .about-layout {
    width: 100%;
    height: calc(100vh - 150px);
    min-height: 0;
    display: grid;
    grid-template-columns: 36% minmax(0, 64%);
    gap: 18px;
    align-items: stretch;
    overflow: hidden;
  }

  .about-left {
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    padding-right: 10px;
    overflow: hidden;
  }

  .about-text-block {
    width: 100%;
    max-width: 430px;
    min-height: 0;
    overflow-y: auto;
    padding-top: 2px;
    padding-bottom: 24px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .about-text-block::-webkit-scrollbar {
    display: none;
  }

  .about-text-block h1 {
    margin: 0 0 8px;
    color: #000000;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .about-section-text {
    max-width: 420px;
  }

  .about-section-text p {
    margin: 0 0 14px;
    color: #000000;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.25;
  }

  :global(.about-section-text a) {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  .about-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding-bottom: 0;
  }

  .about-link {
    width: fit-content;
    max-width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.25s ease;
  }

  .about-link:hover,
  .about-link:focus,
  .about-link.active {
    opacity: 0.55;
  }

  .about-right {
    position: relative;
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 105px 210px;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 0 16px;
    align-items: end;
    overflow: hidden;
  }
  .about-image-frame {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    width: 100%;
    height: calc(100% - 26px);
    min-height: 0;
    align-self: start;
    overflow: hidden;
    background: #eeeeee;
  }

  .about-image-frame img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: left;
  }

  .about-bottom-nav {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0;
  }

  .about-bottom-nav a,
  .about-socials a,
  .about-email {
    width: fit-content;
    color: #000000;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 700;
    line-height: 0.9;
    text-decoration: none;
    text-transform: uppercase;
    transition: opacity 0.25s ease;
  }

  .about-bottom-nav a:hover,
  .about-socials a:hover,
  .about-email:hover {
    opacity: 0.55;
  }

  .about-socials {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    display: flex;
    flex-direction: column;
    gap: 0;
    justify-self: start;
  }

  .about-email {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
    align-self: end;
    justify-self: start;
    max-width: 210px;
    overflow-wrap: normal;
    white-space: nowrap;
    text-transform: none;

    transform: translateY(-10px);
  }

  @media (max-width: 1280px) {
    .about-page {
      padding-right: 82px;
    }

    .about-layout {
      grid-template-columns: 45% minmax(0, 55%);
      gap: 24px;
    }

    .about-right {
      grid-template-columns: minmax(0, 1fr) 96px 128px;
      gap: 0 14px;
    }

    .about-email {
      max-width: 128px;
    }
  }

  @media (max-width: 1024px) {
    :global(body) {
      overflow-y: auto;
    }

    .about-page {
      height: auto;
      min-height: 100vh;
      padding: 118px 24px 110px;
      overflow: visible;
    }

    .about-layout {
      display: block;
      height: auto;
      min-height: auto;
      overflow: visible;
    }

    .about-left {
      height: auto;
      min-height: auto;
      display: block;
      padding-right: 0;
      margin-bottom: 34px;
      overflow: visible;
    }

    .about-text-block {
      max-width: 620px;
      overflow: visible;
      padding-top: 0;
      padding-bottom: 0;
      margin-bottom: 32px;
    }

    .about-links {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 18px 28px;
      padding-bottom: 0;
    }

    .about-right {
      height: auto;
      min-height: auto;
      display: block;
      overflow: visible;
    }

    .about-image-frame {
      width: 100%;
      height: 62vh;
      min-height: 0;
      margin-bottom: 22px;
    }

    .about-bottom-nav,
    .about-socials {
      margin-bottom: 18px;
    }

    .about-email {
      max-width: none;
      overflow-wrap: normal;
    }

    .about-bottom-nav a,
    .about-socials a,
    .about-email {
      font-size: 14px;
    }
  }

  @media (max-width: 700px) {
    .about-page {
      padding: 108px 24px 120px;
    }

    .about-text-block h1,
    .about-section-text p,
    .about-link {
      font-size: 14px;
    }

    .about-image-frame {
      height: 52vh;
    }
  }
</style>
