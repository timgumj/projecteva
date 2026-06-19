<script>
  import { onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let { data } = $props();

  const soloExhibitions = [
    {
      year: "2020",
      items: ["Als ich über Bäume sprang, Edition, Linz"],
    },
    {
      year: "2019",
      items: ["TOP SHELF/BOTTOM DRAWER – SONNTAGSZIMMER, VIENNA"],
    },
    {
      year: "2016",
      items: [
        "IMPORTANCE OF DESTRUCTION IN AN ENVIRONMENT OF HARMONY – PARADIGMA, LINZ",
      ],
    },
    {
      year: "2012",
      items: [
        "ROCKET SCIENTISTS REMEMBER HOW IT FEELS TO FLY – KUNST IM BAD, LINZ",
      ],
    },
  ];

  const groupExhibitions = [
    {
      year: "2023",
      items: ["PARALLEL ART FAIR"],
    },
    {
      year: "2022",
      items: ["AUFWÄRTS FALLEN", "Oberösterreichischer Kunstverein"],
    },
    {
      year: "2021",
      items: [
        "Vier Mal Solo Ein Mal im Duo - Galerie Jonathan Seiffert, Wien",
        "WO IST DAS SCHÖNE LEBEN HIN? RCS Karlsplatz, Wien",
      ],
    },
    {
      year: "2020",
      items: [
        "In the Deep Lightness, Kluckyland Wien",
        "Kultur braucht Kunst – Schlossmuseum Linz, Linz",
        "PARALLEL ART FAIR (REPRESENTED BY KAH) – RUDOLF SALLINGER PL. 1, VIENNA",
      ],
    },
    {
      year: "2019",
      items: [
        "FROZEN FINGERS – KUNSTHALLE LINZ, LINZ",
        "PARALLEL ART FAIR (REPRESENTED BY KAH) – LASSALLESTRASSE 5, VIENN",
        "TEMPOTEMPO – BEARDED BIRD STUDIOS, VIENNA",
        "36. ÖSTERREICHISCHER GRAFIKWETTBEWERB, TAXISPALAIS KUNSTHALLE TIROL, INNSBRUCK",
      ],
    },
    {
      year: "2018",
      items: [
        "KISM | ART | ON – Kunstverein Eisenstadt, Eisenstadt",
        "schade, aber schön – kaeshmaesh, Vienna",
        "Open Call Exhibition – Delphian Gallery, London UK",
      ],
    },
    {
      year: "2017",
      items: [
        "Ex Change – Henrici Schloßquartier, Eisenstadt",
        "Negotiations – Reindorfgasse 42, Vienna",
      ],
    },
    {
      year: "2016",
      items: [
        "All in – curated by Andreas Reiter Raabe – Deutschvilla, Strobl",
        "Freunde des Lentos Kunstpreis – LENTOS Auditorium, Linz",
      ],
    },
    {
      year: "2014",
      items: [
        "malerei forever – Perspektiven Attersee, Attersee",
        "bestOff 2014 – Brückenkopfgebäude West, Linz",
        "aquarellhappening – Mehlerhaus, Tux",
      ],
    },
    {
      year: "2013",
      items: [
        "between domestic and wild – Galerie West Linz",
        "Kunst im öffentlichen Raum – Galerie der Stadt Wels",
      ],
    },
    {
      year: "2012",
      items: [
        "best off 2012 – Tabakfabrik Linz",
        "4th IOC Sport and Art Contest – Guildhall Gallery London",
        "Painting with Light – Impossible Shop Vienna",
        "Reglose Steigerung des Ungreifbaren – PP6 Linz",
        "Under Pressure – KAPU Linz",
      ],
    },
    {
      year: "2011",
      items: [
        "best off 2011 – Tabakfabrik Linz",
        "ARTBASELMIAMIBEACHWELS #2 – Galerie der Stadt Wels",
      ],
    },
    {
      year: "2010",
      items: ["2010 EXHIBITION – Fluc Vienna"],
    },
  ];

  const residenceItems = [
    {
      year: "2021",
      items: [
        "studio of the Austrian federal chancellery, Visual Art Department, Studio: Westbahnstrasse",
      ],
    },
    {
      year: "2020",
      items: [
        "Artist in Residence in Cesky Krumlov, scholarship of Upper Austria",
      ],
    },
    {
      year: "2019",
      items: [
        "purchase through “dieKunstsammlung des Landes Oberösterreich”",
        "studio work stay in Copenhagen, Denmark",
      ],
    },
    {
      year: "2014",
      items: ["Aquarellhappening in Tux, Tyrol"],
    },
    {
      year: "2013",
      items: ["summer academy Traunkirchen – class of Leo Kandl, Photography"],
    },
  ];

  const sections = [
    {
      id: "solo",
      label: "Solo Exhibitions",
      heading: "Solo Exhibitions",
      entries: soloExhibitions,
    },
    {
      id: "group",
      label: "Group Exhibitions",
      heading: "Group Exhibitions",
      entries: groupExhibitions,
    },
    {
      id: "residence",
      label: "Residence & Scholarships",
      heading: "Artist in Residence & Scholarships",
      entries: residenceItems,
    },
    {
      id: "selected",
      label: "Selected Exhibitions",
      heading: "Selected Exhibitions",
      entries: [],
    },
  ];

  const initialExhibition =
    data.selectedExhibitions?.find(
      (exhibition) => exhibition.id === data.requestedPostId,
    ) || data.selectedExhibitions?.[0];

  let activeSectionId = $state(data.requestedPostId ? "selected" : "solo");
  let selectedYearSlug = $state(initialExhibition?.yearSlug || "");
  let selectedImageIndex = $state(null);

  let activeSection = $derived(
    sections.find((section) => section.id === activeSectionId) || sections[0],
  );

  let selectedExhibition = $derived(
    data.selectedExhibitions?.find(
      (exhibition) => exhibition.yearSlug === selectedYearSlug,
    ) || data.selectedExhibitions?.[0],
  );

  let selectedImages = $derived(selectedExhibition?.images || []);

  let selectedImage = $derived(
    selectedImageIndex !== null ? selectedImages[selectedImageIndex] : null,
  );

  function selectSection(sectionId) {
    activeSectionId = sectionId;
    selectedImageIndex = null;
  }

  function selectExhibition(exhibition) {
    selectedYearSlug = exhibition.yearSlug;
    selectedImageIndex = null;
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

  function handleKeydown(event) {
    if (selectedImageIndex === null) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPreviousImage();
    }

    if (event.key === "ArrowRight") {
      showNextImage();
    }
  }

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = "";
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>Exhibitions | Eva Eichinger</title>

  <meta
    name="description"
    content="Explore solo exhibitions, group exhibitions, residences, scholarships, and selected exhibition images by Eva Eichinger."
  />
</svelte:head>

<main class="exhibitions-page">
  <section class="exhibitions-feature" aria-label="Exhibitions">
    <aside class="exhibitions-list-column" aria-label="Exhibition categories">
      <div class="exhibitions-heading">
        <h1 class="exhibitions-label">Exhibitions</h1>
      </div>

      <div class="exhibitions-scroll-area">
        <div class="section-links">
          {#each sections as section}
            <button
              type="button"
              class="section-button"
              class:active={activeSectionId === section.id}
              onclick={() => selectSection(section.id)}
            >
              {section.label}
            </button>
          {/each}
        </div>

        {#if activeSectionId === "selected" && data.selectedExhibitions?.length}
          <div class="selected-year-links">
            {#each data.selectedExhibitions as exhibition}
              <button
                type="button"
                class="selected-year-button"
                class:active={selectedExhibition?.yearSlug ===
                  exhibition.yearSlug}
                onmouseenter={() => selectExhibition(exhibition)}
                onfocus={() => selectExhibition(exhibition)}
                onclick={() => selectExhibition(exhibition)}
              >
                {exhibition.title}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </aside>

    <div class="exhibitions-content-column">
      {#if activeSectionId !== "selected"}
        <div class="text-panel">
          <h2>{activeSection.heading}</h2>

          <div class="entries-list">
            {#each activeSection.entries as group}
              <section class="entry-group">
                <h3>{group.year}</h3>

                <div class="entry-items">
                  {#each group.items as item}
                    <p>/// {item}</p>
                  {/each}
                </div>
              </section>
            {/each}
          </div>
        </div>
      {:else}
        <div class="selected-panel">
          {#if selectedExhibition}
            <div class="selected-info">
              <span>{selectedExhibition.year}</span>

              {#if selectedExhibition.title}
                <h2>{selectedExhibition.title}</h2>
              {/if}

              {#if selectedExhibition.info}
                <p>{selectedExhibition.info}</p>
              {/if}
            </div>

            {#if selectedExhibition.images?.length}
              {#key selectedExhibition.yearSlug}
                <div class="selected-grid">
                  {#each selectedExhibition.images as image, index}
                    <button
                      type="button"
                      class="selected-card"
                      onclick={() => openLightbox(index)}
                      aria-label={`Open ${image.alt || selectedExhibition.year}`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || selectedExhibition.year}
                      />

                      {#if image.alt}
                        <span>{image.alt}</span>
                      {/if}
                    </button>
                  {/each}
                </div>
              {/key}
            {:else}
              <p class="empty-message">No images found for this exhibition.</p>
            {/if}
          {:else}
            <p class="empty-message">No selected exhibitions found.</p>
          {/if}
        </div>
      {/if}
    </div>
  </section>

  {#if selectedImage}
    <div class="exhibition-lightbox" role="dialog" aria-modal="true">
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
          alt={selectedImage.alt || selectedExhibition.year}
        />

        <div class="lightbox-meta">
          <span>
            {String(selectedImageIndex + 1).padStart(2, "0")} — {String(
              selectedImages.length,
            ).padStart(2, "0")}
          </span>

          {#if selectedImage.alt}
            <p>{selectedImage.alt}</p>
          {:else}
            <p>{selectedExhibition.year}</p>
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
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    font-family: Georgia, "Times New Roman", serif;
    background: #ffffff;
    color: #4d4a47;
  }

  .exhibitions-page {
    width: 100%;
    min-height: 100vh;
    padding: 116px 40px 92px;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .exhibitions-feature {
    width: 100%;
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: clamp(34px, 5vw, 82px);
    align-items: center;
  }

  .exhibitions-list-column {
    width: 100%;
    max-width: 260px;
    height: min(66vh, 720px);
    justify-self: start;
    display: flex;
    flex-direction: column;
  }

  .exhibitions-heading {
    margin-bottom: 34px;
  }

  .exhibitions-label {
    margin: 0;
    color: #3f3c39;
    font-size: 15px;
    font-weight: 300;
    line-height: 1.15;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .exhibitions-scroll-area {
    min-height: 0;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .exhibitions-scroll-area::-webkit-scrollbar {
    display: none;
  }

  .section-links,
  .selected-year-links {
    display: flex;
    flex-direction: column;
  }

  .section-links {
    gap: 16px;
  }

  .selected-year-links {
    margin-top: 34px;
    gap: 12px;
  }

  .section-button,
  .selected-year-button {
    width: fit-content;
    max-width: 100%;
    display: inline-block;
    padding: 0;
    border: 0;
    background: transparent;
    color: #77716d;
    font-family: inherit;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.08em;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      color 0.35s ease,
      opacity 0.35s ease;
  }

  .section-button {
    font-size: 15px;
  }

  .selected-year-button {
    font-size: 16px;
  }

  .section-button::after,
  .selected-year-button::after {
    content: "";
    display: block;
    width: 0;
    height: 1px;
    margin-top: 5px;
    background: currentColor;
    transition: width 0.5s ease;
  }

  .section-button:hover,
  .section-button:focus,
  .section-button.active,
  .selected-year-button:hover,
  .selected-year-button:focus,
  .selected-year-button.active {
    color: #1f1f1f;
  }

  .section-button:hover::after,
  .section-button:focus::after,
  .section-button.active::after,
  .selected-year-button:hover::after,
  .selected-year-button:focus::after,
  .selected-year-button.active::after {
    width: 100%;
  }

  .exhibitions-content-column {
    width: 100%;
    min-width: 0;
    height: min(82vh, 880px);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .exhibitions-content-column::-webkit-scrollbar {
    display: none;
  }

  .text-panel,
  .selected-panel {
    width: 100%;
    animation: contentReveal 0.65s ease both;
  }

  .text-panel {
    max-width: 900px;
  }

  .text-panel h2,
  .selected-info h2 {
    margin: 0;
    color: #2f2d2b;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.3;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .entries-list {
    margin-top: 34px;
  }

  .entry-group {
    display: grid;
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 26px;
    margin-bottom: 28px;
  }

  .entry-group h3 {
    margin: 0;
    color: #6f8f72;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.45;
    letter-spacing: 0.08em;
  }

  .entry-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .entry-items p {
    margin: 0;
    color: #6f6b68;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.45;
    letter-spacing: 0.035em;
  }

  .selected-info {
    max-width: 760px;
    margin-bottom: 34px;
  }

  .selected-info span,
  .selected-info p {
    margin: 0;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .selected-info span {
    display: block;
    margin-bottom: 10px;
    color: #6f8f72;
    font-size: 12px;
  }

  .selected-info p {
    margin-top: 10px;
    color: #8f8883;
    font-size: 13px;
    line-height: 1.4;
  }

  .selected-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 26px;
    animation: contentReveal 0.85s ease both;
  }

  .selected-card {
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
  }

  .selected-card img {
    width: 100%;
    aspect-ratio: 4 / 5;
    display: block;
    object-fit: cover;
    object-position: center;
    background: #f8f6f4;
    transition:
      transform 0.45s ease,
      opacity 0.3s ease;
  }

  .selected-card:hover img,
  .selected-card:focus img {
    transform: scale(1.025);
    opacity: 0.94;
  }

  .selected-card:focus-visible {
    outline: 1px solid #6f8f72;
    outline-offset: 6px;
  }

  .selected-card span {
    display: block;
    margin-top: 18px;
    color: #8f8883;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .empty-message {
    margin: 0;
    color: #6f6b68;
    font-size: 14px;
  }

  .exhibition-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.98);
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center;
    padding: 34px 40px;
    box-sizing: border-box;
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
    animation: contentReveal 0.55s ease both;
  }

  .lightbox-meta {
    margin: 18px auto 0;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #8f8883;
    font-size: 12px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .lightbox-meta p {
    margin: 0;
    color: #4d4a47;
    font-size: 13px;
    line-height: 1.35;
    letter-spacing: 0.04em;
    text-transform: none;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 40px;
    z-index: 2;
    border: 0;
    background: transparent;
    color: #4d4a47;
    font-family: inherit;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .lightbox-close::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    margin-top: 5px;
    background: #6f8f72;
    opacity: 0.9;
  }

  .lightbox-arrow {
    width: 46px;
    height: 46px;
    border: 1px solid #d8d2cc;
    border-radius: 50%;
    background: #ffffff;
    color: #4d4a47;
    font-family: inherit;
    font-size: 18px;
    cursor: pointer;
    transition:
      border-color 0.3s ease,
      color 0.3s ease,
      transform 0.3s ease;
  }

  .lightbox-arrow:hover,
  .lightbox-arrow:focus {
    border-color: #6f8f72;
    color: #6f8f72;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  .lightbox-arrow-left:hover,
  .lightbox-arrow-left:focus {
    transform: translateX(-4px);
  }

  .lightbox-arrow-right:hover,
  .lightbox-arrow-right:focus {
    transform: translateX(4px);
  }

  @keyframes contentReveal {
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
    .exhibitions-page {
      padding: 120px 40px 92px;
    }

    .exhibitions-feature {
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 34px;
    }

    .exhibitions-list-column {
      max-width: 220px;
      height: min(62vh, 620px);
    }

    .exhibitions-content-column {
      height: min(76vh, 760px);
    }

    .selected-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }

    .exhibition-lightbox {
      grid-template-columns: 60px 1fr 60px;
      padding: 34px 24px;
    }
  }

  @media (max-width: 700px) {
    :global(body) {
      overflow: hidden;
    }

    .exhibitions-page {
      height: 100dvh;
      min-height: 100dvh;
      padding: 118px 24px 0;
      align-items: stretch;
      overflow: hidden;
    }

    .exhibitions-feature {
      width: 100%;
      height: calc(100dvh - 118px);
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto minmax(0, 1fr);
      gap: 24px;
      align-items: stretch;
      overflow-x: visible;
      overflow-y: hidden;
    }

    .exhibitions-list-column {
      order: 1;
      max-width: none;
      height: auto;
      overflow: visible;
    }

    .exhibitions-heading {
      margin-bottom: 18px;
    }

    .exhibitions-label {
      font-size: 18px;
    }

    .exhibitions-scroll-area {
      width: calc(100vw - 48px);
      max-width: calc(100vw - 48px);
      overflow-x: auto;
      overflow-y: hidden;
      padding-right: 0;
      padding-bottom: 10px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-x;
    }

    .exhibitions-scroll-area::-webkit-scrollbar {
      display: none;
    }

    .section-links {
      width: max-content;
      min-width: max-content;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 28px;
      padding-bottom: 4px;
    }

    .selected-year-links {
      width: max-content;
      min-width: max-content;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 28px;
      margin-top: 18px;
      padding-bottom: 4px;
    }

    .section-button,
    .selected-year-button {
      flex: 0 0 auto;
      width: auto;
      max-width: none;
      white-space: nowrap;
    }

    .section-button {
      font-size: 14px;
    }

    .selected-year-button {
      font-size: 14px;
    }

    .exhibitions-content-column {
      order: 2;
      height: 100%;
      padding-bottom: 130px;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
    }

    .text-panel h2,
    .selected-info h2 {
      font-size: 20px;
    }

    .entry-group {
      grid-template-columns: 1fr;
      gap: 8px;
      margin-bottom: 28px;
    }

    .entry-items {
      gap: 9px;
    }

    .entry-items p {
      font-size: 13px;
      line-height: 1.45;
    }

    .selected-info {
      margin-bottom: 28px;
    }

    .selected-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 22px 16px;
    }

    .selected-card span {
      margin-top: 14px;
      font-size: 10px;
      line-height: 1.35;
    }

    .exhibition-lightbox {
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
</style>
