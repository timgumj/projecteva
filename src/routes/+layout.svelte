<script>
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";

  let { children, data } = $props();

  let menuOpen = $state(false);

  let aboutItems = $derived(data?.aboutMenuItems || []);
  let paintingItems = $derived(data?.paintingMenuItems || []);
  let exhibitionItems = $derived(data?.exhibitionMenuItems || []);
  let performanceItems = $derived(data?.performanceMenuItems || []);
  let eventItems = $derived(data?.eventMenuItems || []);
  let pathname = $derived(page.url.pathname);

  const desktopSubmenuLabels = ["paintings", "exhibitions", "performances"];

  const submenuAccentColors = {
    paintings: "#ff5c01",
    exhibitions: "#24d480",
    performances: "#ab9bf2",
  };

  let menuItems = $derived.by(() => [
    { label: "Home", href: "/", children: [] },
    { label: "About", href: "/about", children: aboutItems },
    { label: "Paintings", href: "/painting", children: paintingItems },
    { label: "Exhibitions", href: "/exhibitions", children: exhibitionItems },
    {
      label: "Performances",
      href: "/performances",
      children: performanceItems,
    },
    { label: "Events", href: "/event", children: eventItems },
    { label: "Contact", href: "/contact", children: [] },
    { label: "Archive", href: "/archive", children: [] },
  ]);

  let menuImages = $derived.by(() => {
    const images = [];

    [
      ...paintingItems,
      ...exhibitionItems,
      ...performanceItems,
      ...eventItems,
      ...aboutItems,
    ].forEach((item) => {
      if (item.featuredImage && images.length < 10) {
        images.push(item.featuredImage);
      }
    });

    return images;
  });

  let currentPageLabel = $derived.by(() => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/about")) return "About";
    if (pathname.startsWith("/painting")) return "Paintings";
    if (pathname.startsWith("/exhibitions")) return "Exhibitions";
    if (pathname.startsWith("/performances")) return "Performances";
    if (pathname.startsWith("/event")) return "Events";
    if (pathname.startsWith("/archive")) return "Archive";
    if (pathname.startsWith("/contact")) return "Contact";

    return "Work";
  });

  let isHomePage = $derived(pathname === "/");
  let isAboutPage = $derived(pathname.startsWith("/about"));
  let isPaintingPage = $derived(pathname.startsWith("/painting"));
  let isArchivePage = $derived(pathname.startsWith("/archive"));

  function stripHtml(html = "") {
    return String(html)
      .replace(/<[^>]*>/g, "")
      .trim();
  }

  function decodeHtml(text = "") {
    return String(text)
      .replace(/&#8211;/g, "–")
      .replace(/&#8212;/g, "—")
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&amp;/g, "&");
  }

  function getItemLabel(item) {
    const rawTitle =
      typeof item?.title === "object" ? item?.title?.rendered : item?.title;

    const raw =
      item?.label ||
      rawTitle ||
      item?.name ||
      item?.slug ||
      item?.postSlug ||
      "Untitled";

    return decodeHtml(stripHtml(raw));
  }

  function getPostId(item) {
    return (
      item?.id ||
      item?.postId ||
      item?.postID ||
      item?.wpId ||
      item?.postSlug ||
      null
    );
  }

  function getSubmenuHref(parentItem, child) {
    const parentLabel = getItemLabel(parentItem).toLowerCase();

    if (parentLabel === "paintings") {
      const postId = getPostId(child);

      if (postId) {
        return `/painting?post=${postId}`;
      }

      return child?.href || "/painting";
    }

    if (parentLabel === "performances") {
      const postId = getPostId(child);

      if (postId) {
        return `/performances?post=${postId}`;
      }

      return child?.href || "/performances";
    }

    if (parentLabel === "exhibitions") {
      return "/exhibitions";
    }

    return child?.href || child?.frontendLink || child?.link || "#";
  }

  function getSubmenuAccentColor(item) {
    const label = getItemLabel(item).toLowerCase();

    return submenuAccentColors[label] || "#ffffff";
  }

  function hasDesktopSubmenu(item) {
    const label = getItemLabel(item).toLowerCase();

    return (
      desktopSubmenuLabels.includes(label) &&
      item.children &&
      item.children.length > 0
    );
  }

  function updateScrollLock(shouldLock) {
    if (!browser) return;

    if (shouldLock) {
      document.body.classList.add("menu-open-lock");
    } else {
      document.body.classList.remove("menu-open-lock");
    }
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  $effect(() => {
    updateScrollLock(menuOpen);
  });

  afterNavigate(() => {
    menuOpen = false;

    if (browser) {
      document.body.classList.remove("menu-open-lock");
    }
  });

  onDestroy(() => {
    updateScrollLock(false);
  });
</script>

<header
  class="site-header"
  class:menu-is-open={menuOpen}
  class:is-archive-page={isArchivePage}
>
  <a href="/" class="logo" onclick={closeMenu}>Eva Eichinger</a>

  <div class="desktop-page-label" aria-label={currentPageLabel}>
    {#if isHomePage}
      <lord-icon
        src="https://cdn.lordicon.com/exymduqj.json"
        trigger="in"
        delay="1500"
        stroke="light"
        state="in-reveal"
        colors="primary:#000000,secondary:#000000"
        style="width:60px;height:60px"
      >
      </lord-icon>
    {:else if isAboutPage}
      <lord-icon
        src="https://cdn.lordicon.com/mtuudzxm.json"
        trigger="in"
        delay="1500"
        stroke="light"
        state="in-reveal"
        colors="primary:#000000,secondary:#000000"
        style="width:60px;height:60px"
      >
      </lord-icon>
    {:else if isPaintingPage}
      <lord-icon
        src="https://cdn.lordicon.com/snxksidl.json"
        trigger="hover"
        stroke="light"
        colors="primary:#000000,secondary:#000000"
        style="width:60px;height:60px"
      >
      </lord-icon>
    {:else}
      {currentPageLabel}
    {/if}
  </div>

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
      {#if menuImages.length > 0}
        {#each menuImages as image}
          <div class="desktop-menu-image">
            <img src={image} alt="" loading="lazy" />
          </div>
        {/each}
      {/if}
    </div>

    <div class="menu-links-area">
      <div class="menu-grid">
        {#each menuItems as item}
          <div
            class="menu-grid-item"
            class:has-desktop-submenu={hasDesktopSubmenu(item)}
            style={`--submenu-accent-color: ${getSubmenuAccentColor(item)};`}
          >
            <a
              href={item.href}
              class="main-menu-link"
              class:has-arrow={hasDesktopSubmenu(item)}
              onclick={closeMenu}
            >
              <span>{item.label}</span>

              {#if hasDesktopSubmenu(item)}
                <span class="desktop-menu-arrow" aria-hidden="true">→</span>
              {/if}
            </a>

            {#if hasDesktopSubmenu(item)}
              <div
                class="desktop-submenu-panel"
                aria-label={`${item.label} submenu`}
              >
                <div class="desktop-submenu-inner">
                  <div class="desktop-submenu-kicker">
                    {item.label}
                  </div>

                  <div class="desktop-submenu-list">
                    {#each item.children as child, childIndex}
                      <a
                        href={getSubmenuHref(item, child)}
                        class="desktop-submenu-link"
                        onclick={closeMenu}
                      >
                        <span class="desktop-submenu-number">
                          {String(childIndex + 1).padStart(2, "0")}
                        </span>

                        <span class="desktop-submenu-title">
                          {getItemLabel(child)}
                        </span>

                        {#if child.featuredImage}
                          <span class="desktop-submenu-image">
                            <img
                              src={child.featuredImage}
                              alt=""
                              loading="lazy"
                            />
                          </span>
                        {/if}
                      </a>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="desktop-menu-credit">Designed by Zora WebDesign</div>

    <div class="desktop-social-links">
      <a
        href="https://www.instagram.com/eva_eichinger_/"
        target="_blank"
        rel="noreferrer"
      >
        Instagram
      </a>
    </div>

    <div class="desktop-menu-rights">All rights reserved ©Eva Eichinger</div>

    <div class="mobile-menu-extra">
      <div class="mobile-social-icons">
        <a
          href="https://www.instagram.com/eva_eichinger_/"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
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

{@render children()}

<style>
  :global(:root) {
    --site-font-family: Arial, Helvetica, sans-serif;
  }

  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
  }

  :global(body) {
    overflow-x: hidden;
  }

  :global(body.menu-open-lock) {
    overflow: hidden !important;
  }

  .site-header,
  .site-header *,
  .main-nav,
  .main-nav * {
    font-family: var(--site-font-family);
  }

  .site-header {
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
    color: #2f2d2b;
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
    top: 26px;
    right: 28px;
    z-index: 105;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4e4e4e;
    font-size: 14px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    pointer-events: auto;
  }

  .desktop-page-label lord-icon {
    display: block;
    width: 24px;
    height: 24px;
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
    color: #2f2d2b;
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
    color: #2f2d2b;
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

  .site-header.is-archive-page .logo,
  .site-header.is-archive-page .desktop-page-label,
  .site-header.is-archive-page .desktop-menu-control,
  .site-header.is-archive-page .desktop-archive-fixed {
    color: #ffffff;
  }

  .site-header.is-archive-page .desktop-page-label lord-icon {
    filter: invert(1);
  }

  .site-header.menu-is-open .desktop-page-label,
  .site-header.menu-is-open .desktop-archive-fixed,
  .site-header.menu-is-open .logo {
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
    height: 100vh;
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
    height: 100vh;
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
    left: 44vw;
    top: 50%;
    z-index: 5;
    transform: translateY(-50%);
  }

  .menu-grid {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .menu-grid-item {
    --submenu-accent-color: #ffffff;

    position: relative;
    width: fit-content;
    margin: 0;
    padding: 0;
  }

  .main-nav a {
    color: #ffffff;
    text-decoration: none;
  }

  .main-menu-link {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    color: #ffffff;
    font-size: clamp(36px, 3.45vw, 64px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.022em;
    transition:
      color 0.3s ease,
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .main-menu-link:hover,
  .main-menu-link:focus {
    opacity: 0.6;
    transform: translateX(8px);
  }

  .menu-grid-item.has-desktop-submenu:hover .main-menu-link,
  .menu-grid-item.has-desktop-submenu:focus-within .main-menu-link {
    color: var(--submenu-accent-color);
    opacity: 1;
  }

  .desktop-menu-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.04em;
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.32em;
    font-weight: 300;
    line-height: 1;
    transform: translateY(-0.01em);
    transition:
      color 0.25s ease,
      transform 0.25s ease,
      opacity 0.25s ease;
  }

  .menu-grid-item.has-desktop-submenu:hover .desktop-menu-arrow,
  .menu-grid-item.has-desktop-submenu:focus-within .desktop-menu-arrow {
    color: var(--submenu-accent-color);
    opacity: 1;
    transform: translateY(-0.01em) translateX(4px);
  }

  .desktop-submenu-panel {
    position: absolute;
    left: 100%;
    top: 50%;
    z-index: 20;
    width: calc(clamp(64px, 7vw, 124px) + min(31vw, 430px));
    max-height: 62vh;
    overflow: visible;
    padding-left: clamp(64px, 7vw, 124px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-50%);
    transition:
      opacity 0.25s ease,
      visibility 0.25s ease,
      transform 0.25s ease;
  }

  .desktop-submenu-inner {
    width: min(31vw, 430px);
    max-height: 62vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 2px 0 8px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .desktop-submenu-inner::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .menu-grid-item.has-desktop-submenu:hover .desktop-submenu-panel,
  .menu-grid-item.has-desktop-submenu:focus-within .desktop-submenu-panel {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(-50%);
  }

  .desktop-submenu-kicker {
    margin: 0 0 18px;
    color: var(--submenu-accent-color);
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  .desktop-submenu-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .desktop-submenu-link {
    position: relative;
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) 54px;
    gap: 10px;
    align-items: center;
    width: 100%;
    min-width: 0;
    color: var(--submenu-accent-color);
    font-size: clamp(12px, 0.78vw, 14px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    opacity: 0.68;
    transition:
      color 0.24s ease,
      opacity 0.24s ease,
      transform 0.24s ease;
  }

  .desktop-submenu-link:hover,
  .desktop-submenu-link:focus {
    color: var(--submenu-accent-color);
    opacity: 1;
    transform: translateX(5px);
  }

  .desktop-submenu-number {
    color: inherit;
    font-size: 0.82em;
    font-weight: 700;
    line-height: 1;
    opacity: 0.62;
  }

  .desktop-submenu-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .desktop-submenu-image {
    width: 54px;
    height: 38px;
    display: block;
    overflow: hidden;
    background: #161616;
    opacity: 0.7;
    transition: opacity 0.24s ease;
  }

  .desktop-submenu-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    filter: grayscale(100%);
  }

  .desktop-submenu-link:hover .desktop-submenu-image,
  .desktop-submenu-link:focus .desktop-submenu-image {
    opacity: 1;
  }

  .submenu-grid {
    display: none;
  }

  .desktop-social-links {
    position: absolute;
    left: 50%;
    bottom: 28px;
    z-index: 12;
    display: block;
    transform: translateX(-50%);
  }

  .desktop-social-links a {
    width: fit-content;
    color: #ffffff;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }

  .desktop-menu-credit {
    position: absolute;
    left: 28px;
    bottom: 28px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
  }

  .desktop-menu-rights {
    position: absolute;
    right: 28px;
    bottom: 28px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
  }

  .mobile-menu-extra,
  .mobile-design-credit {
    display: none;
  }

  @media (max-width: 1024px) {
    .logo {
      top: 20px;
      left: 24px;
      color: #2f2d2b;
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
    .desktop-menu-credit,
    .desktop-submenu-panel,
    .desktop-menu-arrow {
      display: none;
    }

    .site-header.is-archive-page .logo {
      color: #ffffff;
    }

    .site-header.menu-is-open .logo {
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
      background: #2f2d2b;
      transition:
        transform 0.25s ease,
        background 0.25s ease;
    }

    .site-header.is-archive-page .menu-toggle span {
      background: #ffffff;
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

    .main-nav {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      max-height: 100vh;
      max-height: 100dvh;
      padding: 82px 24px 26px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 22px;
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
      gap: 16px;
      overflow: visible;
    }

    .menu-grid-item {
      width: auto;
    }

    .main-nav a {
      color: #ffffff;
    }

    .main-menu-link {
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .main-menu-link:hover,
    .main-menu-link:focus,
    .menu-grid-item.has-desktop-submenu:hover .main-menu-link,
    .menu-grid-item.has-desktop-submenu:focus-within .main-menu-link {
      color: #ffffff;
      opacity: 0.65;
      transform: none;
    }

    .submenu-grid {
      display: none;
    }

    .mobile-menu-extra {
      display: block;
      padding-top: 20px;
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
      font-size: 0.78rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.9;
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
      font-weight: 500;
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
      padding-top: 18px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 11px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
  }

  @media (max-width: 600px) {
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

    .main-nav {
      padding: 76px 20px 22px;
      gap: 20px;
    }

    .menu-grid {
      gap: 15px;
    }

    .main-menu-link {
      font-size: 16px;
      font-weight: 600;
      line-height: 1;
    }

    .mobile-menu-extra {
      padding-top: 18px;
    }

    .mobile-social-icons {
      gap: 10px;
      margin-bottom: 14px;
    }

    .mobile-social-icons a {
      font-size: 0.76rem;
      font-weight: 500;
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
      padding-top: 14px;
      font-size: 10px;
    }
  }

  @media (max-height: 700px) and (max-width: 1024px) {
    .main-nav {
      padding-top: 68px;
      gap: 15px;
    }

    .menu-grid {
      gap: 12px;
    }

    .main-menu-link {
      font-size: 15px;
      font-weight: 600;
      line-height: 0.95;
    }

    .mobile-menu-extra {
      padding-top: 12px;
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
