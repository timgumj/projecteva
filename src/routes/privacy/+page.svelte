<svelte:head>
  <title>Privacy Policy | Eva Eichinger</title>
  <meta
    name="description"
    content="Privacy policy and imprint information for Eva Eichinger."
  />
</svelte:head>

<section class="privacy-page">
  <div class="privacy-feature">
    <aside class="privacy-intro-column">
      <div class="privacy-heading">
        <p class="privacy-label">Privacy</p>
        <h1>Privacy Policy</h1>
      </div>
    </aside>

    <div class="privacy-content-column">
      <div class="privacy-section">
        <h2>Privacy Policy</h2>
        <p>
          /// The protection of your personal data is important. This section
          contains information about the types of personal data which is
          collected via this website. Your data is processed in compliance with
          applicable data protection laws and regulations (GDPR, Data Protection
          Amendment Bill, Telecommunications Act 2003). Changes to this privacy
          policy may occur from time to time and we advise you to periodically
          visit this section.
        </p>
      </div>

      <div class="privacy-section">
        <h2>Contact</h2>
        <p>
          /// If you contact me via e-mail, your personal data is stored for a
          period of 6 months for the purpose of processing your request and a
          possible follow-up communication. Your data is not transmitted to
          third parties without your consent.
        </p>
      </div>

      <div class="privacy-section">
        <h2>Data Collection</h2>
        <p>
          /// Your personal data is processed on the basis of a legitimate
          interest. You have freely provided us with your personal data on the
          basis of your consent. You can withdraw your consent at any time. Upon
          your notice of withdrawal, we will stop processing your personal data.
          To withdraw your consent, please contact: info(at)evaeichinger.com.
        </p>
      </div>

      <div class="privacy-section">
        <h2>Processing Data</h2>
        <p>
          /// Data is processed by third parties (processors), e.g. mail
          services, web hosts & analytics. These processors are obligated to
          protect your personal data and are not authorized to process your
          personal data for any other purpose than the provision of our
          services. Processors are Cargo Collective (web host) and Google (web
          analytics).
        </p>
      </div>

      <div class="privacy-section">
        <h2>Cookies</h2>
        <p>
          /// This website uses cookies. You can deactivate cookies in your
          browser. However, if you do this certain features of our online
          service may not work properly.
        </p>
      </div>

      <div class="privacy-section">
        <h2>Imprint</h2>
        <p>
          /// Mag.art. Eva Eichinger, info(at)evaeichinger.com, Westbahnstraße
          27-29, 1070 Wien /// page by unspecified.design
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  :global(:root) {
    --site-font-family: Arial, Helvetica, sans-serif;
  }

  :global(html),
  :global(body),
  .privacy-page {
    font-family: var(--site-font-family);
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

  .privacy-page {
    width: 100%;
    min-height: 100vh;
    padding: 116px 72px 110px 28px;
    background: #ffffff;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-x: hidden;
    text-transform: uppercase;
  }

  .privacy-feature {
    width: 100%;
    display: grid;
    grid-template-columns: clamp(210px, 15vw, 265px) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .privacy-intro-column,
  .privacy-content-column {
    width: 100%;
    min-width: 0;
  }

  .privacy-heading {
    margin: 0;
  }

  .privacy-label {
    margin: 0 0 9px;
    color: #000000;
    font-size: clamp(12px, 0.72vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .privacy-heading h1 {
    max-width: 280px;
    margin: 0;
    color: #000000;
    font-size: clamp(18px, calc(0.78vw + 6px), 20px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
  }

  .privacy-content-column {
    max-width: 980px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 46px 42px;
  }

  .privacy-section {
    min-height: 230px;
    padding-bottom: 24px;
    border-bottom: 1px solid #000000;
  }

  .privacy-section h2 {
    margin: 0 0 18px;
    color: #000000;
    font-size: clamp(16px, 1.25vw, 24px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.01em;
  }

  .privacy-section p {
    margin: 0;
    color: #000000;
    font-size: clamp(11px, 0.72vw, 13px);
    font-weight: 500;
    line-height: 1.42;
    letter-spacing: 0.006em;
  }

  @media (max-width: 1280px) {
    .privacy-page {
      padding: 116px 72px 110px 28px;
    }

    .privacy-feature {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .privacy-content-column {
      gap: 42px 28px;
    }
  }

  @media (max-width: 1024px) {
    .privacy-page {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 118px 24px 96px;
      overflow: visible;
    }

    .privacy-feature {
      display: flex;
      flex-direction: column;
      gap: 44px;
    }

    .privacy-label {
      font-size: 14px;
    }

    .privacy-heading h1 {
      max-width: 520px;
      font-size: 16px;
      line-height: 1;
    }

    .privacy-content-column {
      max-width: none;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 42px 18px;
    }

    .privacy-section {
      min-height: 240px;
      padding-bottom: 22px;
    }

    .privacy-section h2 {
      font-size: 18px;
      line-height: 1.04;
    }

    .privacy-section p {
      font-size: 12px;
      line-height: 1.34;
    }
  }

  @media (max-width: 700px) {
    .privacy-page {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 108px 16px 88px;
    }

    .privacy-feature {
      gap: 34px;
    }

    .privacy-label {
      font-size: 12px;
    }

    .privacy-heading h1 {
      font-size: 14px;
    }

    .privacy-content-column {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 34px 12px;
    }

    .privacy-section {
      min-height: 250px;
      padding-bottom: 18px;
    }

    .privacy-section h2 {
      margin-bottom: 12px;
      font-size: 15px;
      line-height: 1.04;
    }

    .privacy-section p {
      font-size: 11px;
      line-height: 1.32;
    }
  }

  @media (max-width: 420px) {
    .privacy-content-column {
      gap: 32px 10px;
    }

    .privacy-section h2 {
      font-size: 14px;
    }

    .privacy-section p {
      font-size: 10px;
    }
  }
</style>
