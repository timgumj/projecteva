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
  <title>Events</title>
  <meta name="description" content="Events from WordPress" />
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
          {#each data.events as event}
            <article class="event-card">
              {#if event.image}
                <div class="event-image-wrap">
                  <img
                    class="event-image"
                    src={event.image}
                    alt={event.title}
                  />
                </div>
              {/if}

              <div class="event-content">
                <span class="event-date">
                  {#if event.date}
                    {formatDate(event.date)}
                  {:else}
                    Event
                  {/if}
                </span>

                <h2>{event.title}</h2>

                {#if event.startTime || event.endTime}
                  <p class="event-meta">
                    {event.startTime}
                    {#if event.endTime}
                      – {event.endTime}
                    {/if}
                  </p>
                {/if}

                {#if event.location}
                  <p class="event-location">{event.location}</p>
                {/if}

                {#if event.address}
                  <p class="event-address">{event.address}</p>
                {/if}

                {#if event.content}
                  <div class="event-text">
                    {@html event.content}
                  </div>
                {/if}

                {#if event.website}
                  <a
                    class="event-link"
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit event website
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
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    font-family: Georgia, "Times New Roman", serif;
    background: #ffffff;
    color: #4d4a47;
  }

  .event-page {
    width: 100%;
    min-height: 100vh;
    padding: 116px 40px 110px;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .event-feature {
    width: 100%;
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: clamp(34px, 5vw, 82px);
    align-items: start;
  }

  .event-intro-column {
    width: 100%;
    max-width: 220px;
    justify-self: start;
  }

  .event-heading {
    margin-bottom: 34px;
  }

  .event-label {
    margin: 0 0 12px;
    color: #6f8f72;
    font-size: 12px;
    font-weight: 300;
    line-height: 1.15;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .event-heading h1 {
    margin: 0;
    color: #3f3c39;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .event-intro {
    margin: 0;
    color: #8f8883;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.5;
    letter-spacing: 0.06em;
  }

  .event-list-column {
    width: 100%;
    min-width: 0;
  }

  .event-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 34px 26px;
    animation: eventReveal 0.85s ease both;
  }

  .event-card {
    background: transparent;
  }

  .event-image-wrap {
    overflow: hidden;
    background: #f8f6f4;
  }

  .event-image {
    width: 100%;
    aspect-ratio: 4 / 5;
    display: block;
    object-fit: cover;
    object-position: center;
    transition:
      transform 0.45s ease,
      opacity 0.3s ease;
  }

  .event-card:hover .event-image {
    transform: scale(1.025);
    opacity: 0.94;
  }

  .event-content {
    padding-top: 18px;
  }

  .event-date {
    display: block;
    margin-bottom: 10px;
    color: #6f8f72;
    font-size: 11px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .event-content h2 {
    margin: 0 0 14px;
    color: #2f2d2b;
    font-size: 20px;
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .event-meta,
  .event-location,
  .event-address {
    margin: 0 0 8px;
    color: #8f8883;
    font-size: 12px;
    font-weight: 300;
    line-height: 1.45;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .event-location {
    color: #4d4a47;
  }

  .event-text {
    margin-top: 18px;
    color: #6f6b68;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.65;
    letter-spacing: 0.025em;
  }

  .event-text :global(p) {
    margin: 0 0 14px;
  }

  .event-text :global(a) {
    color: #6f8f72;
    text-decoration: none;
    border-bottom: 1px solid currentColor;
  }

  .event-link {
    width: fit-content;
    display: inline-block;
    margin-top: 18px;
    color: #6f8f72;
    text-decoration: none;
    font-size: 12px;
    font-weight: 300;
    line-height: 1.35;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition:
      color 0.3s ease,
      opacity 0.3s ease;
  }

  .event-link::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    margin-top: 5px;
    background: currentColor;
    opacity: 0.9;
  }

  .event-link:hover,
  .event-link:focus {
    color: #4d704f;
    opacity: 0.8;
  }

  .empty-message {
    margin: 0;
    color: #6f6b68;
    font-size: 14px;
  }

  @keyframes eventReveal {
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
    .event-page {
      padding: 120px 40px 100px;
    }

    .event-feature {
      grid-template-columns: 190px minmax(0, 1fr);
      gap: 34px;
    }

    .event-intro-column {
      max-width: 190px;
    }

    .event-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px 22px;
    }
  }

  @media (max-width: 700px) {
    .event-page {
      min-height: 100vh;
      padding: 118px 24px 110px;
      align-items: flex-start;
    }

    .event-feature {
      display: grid;
      grid-template-columns: 1fr;
      gap: 34px;
      align-items: stretch;
    }

    .event-intro-column {
      max-width: none;
    }

    .event-heading {
      margin-bottom: 18px;
    }

    .event-label {
      font-size: 12px;
    }

    .event-heading h1 {
      font-size: 20px;
    }

    .event-intro {
      max-width: 320px;
      font-size: 13px;
    }

    .event-grid {
      grid-template-columns: 1fr;
      gap: 38px;
    }

    .event-content h2 {
      font-size: 19px;
    }

    .event-image {
      aspect-ratio: 4 / 5;
    }
  }
</style>
