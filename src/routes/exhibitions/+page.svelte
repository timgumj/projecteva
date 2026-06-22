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
      id: "selected",
      label: "Selected Exhibitions",
      heading: "Selected Exhibitions",
      entries: [],
    },
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
  ];

  const initialExhibition =
    data.selectedExhibitions?.find(
      (exhibition) => exhibition.id === data.requestedPostId,
    ) || data.selectedExhibitions?.[0];

  let activeSectionId = $state("selected");
  let selectedYearSlug = $state(initialExhibition?.yearSlug || "");
  let selectedImageIndex = $state(null);
  let hoveredImageIndex = $state(null);

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
    hoveredImageIndex = null;
  }

  function selectExhibition(exhibition) {
    selectedYearSlug = exhibition.yearSlug;
    selectedImageIndex = null;
    hoveredImageIndex = null;
  }

  function setHoveredImage(index) {
    hoveredImageIndex = index;
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

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPreviousImage();
    if (event.key === "ArrowRight") showNextImage();
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
  <section class="exhibitions-layout" aria-label="Exhibitions">
    <aside class="left-column" aria-label="Exhibition navigation">
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

      <div class="exhibition-preview">
        {#if activeSectionId === "selected" && selectedExhibition}
          <h1>{selectedExhibition.title}</h1>

          <div class="preview-bottom">
            <div class="preview-info">
              <strong>{selectedExhibition.year}</strong>

              {#if selectedExhibition.info}
                <p>{selectedExhibition.info}</p>
              {:else}
                <p>Selected exhibition images and documentation.</p>
              {/if}
            </div>

            <div class="case-count">
              IMAGES({selectedImages.length})
            </div>
          </div>
        {:else}
          <h1>{activeSection.heading}</h1>

          <div class="preview-bottom">
            <div class="preview-info">
              <strong>EXHIBITIONS</strong>
              <p>Selected exhibition history, residences, and scholarships.</p>
            </div>

            <div class="case-count">
              YEARS({activeSection.entries.length})
            </div>
          </div>
        {/if}
      </div>
    </aside>

    <section class="right-column" aria-label="Exhibition content">
      {#if activeSectionId === "selected"}
        {#if data.selectedExhibitions?.length}
          <div class="selected-year-links">
            {#each data.selectedExhibitions as exhibition}
              <button
                type="button"
                class="selected-year-button"
                class:active={selectedExhibition?.yearSlug ===
                  exhibition.yearSlug}
                onclick={() => selectExhibition(exhibition)}
              >
                {exhibition.title}
              </button>
            {/each}
          </div>
        {/if}

        {#if selectedExhibition?.images?.length}
          {#key selectedExhibition.yearSlug}
            <div class="image-grid">
              {#each selectedExhibition.images as image, index}
                <button
                  type="button"
                  class="image-card"
                  class:active={hoveredImageIndex === index}
                  onmouseenter={() => setHoveredImage(index)}
                  onfocus={() => setHoveredImage(index)}
                  onclick={() => openLightbox(index)}
                  aria-label={`Open ${image.alt || selectedExhibition.year}`}
                >
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt || selectedExhibition.year}
                    />
                  </figure>

                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              {/each}
            </div>
          {/key}
        {:else}
          <p class="empty-message">No images found for this exhibition.</p>
        {/if}
      {:else}
        <div class="text-grid">
          {#each activeSection.entries as group}
            <section class="entry-group">
              <h2>{group.year}</h2>

              <div class="entry-items">
                {#each group.items as item}
                  <p>{item}</p>
                {/each}
              </div>
            </section>
          {/each}
        </div>
      {/if}
    </section>
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
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    color: #000000;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .exhibitions-page {
    width: 100%;
    min-height: 100vh;
    padding: 96px 90px 90px 28px;
    background: #ffffff;
  }

  .exhibitions-layout {
    width: 100%;
    display: grid;
    grid-template-columns: 19% 81%;
    gap: 34px;
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

  .section-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
  }

  .section-button,
  .selected-year-button {
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
    transition: color 0.3s ease;
  }

  .section-button.active,
  .section-button:hover,
  .section-button:focus,
  .selected-year-button.active,
  .selected-year-button:hover,
  .selected-year-button:focus {
    color: #000000;
  }

  .exhibition-preview {
    width: 100%;
  }

  .exhibition-preview h1 {
    max-width: 340px;
    margin: 0 0 72px;
    color: #000000;
    font-size: clamp(27px, 2.55vw, 45px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.055em;
  }

  .preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .preview-info {
    max-width: 330px;
  }

  .preview-info strong {
    display: block;
    margin: 0 0 8px;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .preview-info p {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.2;
  }

  .case-count {
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
  }

  .right-column {
    width: 100%;
    min-width: 0;
  }

  .selected-year-links {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 34px;
  }

  .image-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 12px;
    row-gap: 12px;
    padding: 0 0 68px;
  }

  .image-card {
    position: relative;
    display: block;
    min-height: 560px;
    overflow: hidden;
    padding: 0;
    border: 0;
    color: #000000;
    background: #eeeeee;
    text-align: left;
    cursor: pointer;
  }

  .image-card figure {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eeeeee;
  }

  .image-card img {
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
      filter 0.55s ease;
  }

  .image-grid:hover .image-card img {
    opacity: 0.12;
    filter: grayscale(10%);
  }

  .image-grid:hover .image-card:hover img,
  .image-grid:hover .image-card.active img {
    width: 92%;
    height: 92%;
    min-height: 0;
    opacity: 1;
    object-fit: contain;
    filter: none;
  }

  .image-card span {
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

  .image-card:hover span,
  .image-card.active span {
    opacity: 1;
  }

  .text-grid {
    max-width: 980px;
    padding-bottom: 90px;
  }

  .entry-group {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr);
    gap: 30px;
    margin-bottom: 26px;
  }

  .entry-group h2 {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1.2;
  }

  .entry-items {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .entry-items p {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.22;
    text-transform: uppercase;
  }

  .empty-message {
    margin: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .exhibition-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    align-items: center;
    padding: 34px 40px;
    background: rgba(255, 255, 255, 0.98);
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
  }

  .lightbox-meta {
    margin: 18px auto 0;
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #000000;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.35;
    text-transform: uppercase;
  }

  .lightbox-meta p {
    margin: 0;
  }

  .lightbox-close {
    position: fixed;
    top: 34px;
    right: 40px;
    z-index: 2;
    border: 0;
    background: transparent;
    color: #000000;
    font-family: inherit;
    font-size: 13px;
    text-transform: uppercase;
    cursor: pointer;
  }

  .lightbox-arrow {
    width: 46px;
    height: 46px;
    border: 1px solid #d8d2cc;
    border-radius: 50%;
    background: #ffffff;
    color: #000000;
    font-family: inherit;
    font-size: 18px;
    cursor: pointer;
  }

  .lightbox-arrow-left {
    justify-self: start;
  }

  .lightbox-arrow-right {
    justify-self: end;
  }

  @media (max-width: 1280px) {
    .exhibitions-page {
      padding: 96px 80px 90px 28px;
    }

    .exhibitions-layout {
      grid-template-columns: 21% 79%;
    }

    .exhibition-preview h1 {
      font-size: clamp(26px, 2.4vw, 38px);
    }

    .image-card,
    .image-card img {
      min-height: 500px;
    }
  }

  @media (max-width: 1024px) {
    .exhibitions-page {
      padding: 118px 24px 110px;
    }

    .exhibitions-layout {
      display: block;
    }

    .left-column {
      position: relative;
      top: auto;
      height: auto;
      min-height: 0;
      display: block;
      margin-bottom: 34px;
    }

    .section-links {
      margin-bottom: 28px;
    }

    .exhibition-preview h1 {
      max-width: 640px;
      margin: 0 0 28px;
      font-size: clamp(29px, 5.6vw, 50px);
    }

    .preview-info {
      margin-bottom: 10px;
    }

    .selected-year-links {
      margin-bottom: 28px;
    }

    .image-grid {
      padding-bottom: 40px;
    }

    .image-card,
    .image-card img {
      min-height: 440px;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: 92%;
      height: 92%;
      min-height: 0;
      object-fit: contain;
    }

    .entry-group {
      grid-template-columns: 80px minmax(0, 1fr);
    }
  }

  @media (max-width: 700px) {
    .exhibitions-page {
      padding: 108px 24px 120px;
    }

    .section-button,
    .selected-year-button {
      font-size: 14px;
    }

    .exhibition-preview h1 {
      font-size: clamp(27px, 8vw, 40px);
    }

    .preview-info strong,
    .preview-info p,
    .case-count {
      font-size: 14px;
    }

    .image-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .image-card,
    .image-card img {
      min-height: 420px;
    }

    .image-grid:hover .image-card img {
      opacity: 1;
      filter: none;
    }

    .image-grid:hover .image-card:hover img,
    .image-grid:hover .image-card.active img {
      width: 100%;
      height: 100%;
      min-height: 420px;
      object-fit: cover;
    }

    .image-card span {
      opacity: 1;
    }

    .entry-group {
      grid-template-columns: 1fr;
      gap: 8px;
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
