<script>
  let { data } = $props();

  let posts = $derived(data.posts || []);
  let activePostId = $state(null);
  let menuOpen = $state(false);

  const menuItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Paintings",
      href: "/painting",
    },
    {
      label: "Exhibitions",
      href: "/exhibitions",
    },
    {
      label: "Events",
      href: "/event",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  let activePost = $derived(
    posts.find((post) => post.id === activePostId) || posts[0],
  );

  let menuImages = $derived(() => {
    const images = [];

    posts.forEach((post) => {
      if (post.featuredImage && images.length < 10) {
        images.push(post.featuredImage);
      }
    });

    return images;
  });

  function cleanText(value) {
    return value || "";
  }

  function selectPost(post) {
    activePostId = post.id;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<svelte:head>
  <title>Archive | Eva Eichinger</title>

  <meta
    name="description"
    content="Archive of selected posts and works by Eva Eichinger."
  />
</svelte:head>

<main class="archive-page" class:menu-is-open={menuOpen}>
  <button
    class="archive-menu-button"
    type="button"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    onclick={toggleMenu}
  >
    {menuOpen ? "Close" : "Menu"}
  </button>

  <section class="archive-hero" aria-label="Archive">
    <div class="archive-logo-text">Eva Eichinger</div>
    <div class="archive-page-label">Archive</div>

    <div class="archive-center-title">
      <span>COLLECTION OF MY WORKS</span>
      <strong>{cleanText(activePost?.title) || "ARCHIVE"}</strong>
    </div>

    {#if activePost?.featuredImage}
      <div class="active-image-preview">
        <img src={activePost.featuredImage} alt={cleanText(activePost.title)} />
      </div>
    {/if}

    {#if posts.length > 0}
      <div class="archive-items">
        {#each posts.slice(0, 10) as post, index}
          <a
            href={post.frontendLink}
            class={`archive-item archive-position-${index + 1}`}
            class:active={activePost?.id === post.id}
            onmouseenter={() => selectPost(post)}
            onfocus={() => selectPost(post)}
          >
            <span>{post.number || String(index + 1).padStart(2, "0")}</span>

            <strong>{cleanText(post.title)}</strong>

            <p>{cleanText(post.excerpt || post.content)}</p>
          </a>
        {/each}
      </div>
    {:else}
      <p class="empty-message">No archive posts found.</p>
    {/if}
  </section>

  {#if menuOpen}
    <section class="archive-menu-overlay" aria-label="Archive menu">
      <div class="desktop-menu-brand">Eva Eichinger</div>

      <div class="desktop-menu-images" aria-hidden="true">
        {#if menuImages().length > 0}
          {#each menuImages() as image}
            <div class="desktop-menu-image">
              <img src={image} alt="" loading="lazy" />
            </div>
          {/each}
        {/if}
      </div>

      <nav class="menu-links-area" aria-label="Main navigation">
        <div class="menu-grid">
          {#each menuItems as item}
            <a href={item.href} class="main-menu-link" onclick={closeMenu}>
              {item.label}
            </a>
          {/each}
        </div>

        <div class="desktop-social-links">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            Linkedin
          </a>

          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </nav>

      <div class="desktop-menu-rights">All rights reserved ©Eva Eichinger</div>
    </section>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
    background: #000000;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .archive-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #000000;
    color: #ffffff;
    padding: 0;
  }

  .archive-menu-button {
    position: fixed;
    top: 50%;
    right: 28px;
    z-index: 120;
    padding: 0;
    border: 0;
    background: transparent;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
    cursor: pointer;
    transform: translateY(-50%);
    transition: opacity 0.25s ease;
  }

  .archive-menu-button:hover {
    opacity: 0.6;
  }

  .archive-hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background: #000000;
  }

  .archive-logo-text {
    position: fixed;
    top: 32px;
    left: 28px;
    z-index: 70;
    color: rgba(255, 255, 255, 0.22);
    font-family: Arial, Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .archive-page-label {
    position: fixed;
    top: 32px;
    right: 28px;
    z-index: 70;
    color: rgba(255, 255, 255, 0.62);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
  }

  .menu-is-open .archive-page-label,
  .menu-is-open .archive-logo-text {
    display: none;
  }

  .archive-center-title {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 5;
    width: min(560px, 52vw);
    color: #ffffff;
    text-align: center;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .archive-center-title span {
    display: block;
    font-size: 12px;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.075em;
    text-transform: uppercase;
    padding-bottom: 10px;
  }

  .archive-center-title strong {
    display: block;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 40px;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.075em;
    text-transform: uppercase;
  }

  .archive-items {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 78px 120px 150px 28px;
  }

  .archive-item {
    position: absolute;
    z-index: 4;
    width: min(330px, 21vw);
    min-height: 80px;
    padding-left: 14px;
    border-left: 1px solid rgba(255, 255, 255, 0.24);
    color: rgba(255, 255, 255, 0.28);
    text-decoration: none;
    transition:
      color 0.3s ease,
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .archive-item:hover,
  .archive-item:focus,
  .archive-item.active {
    color: rgba(255, 255, 255, 0.82);
    transform: translateX(6px);
  }

  .archive-item strong {
    display: block;
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.15;
    text-transform: uppercase;
    color: inherit;
  }

  .archive-item span {
    display: block;
    margin: 0 0 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    color: inherit;
  }

  .archive-item p {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: inherit;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.15;
    text-transform: uppercase;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  .archive-position-1 {
    top: 8vh;
    left: 41vw;
  }

  .archive-position-2 {
    top: 8vh;
    left: 73vw;
  }

  .archive-position-3 {
    top: 27vh;
    left: 21vw;
  }

  .archive-position-4 {
    top: 27vh;
    left: 58vw;
  }

  .archive-position-5 {
    top: 46vh;
    left: 28px;
  }

  .archive-position-6 {
    top: 46vh;
    left: 65vw;
  }

  .archive-position-7 {
    top: 66vh;
    left: 55vw;
  }

  .archive-position-8 {
    top: 66vh;
    left: 77vw;
  }

  .archive-position-9 {
    top: 84vh;
    left: 30vw;
  }

  .archive-position-10 {
    top: 84vh;
    left: 58vw;
  }

  .active-image-preview {
    position: fixed;
    left: 28px;
    bottom: 34px;
    z-index: 6;
    width: 335px;
    height: 225px;
    overflow: hidden;
    background: #111111;
    opacity: 0.98;
  }

  .active-image-preview img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  .empty-message {
    position: fixed;
    left: 50%;
    top: 50%;
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    transform: translate(-50%, -50%);
  }

  .archive-menu-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: #000000;
    color: #ffffff;
  }

  .desktop-menu-brand {
    position: absolute;
    left: 28px;
    bottom: 45%;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: clamp(30px, 3vw, 44px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.055em;
  }

  .desktop-menu-images {
    position: absolute;
    top: 0;
    left: 30vw;
    width: 160px;
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .desktop-menu-images::-webkit-scrollbar {
    display: none;
  }

  .desktop-menu-image {
    width: 100%;
    height: 230px;
    margin-bottom: 8px;
    overflow: hidden;
    background: #222222;
  }

  .desktop-menu-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    filter: grayscale(100%);
    opacity: 0.82;
  }

  .menu-links-area {
    position: absolute;
    left: 50vw;
    top: 50%;
    z-index: 110;
    transform: translateY(-50%);
  }

  .menu-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .main-menu-link {
    display: inline-block;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: clamp(48px, 4.2vw, 76px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.075em;
    text-decoration: none;
    text-transform: none;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .main-menu-link:hover,
  .main-menu-link:focus {
    opacity: 0.6;
    transform: translateX(8px);
  }

  .desktop-social-links {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 72px;
  }

  .desktop-social-links a {
    width: fit-content;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 0.95;
    text-decoration: none;
    text-transform: uppercase;
  }

  .desktop-menu-rights {
    position: absolute;
    right: 28px;
    bottom: 28px;
    color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }

  @media (max-width: 1200px) {
    .archive-item {
      width: min(280px, 23vw);
    }

    .archive-item p {
      font-size: 14px;
    }

    .active-image-preview {
      width: 300px;
      height: 202px;
    }
  }

  @media (max-width: 1024px) {
    .archive-page-label,
    .archive-logo-text {
      display: none;
    }

    .archive-menu-button {
      top: 22px;
      right: 24px;
      transform: none;
    }

    .archive-hero {
      overflow: visible;
    }

    .archive-center-title {
      position: relative;
      left: auto;
      top: auto;
      width: 100%;
      padding: 130px 24px 40px;
      transform: none;
    }

    .archive-center-title span,
    .archive-center-title strong {
      font-size: clamp(28px, 8vw, 52px);
    }

    .archive-items {
      min-height: auto;
      padding: 40px 24px 120px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 26px;
    }

    .archive-item {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      width: 100%;
      margin: 0;
    }

    .active-image-preview {
      position: relative;
      left: auto;
      bottom: auto;
      width: calc(100% - 48px);
      height: 280px;
      margin: 0 24px 34px;
    }

    .archive-menu-overlay {
      overflow-y: auto;
      padding: 120px 24px 40px;
    }

    .desktop-menu-brand,
    .desktop-menu-images,
    .desktop-menu-rights,
    .desktop-social-links {
      display: none;
    }

    .menu-links-area {
      position: static;
      transform: none;
    }

    .menu-grid {
      gap: 26px;
    }

    .main-menu-link {
      color: #ffffff;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.25rem;
      font-weight: 300;
      line-height: 1;
      letter-spacing: 0.055em;
      text-transform: uppercase;
    }

    .main-menu-link:hover,
    .main-menu-link:focus {
      opacity: 0.7;
      transform: none;
    }
  }

  @media (max-width: 700px) {
    .archive-center-title {
      padding: 120px 24px 34px;
      text-align: left;
    }

    .archive-center-title span,
    .archive-center-title strong {
      font-size: clamp(30px, 11vw, 54px);
    }

    .archive-items {
      grid-template-columns: 1fr;
      padding: 40px 24px 120px;
    }

    .archive-item p {
      font-size: 15px;
    }

    .active-image-preview {
      height: 240px;
    }
  }
</style>
