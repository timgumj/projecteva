<script>
  let { data } = $props();

  let posts = $derived(data.posts || []);
  let activePostId = $state(null);
  let menuOpen = $state(false);

  const archiveCategoryColors = {
    painting: "#ff5c01",
    exhibitions: "#24d480",
    performances: "#ab9bf2",
  };

  const archiveCategoryKey = [
    {
      label: "Paintings",
      color: "#ff5c01",
    },
    {
      label: "Exhibitions",
      color: "#24d480",
    },
    {
      label: "Performances",
      color: "#ab9bf2",
    },
  ];

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Paintings", href: "/painting" },
    { label: "Exhibitions", href: "/exhibitions" },
    { label: "Performances", href: "/performances" },
    { label: "Events", href: "/event" },
    { label: "Contact", href: "/contact" },
    { label: "Archive", href: "/archive" },
  ];

  let activePost = $derived(
    posts.find((post) => post.id === activePostId) || null,
  );

  let activePostTitleColor = $derived(getArchiveTitleColor(activePost));

  let archiveCenterTitle = $derived(
    activePost ? cleanText(activePost?.title) : "VIEW ALL MY WORKS",
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

  function slugify(value = "") {
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getPostCategorySlug(post) {
    const raw =
      post?.categorySlug ||
      post?.category ||
      post?.groupSlug ||
      post?.group ||
      post?.type ||
      post?.postType ||
      "";

    const slug = slugify(raw);

    if (slug === "painting" || slug === "paintings") return "painting";
    if (slug === "exhibition" || slug === "exhibitions") return "exhibitions";
    if (slug === "event" || slug === "events") return "event";
    if (slug === "performance" || slug === "performances")
      return "performances";

    return slug;
  }

  function getArchiveTitleColor(post) {
    const categorySlug = getPostCategorySlug(post);

    return archiveCategoryColors[categorySlug] || "#ffffff";
  }

  function getArchivePostLink(post) {
    const categorySlug = getPostCategorySlug(post);

    if (categorySlug === "painting") {
      return `/painting?post=${post.id}`;
    }

    if (categorySlug === "exhibitions") {
      return `/exhibitions?post=${post.id}`;
    }

    if (categorySlug === "event") {
      return `/event?post=${post.id}`;
    }

    if (categorySlug === "performances") {
      return `/performances?post=${post.id}`;
    }

    if (post.frontendLink && post.frontendLink !== "#") {
      return post.frontendLink;
    }

    return `/archive?post=${post.id}`;
  }

  function canUseDesktopHover() {
    if (typeof window === "undefined") return false;

    return window.matchMedia("(min-width: 1025px)").matches;
  }

  function selectPost(post) {
    if (!canUseDesktopHover()) return;

    activePostId = post.id;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  $effect(() => {
    if (typeof document === "undefined") return;

    if (menuOpen) {
      document.documentElement.classList.add("menu-open-lock");
      document.body.classList.add("menu-open-lock");
    } else {
      document.documentElement.classList.remove("menu-open-lock");
      document.body.classList.remove("menu-open-lock");
    }

    return () => {
      document.documentElement.classList.remove("menu-open-lock");
      document.body.classList.remove("menu-open-lock");
    };
  });
</script>

<svelte:head>
  <title>Archive | Eva Eichinger</title>

  <meta
    name="description"
    content="Archive of selected posts and works by Eva Eichinger."
  />
</svelte:head>

<main class="archive-page" class:menu-is-open={menuOpen}>
  <header class="archive-header" class:menu-is-open={menuOpen}>
    <a href="/" class="logo" onclick={closeMenu}>Eva Eichinger</a>

    <div class="desktop-page-label">Archive</div>

    <button
      class="desktop-menu-control"
      type="button"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onclick={toggleMenu}
    >
      <span class="desktop-menu-control-text">
        {menuOpen ? "Close" : "Menu"}
      </span>

      <span class="desktop-menu-control-icon" aria-hidden="true">
        <span></span>
        <span></span>
      </span>
    </button>

    <a href="/archive" class="desktop-archive-fixed" onclick={closeMenu}>
      BIBLO
    </a>

    <button
      class="menu-toggle"
      type="button"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onclick={toggleMenu}
    >
      <span></span>
      <span></span>
    </button>

    <nav class:open={menuOpen} class="main-nav" aria-label="Main navigation">
      <div class="desktop-menu-brand-block">
        <div class="desktop-menu-brand">Eva Eichinger</div>

        <div class="desktop-menu-address">
          <address>
            Westbahnstraße 27-29<br />
            1070 Vienna
          </address>

          <a href="mailto:info@evaeichinger.com">
            Email: info@evaeichinger.com
          </a>
        </div>
      </div>

      <div class="desktop-menu-images" aria-hidden="true">
        {#if menuImages().length > 0}
          {#each menuImages() as image}
            <div class="desktop-menu-image">
              <img src={image} alt="" loading="lazy" />
            </div>
          {/each}
        {/if}
      </div>

      <div class="menu-links-area">
        <div class="menu-grid">
          {#each menuItems as item}
            <div class="menu-grid-item">
              <a href={item.href} class="main-menu-link" onclick={closeMenu}>
                {item.label}
              </a>
            </div>
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
      </div>

      <div class="desktop-menu-credit">Website by Zora Web Design</div>

      <div class="desktop-menu-rights">All rights reserved ©Eva Eichinger</div>

      <div class="mobile-menu-extra">
        <div class="mobile-social-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            Facebook
          </a>

          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>

          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>

        <div class="mobile-contact-info">
          <p>Contact</p>

          <a href="mailto:info@evaeichinger.com">
            Email: info@evaeichinger.com
          </a>

          <address>
            Westbahnstraße 27-29<br />
            1070 Vienna
          </address>
        </div>
      </div>

      <div class="mobile-design-credit">Designed by zoraDesign</div>
    </nav>
  </header>

  <section class="archive-hero" aria-label="Archive">
    <div class="archive-fixed-top">
      <div
        class="archive-center-title"
        class:has-active-post={activePost}
        style={`--archive-title-color: ${activePost ? activePostTitleColor : "#ffffff"};`}
      >
        <span>COLLECTION OF MY WORKS</span>

        <strong>{archiveCenterTitle}</strong>

        <div class="archive-category-key" aria-label="Archive category key">
          {#each archiveCategoryKey as item}
            <div class="archive-key-item">
              <span
                class="archive-key-square"
                style={`--key-color: ${item.color};`}
              ></span>

              <span class="archive-key-label">{item.label}</span>
            </div>
          {/each}
        </div>
      </div>

      {#if activePost?.featuredImage}
        <div class="active-image-preview">
          <img
            src={activePost.featuredImage}
            alt={cleanText(activePost.title)}
          />
        </div>
      {/if}
    </div>

    {#if posts.length > 0}
      <div class="archive-items">
        {#each posts.slice(0, 10) as post, index}
          <a
            href={getArchivePostLink(post)}
            class={`archive-item archive-position-${index + 1}`}
            class:active={activePost?.id === post.id}
            style={`--archive-title-color: ${getArchiveTitleColor(post)};`}
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
</main>

<style>
  :global(:root) {
    --site-font-family: Arial, Helvetica, sans-serif;
  }

  :global(body) {
    margin: 0;
    overflow-x: hidden;
    background: #000000;
    color: #ffffff;
    font-family: var(--site-font-family);
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(html.menu-open-lock),
  :global(body.menu-open-lock) {
    overflow: hidden;
    height: 100%;
    touch-action: none;
  }

  .archive-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #000000;
    color: #ffffff;
    padding: 0;
  }

  .archive-header,
  .archive-header *,
  .main-nav,
  .main-nav * {
    font-family: var(--site-font-family);
  }

  .archive-header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 100;
    width: 100%;
    pointer-events: none;
  }

  .logo {
    position: fixed;
    top: 32px;
    left: 28px;
    z-index: 105;
    color: #ffffff;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    pointer-events: auto;
    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .logo:hover {
    opacity: 0.7;
  }

  .desktop-page-label {
    position: fixed;
    top: 32px;
    right: 28px;
    z-index: 105;
    color: #ffffff;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    pointer-events: none;
  }

  .desktop-menu-control {
    position: fixed;
    top: 50%;
    right: 28px;
    z-index: 105;
    display: flex;
    width: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #ffffff;
    cursor: pointer;
    pointer-events: auto;
    transform: translateY(-50%);
  }

  .desktop-menu-control-text {
    color: currentColor;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .desktop-menu-control-icon {
    position: relative;
    display: flex;
    width: 34px;
    height: 16px;
    flex-direction: column;
    justify-content: space-between;
  }

  .desktop-menu-control-icon span {
    display: block;
    width: 100%;
    height: 1px;
    background: currentColor;
    transition:
      transform 0.25s ease,
      background 0.25s ease;
  }

  .desktop-menu-control[aria-expanded="true"] {
    color: #ffffff;
  }

  .desktop-menu-control[aria-expanded="true"]
    .desktop-menu-control-icon
    span:nth-child(1) {
    transform: translateY(7.5px) rotate(45deg);
  }

  .desktop-menu-control[aria-expanded="true"]
    .desktop-menu-control-icon
    span:nth-child(2) {
    transform: translateY(-7.5px) rotate(-45deg);
  }

  .desktop-archive-fixed {
    position: fixed;
    right: 28px;
    bottom: 120px;
    z-index: 105;
    color: #ffffff;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    pointer-events: auto;
    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .archive-header.menu-is-open .desktop-page-label,
  .archive-header.menu-is-open .desktop-archive-fixed,
  .archive-header.menu-is-open .logo {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .menu-toggle {
    display: none;
  }

  .main-nav {
    position: fixed;
    inset: 0;
    z-index: 103;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: #000000;
    color: #ffffff;
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
    transition:
      transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
      opacity 0.4s ease;
  }

  .main-nav.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .desktop-menu-brand-block {
    position: absolute;
    left: 28px;
    bottom: 45%;
    color: #ffffff;
  }

  .desktop-menu-brand {
    color: #ffffff;
    font-size: clamp(30px, 3vw, 44px);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.055em;
  }

  .desktop-menu-address {
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 13px;
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: -0.02em;
  }

  .desktop-menu-address address {
    margin: 0 0 7px;
    font-style: normal;
  }

  .desktop-menu-address a {
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
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
    transform: translateY(-50%);
  }

  .menu-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .menu-grid-item {
    margin: 0;
    padding: 0;
  }

  .main-nav a {
    color: #ffffff;
    text-decoration: none;
  }

  .main-menu-link {
    display: inline-block;
    color: #ffffff;
    font-size: clamp(48px, 4.2vw, 76px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.022em;
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
    font-size: 15px;
    font-weight: 900;
    line-height: 0.95;
    text-transform: uppercase;
  }

  .desktop-menu-credit {
    position: absolute;
    left: 28px;
    bottom: 28px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }

  .desktop-menu-rights {
    position: absolute;
    right: 28px;
    bottom: 28px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }

  .mobile-menu-extra,
  .mobile-design-credit {
    display: none;
  }

  .archive-hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background: #000000;
  }

  .archive-center-title {
    --archive-title-color: #ffffff;

    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 5;
    width: min(620px, 56vw);
    color: #ffffff;
    text-align: center;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .archive-center-title > span {
    display: block;
    padding-bottom: 10px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.075em;
    text-transform: uppercase;
  }

  .archive-center-title strong {
    display: block;
    color: var(--archive-title-color);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 40px;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.075em;
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  .archive-center-title:not(.has-active-post) strong {
    color: #ffffff;
  }

  .archive-category-key {
    width: 100%;
    margin: 18px auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: rgba(255, 255, 255, 0.74);
  }

  .archive-key-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
  }

  .archive-key-square {
    width: 8px;
    height: 8px;
    display: block;
    background: var(--key-color);
    flex: 0 0 8px;
  }

  .archive-key-label {
    display: block;
    padding: 0;
    color: rgba(255, 255, 255, 0.78);
    font-size: 10px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .archive-items {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 78px 120px 150px 28px;
  }

  .archive-item {
    --archive-title-color: #ffffff;

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
      opacity 0.3s ease;
  }

  .archive-item:hover,
  .archive-item:focus,
  .archive-item.active {
    color: rgba(255, 255, 255, 0.82);
  }

  .archive-item strong {
    display: block;
    margin: 0 0 6px;
    color: var(--archive-title-color);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.15;
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  .archive-item:hover strong,
  .archive-item:focus strong,
  .archive-item.active strong {
    color: var(--archive-title-color);
  }

  .archive-item span {
    display: block;
    margin: 0 0 6px;
    color: inherit;
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
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

  @media (max-width: 1024px) {
    :global(html),
    :global(body) {
      height: 100%;
      overflow: hidden;
    }

    .archive-page {
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    .logo {
      top: 20px;
      left: 24px;
      color: #ffffff;
      font-size: 1.45rem;
      font-weight: 700;
      letter-spacing: 0.055em;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-transform: uppercase;
      text-underline-offset: 7px;
    }

    .desktop-page-label,
    .desktop-menu-control,
    .desktop-archive-fixed,
    .desktop-menu-brand-block,
    .desktop-menu-images,
    .desktop-social-links,
    .desktop-menu-rights,
    .desktop-menu-credit {
      display: none;
    }

    .archive-header.menu-is-open .logo {
      color: #ffffff;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .menu-toggle {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 105;
      display: flex;
      width: 38px;
      height: 16px;
      padding: 0;
      border: none;
      background: transparent;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      pointer-events: auto;
    }

    .menu-toggle span {
      display: block;
      width: 100%;
      height: 1px;
      background: #ffffff;
      transition:
        transform 0.25s ease,
        background 0.25s ease;
    }

    .menu-toggle[aria-expanded="true"] span {
      background: #ffffff;
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(1) {
      transform: translateY(7.5px) rotate(45deg);
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(2) {
      transform: translateY(-7.5px) rotate(-45deg);
    }

    .archive-hero {
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    .archive-fixed-top {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 20;
      background: #000000;
    }

    .archive-center-title {
      position: fixed;
      left: 24px;
      top: 118px;
      width: calc(100% - 48px);
      text-align: left;
      transform: none;
    }

    .archive-center-title > span {
      padding-bottom: 8px;
      font-size: 12px;
      line-height: 1;
      letter-spacing: 0;
    }

    .archive-center-title strong {
      font-size: clamp(18px, 3.2vw, 25px);
      line-height: 1;
      letter-spacing: -0.055em;
    }

    .archive-category-key {
      display: none;
    }

    .active-image-preview {
      position: fixed;
      top: 182px;
      left: 24px;
      bottom: auto;
      width: calc(100% - 48px);
      height: 280px;
      margin: 0;
    }

    .archive-items {
      position: fixed;
      top: 500px;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 44px;
      padding: 0 24px calc(100px + env(safe-area-inset-bottom));
      scrollbar-width: none;
      -ms-overflow-style: none;
      overscroll-behavior: contain;
    }

    .archive-items::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .archive-item,
    .archive-position-1,
    .archive-position-2,
    .archive-position-3,
    .archive-position-4,
    .archive-position-5,
    .archive-position-6,
    .archive-position-7,
    .archive-position-8,
    .archive-position-9,
    .archive-position-10 {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      width: 100%;
      min-height: auto;
      margin: 0;
    }

    .archive-item {
      display: block;
      padding-left: 18px;
      color: rgba(255, 255, 255, 0.72);
    }

    .archive-item span {
      display: block;
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 1;
    }

    .archive-item strong {
      display: block;
      margin: 0 0 10px;
      font-size: 13px;
      line-height: 1.25;
    }

    .archive-item p {
      display: block;
      margin: 0;
      overflow: visible;
      font-size: 13px;
      line-height: 1.35;
      -webkit-line-clamp: unset;
      -webkit-box-orient: unset;
    }

    .archive-item.active,
    .archive-item:hover,
    .archive-item:focus {
      color: #ffffff;
    }

    .archive-item.active strong,
    .archive-item:hover strong,
    .archive-item:focus strong {
      color: var(--archive-title-color);
    }

    .main-nav {
      height: 100dvh;
      max-height: 100dvh;
      padding: 76px 24px 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 18px;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      background: #000000;
      color: #ffffff;
      transform: translateX(100%);
    }

    .main-nav.open {
      transform: translateX(0);
    }

    .menu-links-area {
      position: static;
      transform: none;
      flex-shrink: 0;
    }

    .menu-grid {
      display: flex;
      flex-direction: column;
      gap: 11px;
      overflow: visible;
    }

    .main-nav a {
      color: #ffffff;
    }

    .main-menu-link {
      color: #ffffff;
      font-size: 0.82rem;
      font-weight: 300;
      line-height: 0.95;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .main-menu-link:hover,
    .main-menu-link:focus {
      opacity: 0.65;
      transform: none;
    }

    .mobile-menu-extra {
      display: block;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.22);
      flex-shrink: 0;
    }

    .mobile-social-icons {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .mobile-social-icons a {
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 300;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.82;
    }

    .mobile-contact-info {
      display: flex;
      flex-direction: column;
      gap: 7px;
      color: rgba(255, 255, 255, 0.72);
      font-size: 0.76rem;
      font-weight: 300;
      line-height: 1.25;
      text-align: left;
    }

    .mobile-contact-info p {
      margin: 0;
      color: #ffffff;
      font-size: 0.78rem;
      font-weight: 400;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .mobile-contact-info a {
      color: rgba(255, 255, 255, 0.72);
      font-size: 0.76rem;
      line-height: 1.25;
    }

    .mobile-contact-info address {
      margin: 0;
      font-style: normal;
    }

    .mobile-design-credit {
      display: block;
      margin-top: auto;
      padding-top: 14px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 11px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
  }

  @media (max-width: 700px) {
    .logo {
      top: 18px;
      left: 20px;
      font-size: 1.25rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .menu-toggle {
      top: 22px;
      right: 20px;
      width: 34px;
    }

    .archive-center-title {
      top: 108px;
      left: 16px;
      width: calc(100% - 32px);
    }

    .archive-center-title strong {
      font-size: clamp(15px, 4.2vw, 20px);
    }

    .active-image-preview {
      top: 165px;
      left: 16px;
      width: calc(100% - 32px);
      height: 220px;
    }

    .archive-items {
      top: 420px;
      gap: 40px;
      padding: 0 16px calc(100px + env(safe-area-inset-bottom));
    }

    .archive-item {
      padding-left: 16px;
    }

    .archive-item p {
      font-size: 13px;
    }

    .main-nav {
      padding: 70px 20px 20px;
      gap: 15px;
    }

    .menu-grid {
      gap: 9px;
    }

    .main-menu-link {
      font-size: 0.78rem;
      line-height: 0.92;
    }

    .mobile-menu-extra {
      padding-top: 14px;
    }

    .mobile-social-icons {
      gap: 10px;
      margin-bottom: 14px;
    }

    .mobile-social-icons a {
      font-size: 0.68rem;
    }

    .mobile-contact-info {
      gap: 6px;
      font-size: 0.72rem;
      line-height: 1.2;
    }

    .mobile-contact-info p,
    .mobile-contact-info a {
      font-size: 0.72rem;
    }

    .mobile-design-credit {
      padding-top: 10px;
      font-size: 10px;
    }
  }

  @media (max-height: 700px) and (max-width: 1024px) {
    .main-nav {
      padding-top: 64px;
      gap: 12px;
    }

    .menu-grid {
      gap: 7px;
    }

    .main-menu-link {
      font-size: 0.72rem;
      line-height: 0.9;
    }

    .mobile-menu-extra {
      padding-top: 10px;
    }

    .mobile-social-icons {
      margin-bottom: 10px;
    }

    .mobile-contact-info {
      gap: 4px;
      font-size: 0.68rem;
      line-height: 1.15;
    }

    .mobile-contact-info p,
    .mobile-contact-info a {
      font-size: 0.68rem;
    }

    .mobile-design-credit {
      padding-top: 8px;
      font-size: 9px;
    }
  }
</style>
