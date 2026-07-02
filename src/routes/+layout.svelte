<script>
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";

  let { children, data } = $props();

  let menuOpen = $state(false);
  let headerScrolled = $state(false);
  let openMobileSubmenus = $state({});

  let aboutItems = $derived(data?.aboutMenuItems || []);
  let paintingItems = $derived(data?.paintingMenuItems || []);
  let exhibitionItems = $derived(data?.exhibitionMenuItems || []);
  let performanceItems = $derived(data?.performanceMenuItems || []);
  let eventItems = $derived(data?.eventMenuItems || []);
  let pathname = $derived(page.url.pathname);
  let isHomePage = $derived(pathname === "/");

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
      label: "Public viewings",
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
    const colors = {
      "/painting": "#ff5c01",
      "/exhibitions": "#24d480",
      "/performances": "#ab9bf2",
    };

    return colors[item.href] || "#ffffff";
  }

  function hasDesktopSubmenu(item) {
    return (
      ["/painting", "/exhibitions", "/performances"].includes(item.href) &&
      item.children &&
      item.children.length > 0
    );
  }

  function getMobileSubmenuKey(item) {
    return getItemLabel(item).toLowerCase();
  }

  function isMobileSubmenuOpen(item) {
    return !!openMobileSubmenus[getMobileSubmenuKey(item)];
  }

  function toggleMobileSubmenu(item) {
    const key = getMobileSubmenuKey(item);

    openMobileSubmenus[key] = !openMobileSubmenus[key];
  }

  function updateScrollLock(shouldLock) {
    if (!browser) return;

    if (shouldLock) {
      document.body.classList.add("menu-open-lock");
    } else {
      document.body.classList.remove("menu-open-lock");
    }
  }

  function updateHeaderScrolled() {
    if (!browser) return;

    headerScrolled = window.scrollY > 8;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;

    if (!menuOpen) {
      openMobileSubmenus = {};
    }
  }

  function closeMenu() {
    menuOpen = false;
    openMobileSubmenus = {};
  }

  $effect(() => {
    updateScrollLock(menuOpen);
  });

  $effect(() => {
    if (!browser) return;

    updateHeaderScrolled();

    window.addEventListener("scroll", updateHeaderScrolled, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateHeaderScrolled);
    };
  });

  afterNavigate(() => {
    menuOpen = false;
    openMobileSubmenus = {};

    if (browser) {
      document.body.classList.remove("menu-open-lock");
      updateHeaderScrolled();
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
  <div
    class="top-header-background"
    class:is-visible={headerScrolled && !menuOpen}
  ></div>

  <a
    href="/"
    class="logo"
    class:top-is-scrolled={headerScrolled && !menuOpen}
    onclick={closeMenu}
  >
    Eva Eichinger
  </a>

  <button
    class="desktop-menu-control"
    class:top-is-scrolled={headerScrolled && !menuOpen}
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

  <button
    class="menu-toggle"
    class:top-is-scrolled={headerScrolled && !menuOpen}
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
            <div class="menu-link-row">
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
                <button
                  type="button"
                  class="mobile-submenu-toggle"
                  class:is-open={isMobileSubmenuOpen(item)}
                  aria-label={`${isMobileSubmenuOpen(item) ? "Close" : "Open"} ${item.label} submenu`}
                  aria-expanded={isMobileSubmenuOpen(item)}
                  onclick={() => toggleMobileSubmenu(item)}
                >
                  <span aria-hidden="true">
                    {isMobileSubmenuOpen(item) ? "−" : "+"}
                  </span>
                </button>
              {/if}
            </div>

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

              <div
                class="mobile-submenu"
                class:open={isMobileSubmenuOpen(item)}
                aria-label={`${item.label} submenu`}
              >
                {#each item.children as child, childIndex}
                  <a
                    href={getSubmenuHref(item, child)}
                    class="mobile-submenu-link"
                    onclick={closeMenu}
                  >
                    <span class="mobile-submenu-number">
                      {String(childIndex + 1).padStart(2, "0")}
                    </span>

                    <span class="mobile-submenu-title">
                      {getItemLabel(child)}
                    </span>
                  </a>
                {/each}
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

<footer
  class="site-footer"
  class:is-visible={!isHomePage || headerScrolled}
  aria-label="Footer navigation"
>
  <a href="/contact" class="footer-link footer-link-left" onclick={closeMenu}>
    CONTACT
  </a>

  <a href="/privacy" class="footer-link footer-link-center" onclick={closeMenu}>
    PRIVACY
  </a>

  <a href="/archive" class="footer-link footer-link-right" onclick={closeMenu}>
    ARCHIVE
  </a>
</footer>

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
  .main-nav *,
  .site-footer,
  .site-footer * {
    font-family: var(--site-font-family);
  }

  .site-header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 100;
    width: 100%;
    pointer-events: none;
  }

  .top-header-background {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    width: 100%;
    height: 82px;
    background: #ffffff;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  .top-header-background.is-visible {
    opacity: 1;
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

  .logo.top-is-scrolled {
    color: #2f2d2b;
  }

  .desktop-menu-control {
    position: fixed;
    top: 18px;
    right: 28px;
    z-index: 105;
    display: inline-flex;
    width: auto;
    min-height: 44px;
    padding: 7px 9px;
    border: 0;
    background: transparent;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: #2f2d2b;
    cursor: pointer;
    pointer-events: auto;
    transition:
      background 0.25s ease,
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .desktop-menu-control.top-is-scrolled {
    color: #2f2d2b;
  }

  .desktop-menu-control:hover,
  .desktop-menu-control:focus-visible {
    background: #ffffff;
    color: #2f2d2b;
    outline: none;
  }

  .desktop-menu-control-text {
    color: currentColor;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
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

  .desktop-menu-control[aria-expanded="true"]:hover,
  .desktop-menu-control[aria-expanded="true"]:focus-visible {
    background: #ffffff;
    color: #2f2d2b;
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

  .site-header.is-archive-page .logo,
  .site-header.is-archive-page .desktop-menu-control {
    color: #ffffff;
  }

  .site-header.is-archive-page .logo.top-is-scrolled,
  .site-header.is-archive-page .desktop-menu-control.top-is-scrolled {
    color: #2f2d2b;
  }

  .site-header.is-archive-page .desktop-menu-control:hover,
  .site-header.is-archive-page .desktop-menu-control:focus-visible {
    background: #ffffff;
    color: #2f2d2b;
  }

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

  .menu-link-row {
    display: inline-flex;
    align-items: center;
    width: fit-content;
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
    font-size: clamp(36px, 2.45vw, 54px);
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

  .mobile-submenu-toggle,
  .mobile-submenu {
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

  .site-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 90;
    width: 100%;
    min-height: 72px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 0 28px;
    background: transparent;
    pointer-events: auto;
    transition: background 0.25s ease;
  }

  .site-footer.is-visible {
    background: #ffffff;
  }

  .footer-link {
    color: #2f2d2b;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    transition: opacity 0.25s ease;
  }

  .footer-link:hover,
  .footer-link:focus {
    opacity: 0.7;
  }

  .footer-link-left {
    justify-self: start;
    text-align: left;
  }

  .footer-link-right {
    justify-self: end;
    text-align: right;
  }

  @media (max-width: 1024px) {
    .top-header-background {
      height: 70px;
    }

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

    .desktop-menu-control,
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

    .site-header.is-archive-page .logo.top-is-scrolled {
      color: #2f2d2b;
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

    .menu-toggle.top-is-scrolled span,
    .site-header.is-archive-page .menu-toggle.top-is-scrolled span {
      background: #2f2d2b;
    }

    .menu-toggle[aria-expanded="true"] span,
    .site-header.is-archive-page .menu-toggle[aria-expanded="true"] span {
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
      width: 100%;
    }

    .menu-link-row {
      width: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
    }

    .main-nav a {
      color: #ffffff;
    }

    .main-menu-link {
      width: fit-content;
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

    .mobile-submenu-toggle {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      justify-self: end;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: #ffffff;
      font-size: 17px;
      font-weight: 400;
      line-height: 1;
      cursor: pointer;
    }

    .mobile-submenu-toggle span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition:
        opacity 0.25s ease,
        transform 0.25s ease;
    }

    .mobile-submenu-toggle:hover span,
    .mobile-submenu-toggle:focus-visible span {
      opacity: 0.65;
    }

    .mobile-submenu-toggle.is-open span {
      transform: translateY(-1px);
    }

    .mobile-submenu {
      max-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      margin: 0;
      padding: 0 0 0 12px;
      border-left: 1px solid rgba(255, 255, 255, 0.22);
      opacity: 0;
      transition:
        max-height 0.28s ease,
        margin 0.28s ease,
        opacity 0.22s ease;
    }

    .mobile-submenu.open {
      max-height: 360px;
      margin-top: 10px;
      opacity: 1;
    }

    .mobile-submenu-link {
      display: grid;
      grid-template-columns: 28px minmax(0, 1fr);
      gap: 8px;
      align-items: start;
      color: rgba(255, 255, 255, 0.72);
      font-size: 11px;
      font-weight: 500;
      line-height: 1.18;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .mobile-submenu-link:hover,
    .mobile-submenu-link:focus {
      color: #ffffff;
    }

    .mobile-submenu-number {
      opacity: 0.58;
    }

    .mobile-submenu-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile-menu-extra {
      display: block;
      margin-top: auto;
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
      margin-top: 18px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 11px;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }

    .site-footer {
      min-height: 58px;
      padding: 0 24px;
      grid-template-columns: 1fr 1fr 1fr;
      background: transparent;
    }

    .site-footer.is-visible {
      background: #ffffff;
    }

    .footer-link {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-decoration-thickness: 1px;
      text-underline-offset: 4px;
    }

    .footer-link-left {
      justify-self: start;
      text-align: left;
    }

    .footer-link-right {
      justify-self: end;
      text-align: right;
    }
  }

  @media (max-width: 600px) {
    .top-header-background {
      height: 66px;
    }

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

    .mobile-submenu-toggle {
      width: 26px;
      height: 26px;
      font-size: 16px;
    }

    .mobile-submenu.open {
      max-height: 340px;
      margin-top: 9px;
    }

    .mobile-submenu-link {
      grid-template-columns: 26px minmax(0, 1fr);
      font-size: 10px;
      line-height: 1.18;
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
      margin-top: 14px;
      font-size: 10px;
    }

    .site-footer {
      min-height: 58px;
      padding: 0 24px;
      grid-template-columns: 1fr 1fr 1fr;
      background: transparent;
    }

    .site-footer.is-visible {
      background: #ffffff;
    }

    .footer-link {
      font-size: 11px;
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

    .mobile-submenu.open {
      max-height: 250px;
      margin-top: 8px;
    }

    .mobile-submenu-link {
      font-size: 9px;
      line-height: 1.15;
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
      margin-top: 8px;
      font-size: 9px;
    }

    .site-footer {
      min-height: 58px;
      padding: 0 24px;
      grid-template-columns: 1fr 1fr;
      background: transparent;
    }

    .site-footer.is-visible {
      background: #ffffff;
    }
  }
</style>
