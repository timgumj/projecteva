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
  let contactAddress = $derived(
    contact.address || "Westbahnstraße 27-29, 1070 Vienna",
  );

  let contactMapUrl = $derived(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      contactAddress,
    )}`,
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
    content="Contact Eva Eichinger by email, Instagram or studio address in Vienna."
  />

  <script src="https://cdn.lordicon.com/lordicon.js"></script>

  <script id="mcjs">
    !(function (c, h, i, m, p) {
      (m = c.createElement(h)),
        (p = c.getElementsByTagName(h)[0]),
        (m.async = 1),
        (m.src = i),
        p.parentNode.insertBefore(m, p);
    })(
      document,
      "script",
      "https://chimpstatic.com/mcjs-connected/js/users/d14788420ed252180d790bfce/3b84c7e1aa577e3cfa670ad4f.js",
    );
  </script>
</svelte:head>

<main class="contact-page">
  <section class="contact-layout" aria-label="Contact">
    <aside class="left-column" aria-label="Studio information">
      <div class="contact-top">
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
          <span class="card-number">01</span>

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
          <span class="card-number">02</span>

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
          <span class="card-number">03</span>

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

            <p>
              <a
                class="address-link"
                href={contactMapUrl}
                target="_blank"
                rel="noreferrer"
              >
                {contactAddress}
              </a>
            </p>
          </div>
        </article>

        <form
          class="contact-card newsletter-card"
          onsubmit={handleNewsletterSubmit}
        >
          <span class="card-number">04</span>

          <span class="contact-icon newsletter-icon" aria-hidden="true">
            <lord-icon
              src="https://cdn.lordicon.com/dhzbkemf.json"
              trigger="hover"
              stroke="light"
              colors="primary:#000000,secondary:#000000"
              style="width:72px;height:72px"
            >
            </lord-icon>
          </span>

          <div class="contact-card-content">
            <strong>SUBSCRIBE TO NEWSLETTER</strong>

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
    --contact-card-height: clamp(165px, 18vh, 220px);

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
    gap: clamp(28px, 3vw, 56px);
    align-items: stretch;
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
    align-items: flex-start;
  }

  .contact-top-text {
    display: inline-block;
    color: #000000;
    font-size: clamp(12px, 0.78vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    text-decoration: none;
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
    display: flex;
    align-items: center;
  }

  .contact-grid {
    width: 100%;
    height: auto;
    max-height: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: var(--contact-card-height);
    align-content: center;
    column-gap: clamp(48px, 5vw, 110px);
    row-gap: clamp(28px, 3vh, 46px);
    padding: 10px 0 0;
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
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 28px 0 24px;
    color: #000000;
    background: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    text-decoration: none;
    isolation: isolate;
    transition:
      border-color 0.28s ease,
      opacity 0.28s ease,
      transform 0.28s ease;
  }

  .card-number {
    position: absolute;
    top: 2px;
    left: 0;
    z-index: 4;
    color: #000000;
    font-size: 11px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.05em;
    opacity: 0.38;
  }

  .contact-icon {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 4;
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.78;
    pointer-events: auto;
  }

  .contact-icon lord-icon {
    display: block;
  }

  .newsletter-icon {
    opacity: 0.82;
  }

  .contact-card-content {
    position: relative;
    z-index: 4;
    width: 100%;
    max-width: none;
    padding: 0;
    margin: 0;
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
    text-decoration: none;
    transition: opacity 0.24s ease;
  }

  .contact-card-content a:hover,
  .contact-card-content a:focus {
    opacity: 0.55;
    text-decoration: none;
  }

  .lowercase-contact-link {
    display: inline;
    color: #000000;
    font-size: inherit;
    line-height: 1.4;
    text-transform: lowercase;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-decoration: none;
  }

  .address-link {
    display: inline;
    color: #000000;
    text-transform: uppercase;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-decoration: none;
  }

  .newsletter-input-row {
    width: 100%;
    max-width: none;
    margin-top: 18px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0;
    background: #f2f2f2;
  }

  .newsletter-input-row input {
    width: 100%;
    padding: 12px 12px;
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
    padding: 12px 14px;
    border: 0;
    background: transparent;
    color: #000000;
    font-size: 12px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.24s ease;
  }

  .newsletter-input-row button:hover,
  .newsletter-input-row button:focus {
    opacity: 0.55;
    text-decoration: none;
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

  @media (min-width: 1440px) {
    .contact-page {
      padding-right: 72px;
    }

    .contact-layout {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: clamp(32px, 3.4vw, 64px);
    }

    .contact-grid {
      column-gap: clamp(64px, 5.8vw, 128px);
      row-gap: clamp(32px, 3.2vh, 52px);
    }
  }

  @media (min-width: 1680px) {
    .contact-page {
      padding-right: 76px;
    }

    .contact-layout {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 72px;
    }

    .contact-grid {
      column-gap: 140px;
      row-gap: 54px;
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
      --contact-card-height: clamp(165px, 19vh, 210px);

      padding: 96px 72px 90px 28px;
    }

    .contact-layout {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 32px;
    }

    .contact-grid {
      column-gap: 42px;
      row-gap: 28px;
    }

    .contact-preview h1 {
      max-width: 280px;
      font-size: clamp(19px, calc(0.95vw + 6px), 21px);
    }
  }

  @media (max-width: 1024px) {
    .contact-page {
      --contact-card-height: 188px;

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
      max-height: none;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: var(--contact-card-height);
      align-content: start;
      column-gap: 18px;
      row-gap: 18px;
      padding: 10px 0 calc(120px + env(safe-area-inset-bottom));
      scrollbar-width: none;
      scrollbar-color: transparent transparent;
      -ms-overflow-style: none;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }

    .contact-card {
      justify-content: flex-end;
      padding: 26px 0 18px;
      background: transparent;
      border-bottom: 1px solid rgba(0, 0, 0, 0.42);
      overflow: visible;
    }

    .card-number {
      top: 2px;
      left: 0;
      font-size: 10px;
    }

    .contact-icon {
      top: 0;
      right: 0;
      width: 56px;
      height: 56px;
    }

    .contact-icon lord-icon {
      width: 56px !important;
      height: 56px !important;
    }

    .contact-card-content {
      padding: 0;
      margin: 0;
    }

    .contact-card-content strong {
      font-size: 12px;
    }

    .contact-card-content p {
      font-size: 12px;
      line-height: 1.34;
    }

    .lowercase-contact-link,
    .address-link {
      font-size: 11px;
      line-height: 1.45;
    }

    .newsletter-input-row {
      margin-top: 16px;
    }
  }

  @media (max-width: 700px) {
    .contact-page {
      --contact-card-height: 176px;

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
      column-gap: 14px;
      row-gap: 16px;
      padding: 10px 0 calc(120px + env(safe-area-inset-bottom));
    }

    .contact-card {
      padding: 24px 0 16px;
      background: transparent;
      border-bottom: 1px solid rgba(0, 0, 0, 0.42);
      overflow: visible;
    }

    .card-number {
      top: 2px;
      left: 0;
      font-size: 10px;
    }

    .contact-icon {
      top: 0;
      right: 0;
      width: 48px;
      height: 48px;
    }

    .contact-icon lord-icon {
      width: 48px !important;
      height: 48px !important;
    }

    .contact-card-content {
      padding: 0;
      margin: 0;
    }

    .contact-card-content strong {
      margin-bottom: 7px;
      font-size: 11px;
    }

    .contact-card-content p {
      font-size: 11px;
      line-height: 1.35;
    }

    .lowercase-contact-link,
    .address-link {
      font-size: 10px;
      line-height: 1.5;
    }

    .newsletter-input-row {
      grid-template-columns: 1fr;
      gap: 0;
      margin-top: 14px;
      background: #f2f2f2;
    }

    .newsletter-input-row input {
      padding: 10px 10px;
      border: 0;
      font-size: 11px;
    }

    .newsletter-input-row button {
      width: fit-content;
      padding: 8px 10px 10px;
      font-size: 11px;
      text-decoration: none;
    }

    .newsletter-message {
      margin-top: 8px;
      font-size: 10px;
    }
  }

  @media (max-width: 420px) {
    .contact-page {
      --contact-card-height: 164px;
      padding-top: 84px;
    }

    .contact-top {
      margin-bottom: 14px;
    }

    .contact-top-text {
      font-size: 16px;
    }

    .contact-grid {
      column-gap: 12px;
      row-gap: 14px;
    }

    .contact-card {
      padding: 23px 0 15px;
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
      padding: 0;
      margin: 0;
    }

    .contact-card-content p {
      font-size: 10px;
      line-height: 1.35;
    }

    .lowercase-contact-link,
    .address-link {
      font-size: 9px;
      line-height: 1.55;
    }
  }
</style>
