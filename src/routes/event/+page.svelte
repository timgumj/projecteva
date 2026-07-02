<script>
  let { data } = $props();

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
</script>

<svelte:head>
  <title>Events | Eva Eichinger</title>
  <meta
    name="description"
    content="Selected events, art fairs and public presentations by Eva Eichinger."
  />
</svelte:head>

<section class="event-page">
  <div class="event-feature">
    <aside class="event-intro-column">
      <div class="event-heading">
        <p class="event-label">Events</p>
        <h1>Upcoming</h1>
      </div>

      <p class="event-intro">
        Selected events, art fairs and public presentations.
      </p>
    </aside>

    <div class="event-list-column">
      {#if data.events?.length > 0}
        <div class="event-grid">
          {#each data.events as event, index}
            <article class="event-card">
              <div class="event-content">
                <div>
                  <span class="event-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div class="event-meta-row">
                    <span class="event-meta-label">Event Date</span>
                    <span class="event-meta-value">
                      {#if event.date}
                        {formatDate(event.date)}
                      {:else}
                        Event
                      {/if}
                    </span>
                  </div>

                  <h2>{event.title}</h2>

                  {#if event.startTime || event.endTime}
                    <div class="event-meta-row">
                      <span class="event-meta-label">Event Time</span>
                      <span class="event-meta-value">
                        {event.startTime}
                        {#if event.endTime}
                          – {event.endTime}
                        {/if}
                      </span>
                    </div>
                  {/if}

                  {#if event.location}
                    <div class="event-meta-row">
                      <span class="event-meta-label">Location</span>
                      <span class="event-meta-value">{event.location}</span>
                    </div>
                  {/if}

                  {#if event.address}
                    <div class="event-meta-row">
                      <span class="event-meta-label">Address</span>
                      <span class="event-meta-value">{event.address}</span>
                    </div>
                  {/if}

                  {#if event.content}
                    <div class="event-text">
                      {@html event.content}
                    </div>
                  {/if}
                </div>

                {#if event.website}
                  <a
                    class="event-link"
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit event website ↗
                  </a>
                {/if}
              </div>
            </article>
          {/each}
        </div>
      {:else}
        <p class="empty-message">No events found.</p>
      {/if}
    </div>
  </div>
</section>

<style>
  :global(:root) {
    --site-font-family: Arial, Helvetica, sans-serif;
  }

  :global(html),
  :global(body),
  .event-page {
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

  .event-page {
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

  .event-feature {
    width: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: clamp(210px, 15vw, 265px) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .event-intro-column {
    width: 100%;
    min-width: 0;
  }

  .event-heading {
    margin: 0 0 42px;
  }

  .event-label {
    margin: 0 0 9px;
    color: #000000;
    font-size: clamp(12px, 0.72vw, 13px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.012em;
  }

  .event-heading h1 {
    max-width: 280px;
    margin: 0;
    color: #000000;
    font-size: clamp(18px, calc(0.78vw + 6px), 20px);
    font-weight: 700;
    line-height: 1.04;
    letter-spacing: 0.005em;
    animation: eventTitleIn 0.46s ease both;
  }

  .event-intro {
    max-width: 265px;
    margin: 0;
    color: #000000;
    font-size: clamp(11px, 0.66vw, 12px);
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: 0.006em;
  }

  .event-list-column {
    width: 100%;
    min-width: 0;
  }

  .event-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: clamp(36px, 5vw, 74px) clamp(22px, 2.6vw, 42px);
    align-items: stretch;
    animation: eventReveal 0.7s ease both;
  }

  .event-card {
    min-width: 0;
    height: 100%;
    background: transparent;
    border-bottom: 1px solid #000000;
  }

  .event-content {
    min-width: 0;
    height: 100%;
    min-height: 360px;
    padding-bottom: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .event-number {
    display: block;
    margin: 0 0 14px;
    color: #000000;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.05em;
    opacity: 0.42;
  }

  .event-meta-row {
    margin: 0 0 8px;
  }

  .event-meta-label {
    display: block;
    margin: 0 0 3px;
    color: #000000;
    font-size: 9px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.06em;
    opacity: 0.46;
  }

  .event-meta-value {
    display: block;
    color: #000000;
    font-size: clamp(10px, 0.62vw, 11px);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: 0.04em;
    opacity: 0.72;
  }

  .event-content h2 {
    margin: 18px 0 18px;
    color: #000000;
    font-size: clamp(16px, 1.25vw, 24px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.01em;
  }

  .event-text {
    margin-top: 20px;
    color: #000000;
    font-size: clamp(11px, 0.72vw, 13px);
    font-weight: 500;
    line-height: 1.42;
    letter-spacing: 0.006em;
    text-transform: none;
  }

  .event-text :global(p) {
    margin: 0 0 13px;
  }

  .event-text :global(p:last-child) {
    margin-bottom: 0;
  }

  .event-text :global(a) {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }

  .event-link {
    width: fit-content;
    display: inline-block;
    margin-top: 12px;
    color: #000000;
    text-decoration: none;
    font-size: clamp(10px, 0.66vw, 12px);
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.012em;
    text-transform: uppercase;
    transition:
      opacity 0.28s ease,
      transform 0.28s ease;
  }

  .event-link:hover,
  .event-link:focus {
    opacity: 0.58;
    transform: translateX(4px);
  }

  .empty-message {
    margin: 0;
    padding: 120px 0;
    color: #000000;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.01em;
  }

  @keyframes eventReveal {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes eventTitleIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (min-width: 1440px) {
    .event-page {
      padding-right: 72px;
    }

    .event-feature {
      grid-template-columns: clamp(210px, 14vw, 255px) minmax(0, 1fr);
      gap: 14px;
    }
  }

  @media (min-width: 1680px) {
    .event-page {
      padding-right: 76px;
    }

    .event-feature {
      grid-template-columns: 250px minmax(0, 1fr);
      gap: 14px;
    }

    .event-intro {
      max-width: 260px;
    }
  }

  @media (max-width: 1280px) {
    .event-page {
      padding: 116px 72px 110px 28px;
    }

    .event-feature {
      grid-template-columns: clamp(210px, 18vw, 250px) minmax(0, 1fr);
      gap: 18px;
    }

    .event-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 46px 28px;
    }

    .event-heading h1 {
      max-width: 280px;
      font-size: clamp(19px, calc(0.95vw + 6px), 21px);
    }
  }

  @media (max-width: 1024px) {
    .event-page {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 118px 24px 96px;
      align-items: flex-start;
      overflow: visible;
    }

    .event-feature {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 44px;
    }

    .event-intro-column {
      width: 100%;
      max-width: none;
    }

    .event-heading {
      margin: 0 0 10px;
    }

    .event-label {
      font-size: 14px;
      line-height: 1;
    }

    .event-heading h1 {
      max-width: 520px;
      font-size: 16px;
      line-height: 1;
    }

    .event-intro {
      max-width: 420px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.16;
    }

    .event-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 42px 18px;
    }

    .event-content {
      min-height: 330px;
      padding-bottom: 22px;
    }

    .event-number {
      margin-bottom: 12px;
    }

    .event-content h2 {
      margin: 16px 0 14px;
      font-size: 18px;
      line-height: 1.04;
    }

    .event-meta-label {
      font-size: 9px;
    }

    .event-meta-value {
      font-size: 11px;
      line-height: 1.18;
    }

    .event-text {
      margin-top: 17px;
      font-size: 12px;
      line-height: 1.34;
    }

    .event-link {
      margin-top: 10px;
      font-size: 11px;
    }
  }

  @media (max-width: 700px) {
    .event-page {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 108px 16px 88px;
    }

    .event-feature {
      gap: 34px;
    }

    .event-heading {
      margin-bottom: 8px;
    }

    .event-label {
      font-size: 12px;
    }

    .event-heading h1 {
      font-size: 14px;
    }

    .event-intro {
      max-width: 320px;
      font-size: 12px;
      line-height: 1.14;
    }

    .event-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 34px 12px;
    }

    .event-content {
      min-height: 300px;
      padding-bottom: 18px;
    }

    .event-number {
      font-size: 10px;
      margin-bottom: 10px;
    }

    .event-meta-label {
      font-size: 8px;
    }

    .event-meta-value {
      font-size: 10px;
      line-height: 1.16;
    }

    .event-content h2 {
      margin: 14px 0 12px;
      font-size: 15px;
      line-height: 1.04;
    }

    .event-text {
      margin-top: 15px;
      font-size: 11px;
      line-height: 1.32;
    }

    .event-link {
      margin-top: 10px;
      font-size: 10px;
    }
  }

  @media (max-width: 420px) {
    .event-grid {
      gap: 32px 10px;
    }

    .event-content {
      min-height: 285px;
    }

    .event-content h2 {
      font-size: 14px;
    }

    .event-text {
      font-size: 10px;
    }
  }
</style>
