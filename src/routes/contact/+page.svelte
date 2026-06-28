<script>
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let { data } = $props();

  const fallbackContact = {
    name: "Eva Eichinger",
    email: "info@evaeichinger.com",
    address: "Westbahnstraße 27-29, 1070 Vienna",
    instagram: "@eva_eichinger_",
    instagramUrl: "https://www.instagram.com/eva_eichinger_/",
    website: "evaeichinger.com",
    websiteUrl: "https://evaeichinger.com",
  };

  let email = $state("");
  let newsletterMessage = $state("");
  let contactScrollElement = $state(null);

  let contact = $derived({
    ...fallbackContact,
    ...(data?.contact || {}),
  });

  let contactEmail = $derived(String(contact.email || "").toLowerCase());
  let contactInstagram = $derived(
    String(contact.instagram || "").toLowerCase(),
  );
  let contactWebsite = $derived(String(contact.website || "").toLowerCase());
  let contactAddress = $derived(
    contact.address || "Westbahnstraße 27-29, 1070 Vienna",
  );

  let mapEmbedUrl = $derived(
    `https://www.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`,
  );

  function handleNewsletterSubmit(event) {
    event.preventDefault();

    newsletterMessage =
      "Thank you. Newsletter registration will be connected soon.";

    email = "";
  }

  function scrollBackToTop() {
    if (contactScrollElement) {
      contactScrollElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function unlockPageLocks() {
    if (!browser) return;

    document.documentElement.classList.remove("menu-open-lock");
    document.body.classList.remove("menu-open-lock");

    document.documentElement.style.overflow = "";
    document.documentElement.style.height = "";
    document.documentElement.style.position = "";
    document.documentElement.style.width = "";
    document.documentElement.style.touchAction = "";

    document.body.style.overflow = "";
    document.body.style.height = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    document.body.style.touchAction = "";
  }

  onMount(() => {
    unlockPageLocks();

    requestAnimationFrame(() => {
      unlockPageLocks();
    });

    setTimeout(() => {
      unlockPageLocks();
    }, 0);

    return () => {
      unlockPageLocks();
    };
  });
</script>

<svelte:head>
  <title>Contact | Eva Eichinger</title>

  <meta
    name="description"
    content="Contact Eva Eichinger by email, Instagram, website or address in Vienna."
  />

  <script src="https://cdn.lordicon.com/lordicon.js"></script>
</svelte:head>

<main class="contact-page">
  <section class="contact-layout" aria-label="Contact">
    <aside class="left-column" aria-label="Studio information">
      <div class="contact-top">
        <span class="contact-top-icon" aria-hidden="true">
          <lord-icon
            src="https://cdn.lordicon.com/onmwuuox.json"
            trigger="hover"
            stroke="light"
            colors="primary:#000000,secondary:#000000"
            style="width:64px;height:64px"
          >
          </lord-icon>
        </span>

        <span class="contact-top-text">CONTACT</span>
      </div>

      <div class="contact-preview">
        <h1>STUDIO</h1>

        <div class="preview-bottom">
          <div class="preview-info">
            <strong>Studio visits by appointment</strong>

            <p>
              Monday – Friday: 09:00 – 17:00<br />
              Saturday – Sunday: closed
            </p>
          </div>
        </div>
      </div>
    </aside>

    <section class="right-column" aria-label="Contact content">
      <div class="contact-grid" bind:this={contactScrollElement}>
        <article class="contact-card">
          <span class="card-number">02</span>

          <span class="contact-icon" aria-hidden="true">
            <lord-icon
              src="https://cdn.lordicon.com/apmrcxtj.json"
              trigger="hover"
              stroke="light"
              colors="primary:#000000,secondary:#000000"
              style="width:72px;height:72px"
            >
            </lord-icon>
          </span>

          <div class="contact-card-content">
            <strong>EMAIL</strong>

            <p>
              <a class="lowercase-contact-link" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </p>
          </div>
        </article>

        <article class="contact-card">
          <span class="card-number">03</span>

          <span class="contact-icon" aria-hidden="true">
            <lord-icon
              src="https://cdn.lordicon.com/tgyvxauj.json"
              trigger="hover"
              stroke="light"
              colors="primary:#000000,secondary:#000000"
              style="width:72px;height:72px"
            >
            </lord-icon>
          </span>

          <div class="contact-card-content">
            <strong>INSTAGRAM</strong>

            <p>
              <a
                class="lowercase-contact-link"
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                {contactInstagram}
              </a>
            </p>
          </div>
        </article>

        <article class="contact-card">
          <span class="card-number">04</span>

          <span class="contact-icon" aria-hidden="true">
            <lord-icon
              src="https://cdn.lordicon.com/rpviwvwn.json"
              trigger="hover"
              stroke="light"
              colors="primary:#000000,secondary:#000000"
              style="width:72px;height:72px"
            >
            </lord-icon>
          </span>

          <div class="contact-card-content">
            <strong>WEBSITE</strong>

            <p>
              <a
                class="lowercase-contact-link"
                href={contact.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                {contactWebsite}
              </a>
            </p>
          </div>
        </article>

        <article class="contact-card">
          <span class="card-number">05</span>

          <span class="contact-icon" aria-hidden="true">
            <lord-icon
              src="https://cdn.lordicon.com/onmwuuox.json"
              trigger="hover"
              stroke="light"
              colors="primary:#000000,secondary:#000000"
              style="width:72px;height:72px"
            >
            </lord-icon>
          </span>

          <div class="contact-card-content">
            <strong>STUDIO ADDRESS</strong>

            <p>{contactAddress}</p>
          </div>
        </article>

        <form
          class="contact-card newsletter-card"
          onsubmit={handleNewsletterSubmit}
        >
          <span class="card-number">06</span>

          <div class="contact-card-content">
            <strong>NEWSLETTER</strong>

            <p>
              Occasional updates about exhibitions, performances and studio
              news.
            </p>

            <div class="newsletter-input-row">
              <input
                type="email"
                bind:value={email}
                placeholder="Email address"
                aria-label="Email address"
                required
              />

              <button type="submit">Join</button>
            </div>

            {#if newsletterMessage}
              <p class="newsletter-message">{newsletterMessage}</p>
            {/if}
          </div>
        </form>

        <article class="contact-card map-card" aria-label="Studio map">
          <div class="map-frame" aria-label="Google map">
            <iframe
              src={mapEmbedUrl}
              title="Studio location map"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div class="map-address">
            <strong>ADDRESS</strong>
            <p>{contactAddress}</p>
          </div>
        </article>

        <button type="button" class="back-to-top" onclick={scrollBackToTop}>
          BACK TO TOP
        </button>
      </div>
    </section>
  </section>
</main>

<style>
  :global(html),
  :global(body),
  .contact-page {
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(html),
  :global(body) {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  :global(html::-webkit-scrollbar),
  :global(body::-webkit-scrollbar) {
    width: 0;
    height: 0;
    display: none;
    background: transparent;
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

  .contact-page {
    --map-height: 140px;
    --contact-card-height: calc(var(--map-height) + 106px);
    --contact-card-bg: #fdfdfc;

    width: 100%;
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
    padding: 96px 72px 90px 28px;
    background: #ffffff;
    color: #000000;
    text-transform: uppercase;
  }

  .contact-page a,
  .contact-page button,
  .contact-page input {
    font-family: inherit;
  }

  .contact-page p {
    text-transform: none;
  }

  .contact-layout {
    width: 100%;
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: clamp(210px, 15vw, 265px) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
    overflow: hidden;
  }

  .left-column {
    position: relative;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .contact-top {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .contact-top-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .contact-top-icon lord-icon {
    display: block;
  }

  .contact-top-text {
    display: inline-block;
    color: #000000;
    font-size: clamp(12px, 0.78vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    text-decoration-line: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .contact-preview {
    width: 100%;
  }

  .contact-preview h1 {
    max-width: 280px;
    margin: 0 0 42px;
    color: #000000;
    font-size: clamp(18px, calc(0.78vw + 6px), 20px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
  }

  .preview-bottom {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: start;
  }

  .preview-info {
    max-width: 265px;
  }

  .preview-info strong {
    display: block;
    margin: 0 0 9px;
    color: #000000;
    font-size: clamp(12px, 0.72vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
    text-transform: uppercase;
  }

  .preview-info p {
    margin: 0;
    color: #000000;
    font-size: clamp(11px, 0.66vw, 12px);
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: 0.006em;
    text-transform: uppercase;
  }

  .right-column {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  .contact-grid {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: var(--contact-card-height);
    align-content: start;
    gap: clamp(12px, 1vw, 18px);
    padding: 0 0 24px;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    -ms-overflow-style: none;
  }

  .contact-grid::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
    background: transparent;
  }

  .contact-card {
    position: relative;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    color: #000000;
    background: var(--contact-card-bg);
    text-decoration: none;
    isolation: isolate;
    transition:
      background 0.35s ease,
      opacity 0.35s ease;
  }

  .contact-card::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.18),
        rgba(255, 255, 255, 0) 35%
      ),
      linear-gradient(to top, rgba(0, 0, 0, 0.025), rgba(0, 0, 0, 0) 46%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
  }

  .contact-card::after {
    content: "";
    position: absolute;
    inset: 12px;
    z-index: 2;
    background: rgba(255, 255, 255, 0.04);
    opacity: 0;
    pointer-events: none;
    transform: scale(0.985);
    transition:
      opacity 0.35s ease,
      transform 0.35s ease;
  }

  .contact-card:hover,
  .contact-card:focus-within {
    background: #ffffff;
  }

  .contact-card:hover::before,
  .contact-card:focus-within::before,
  .contact-card:hover::after,
  .contact-card:focus-within::after {
    opacity: 1;
    transform: scale(1);
  }

  .map-card {
    padding: 0;
    background: var(--contact-card-bg);
  }

  .map-card::before,
  .map-card::after {
    display: none;
  }

  .map-frame {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--contact-card-bg);
  }

  .map-frame iframe {
    width: 100%;
    height: 100%;
    display: block;
    border: 0;
    filter: grayscale(100%) contrast(0.94) brightness(1.04);
    pointer-events: none;
  }

  .map-address {
    position: absolute;
    left: 16px;
    bottom: 16px;
    z-index: 4;
    max-width: calc(100% - 32px);
    padding: 10px 12px;
    background: rgba(253, 253, 252, 0.88);
    backdrop-filter: blur(4px);
  }

  .map-address strong {
    display: block;
    margin: 0 0 6px;
    color: #000000;
    font-size: clamp(11px, 0.68vw, 12px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
    text-transform: uppercase;
  }

  .map-address p {
    margin: 0;
    color: #000000;
    font-size: clamp(12px, 0.95vw, 15px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .card-number {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 4;
    color: #000000;
    font-size: 11px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.05em;
    opacity: 0.42;
  }

  .contact-icon {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 4;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9;
    pointer-events: auto;
  }

  .contact-icon lord-icon {
    display: block;
  }

  .contact-card-content {
    position: relative;
    z-index: 4;
    width: 100%;
    max-width: 520px;
    padding-right: 80px;
  }

  .contact-card-content strong {
    display: block;
    margin: 0 0 8px;
    color: #000000;
    font-size: clamp(11px, 0.68vw, 12px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
    text-transform: uppercase;
  }

  .contact-card-content p {
    margin: 0;
    color: #000000;
    font-size: clamp(12px, 0.95vw, 15px);
    font-weight: 700;
    line-height: 1.28;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .contact-card-content a {
    color: #000000;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    transition: opacity 0.24s ease;
  }

  .contact-card-content a:hover,
  .contact-card-content a:focus {
    opacity: 0.55;
  }

  .lowercase-contact-link {
    display: inline;
    color: #000000;
    font-size: inherit;
    line-height: 1.4;
    text-transform: lowercase;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  .newsletter-input-row {
    width: 100%;
    max-width: 520px;
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid #000000;
  }

  .newsletter-input-row input {
    width: 100%;
    padding: 11px 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    outline: none;
    text-transform: uppercase;
  }

  .newsletter-input-row input::placeholder {
    color: rgba(0, 0, 0, 0.42);
  }

  .newsletter-input-row button {
    padding: 11px 0 11px 22px;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.24s ease;
  }

  .newsletter-input-row button:hover,
  .newsletter-input-row button:focus {
    opacity: 0.55;
  }

  .newsletter-message {
    margin: 10px 0 0;
    color: #000000;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.16;
    letter-spacing: 0.006em;
    text-transform: uppercase;
  }

  .back-to-top {
    display: none;
    grid-column: 1 / -1;
    justify-self: center;
    margin: 32px 0 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
    text-transform: uppercase;
  }

  @media (min-width: 1440px) {
    .contact-page {
      padding-right: 72px;
    }

    .contact-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }
  }

  @media (min-width: 1680px) {
    .contact-page {
      padding-right: 76px;
    }

    .contact-layout {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 14px;
    }

    .contact-preview h1 {
      max-width: 270px;
    }

    .preview-info {
      max-width: 260px;
    }
  }

  @media (max-width: 1280px) {
    .contact-page {
      --map-height: 145px;
      --contact-card-height: calc(var(--map-height) + 104px);

      padding: 96px 72px 90px 28px;
    }

    .contact-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .contact-grid {
      gap: 16px;
    }

    .contact-preview h1 {
      max-width: 280px;
      font-size: clamp(19px, calc(0.95vw + 6px), 21px);
    }
  }

  @media (max-width: 1024px) {
    .contact-page {
      --map-height: 118px;
      --contact-card-height: calc(var(--map-height) + 104px);

      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 96px 24px 0;
    }

    .contact-layout {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      gap: 0;
    }

    .left-column {
      position: relative;
      z-index: 20;
      height: auto;
      min-height: 0;
      flex: 0 0 auto;
      display: block;
      margin: 0;
      padding-bottom: 22px;
      background: #ffffff;
    }

    .contact-top {
      width: 100%;
      margin-bottom: 20px;
      align-items: flex-start;
      text-align: left;
    }

    .contact-top-icon {
      width: 58px;
      height: 58px;
    }

    .contact-top-icon lord-icon {
      width: 58px !important;
      height: 58px !important;
    }

    .contact-top-text {
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.005em;
    }

    .contact-preview h1 {
      max-width: 520px;
      margin: 0 0 8px;
      font-size: 16px;
      text-align: left;
      line-height: 1;
    }

    .preview-info {
      width: 100%;
      max-width: none;
      margin-bottom: 0;
      text-align: left;
    }

    .preview-info strong {
      font-size: 14px;
    }

    .preview-info p {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.12;
    }

    .right-column {
      width: 100%;
      min-height: 0;
      flex: 1 1 auto;
      display: block;
      overflow: hidden;
    }

    .contact-grid {
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: var(--contact-card-height);
      align-content: start;
      gap: 12px;
      padding: 0 0 calc(120px + env(safe-area-inset-bottom));
      scrollbar-width: none;
      scrollbar-color: transparent transparent;
      -ms-overflow-style: none;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }

    .contact-card {
      padding: 14px;
      background: var(--contact-card-bg);
    }

    .contact-card::before,
    .contact-card::after {
      display: none;
    }

    .card-number {
      top: 14px;
      left: 14px;
      font-size: 10px;
    }

    .contact-icon {
      top: 8px;
      right: 8px;
      width: 56px;
      height: 56px;
    }

    .contact-icon lord-icon {
      width: 56px !important;
      height: 56px !important;
    }

    .contact-card-content {
      padding-right: 58px;
    }

    .contact-card-content strong {
      font-size: 12px;
    }

    .contact-card-content p {
      font-size: 12px;
      line-height: 1.34;
    }

    .lowercase-contact-link {
      font-size: 11px;
      line-height: 1.45;
      text-underline-offset: 3px;
    }

    .map-address {
      left: 14px;
      bottom: 14px;
      max-width: calc(100% - 28px);
      padding: 9px 10px;
    }

    .map-address strong {
      font-size: 12px;
    }

    .map-address p {
      font-size: 12px;
      line-height: 1.12;
    }

    .newsletter-input-row {
      margin-top: 16px;
    }

    .back-to-top {
      display: block;
      margin: 32px 0 0;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 14px;
    }
  }

  @media (max-width: 700px) {
    .contact-page {
      --map-height: 108px;
      --contact-card-height: calc(var(--map-height) + 100px);

      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      padding: 88px 16px 0;
    }

    .left-column {
      padding-bottom: 18px;
    }

    .contact-top {
      margin-bottom: 16px;
      align-items: flex-start;
      text-align: left;
    }

    .contact-top-icon {
      width: 52px;
      height: 52px;
    }

    .contact-top-icon lord-icon {
      width: 52px !important;
      height: 52px !important;
    }

    .contact-top-text {
      font-size: 17px;
    }

    .contact-preview h1 {
      max-width: 100%;
      margin: 0 0 8px;
      font-size: 14px;
    }

    .preview-info strong {
      font-size: 12px;
    }

    .preview-info p {
      font-size: 12px;
      line-height: 1.12;
    }

    .contact-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: var(--contact-card-height);
      gap: 10px;
      padding: 0 0 calc(120px + env(safe-area-inset-bottom));
    }

    .contact-card {
      padding: 12px;
      background: var(--contact-card-bg);
    }

    .card-number {
      top: 12px;
      left: 12px;
      font-size: 10px;
    }

    .contact-icon {
      top: 6px;
      right: 6px;
      width: 48px;
      height: 48px;
    }

    .contact-icon lord-icon {
      width: 48px !important;
      height: 48px !important;
    }

    .contact-card-content {
      padding-right: 44px;
    }

    .contact-card-content strong {
      margin-bottom: 7px;
      font-size: 11px;
    }

    .contact-card-content p {
      font-size: 11px;
      line-height: 1.35;
    }

    .lowercase-contact-link {
      font-size: 10px;
      line-height: 1.5;
      text-underline-offset: 3px;
    }

    .map-address {
      left: 12px;
      bottom: 12px;
      max-width: calc(100% - 24px);
      padding: 8px 9px;
    }

    .map-address strong {
      margin-bottom: 6px;
      font-size: 11px;
    }

    .map-address p {
      font-size: 11px;
      line-height: 1.1;
    }

    .newsletter-input-row {
      grid-template-columns: 1fr;
      gap: 6px;
      margin-top: 14px;
      border-bottom: 0;
    }

    .newsletter-input-row input {
      padding: 10px 0;
      border-bottom: 1px solid #000000;
      font-size: 11px;
    }

    .newsletter-input-row button {
      width: fit-content;
      padding: 5px 0;
      font-size: 11px;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 4px;
    }

    .newsletter-message {
      margin-top: 8px;
      font-size: 10px;
    }

    .back-to-top {
      display: block;
      margin-top: 30px;
      padding-bottom: calc(64px + env(safe-area-inset-bottom));
      font-size: 12px;
    }
  }

  @media (max-width: 420px) {
    .contact-page {
      --map-height: 98px;
      --contact-card-height: calc(var(--map-height) + 96px);
      padding-top: 84px;
    }

    .contact-top {
      margin-bottom: 14px;
    }

    .contact-top-icon {
      width: 48px;
      height: 48px;
    }

    .contact-top-icon lord-icon {
      width: 48px !important;
      height: 48px !important;
    }

    .contact-top-text {
      font-size: 16px;
    }

    .contact-card {
      padding: 11px;
    }

    .contact-icon {
      width: 42px;
      height: 42px;
    }

    .contact-icon lord-icon {
      width: 42px !important;
      height: 42px !important;
    }

    .contact-card-content {
      padding-right: 36px;
    }

    .contact-card-content p {
      font-size: 10px;
      line-height: 1.35;
    }

    .lowercase-contact-link {
      font-size: 9px;
      line-height: 1.55;
      text-underline-offset: 3px;
    }

    .map-address {
      left: 11px;
      bottom: 11px;
      max-width: calc(100% - 22px);
      padding: 7px 8px;
    }

    .map-address p {
      font-size: 10px;
    }
  }
</style>
