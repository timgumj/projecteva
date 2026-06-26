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

  let lockedScrollY = 0;
  let scrollIsLocked = false;

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

  function lockPageScroll() {
    if (!browser || scrollIsLocked) return;

    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    scrollIsLocked = true;

    document.documentElement.classList.add("menu-open-lock");
    document.body.classList.add("menu-open-lock");

    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockPageScroll(restoreScroll = true) {
    if (!browser || !scrollIsLocked) return;

    scrollIsLocked = false;

    document.documentElement.classList.remove("menu-open-lock");
    document.body.classList.remove("menu-open-lock");

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    if (restoreScroll) {
      window.scrollTo(0, lockedScrollY);
    }
  }

  function forceUnlockPageScroll() {
    if (!browser) return;

    scrollIsLocked = false;

    document.documentElement.classList.remove("menu-open-lock");
    document.body.classList.remove("menu-open-lock");

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  $effect(() => {
    if (!browser) return;

    if (menuOpen) {
      lockPageScroll();
    } else {
      unlockPageScroll(true);
    }
  });

  afterNavigate(() => {
    menuOpen = false;

    if (browser) {
      forceUnlockPageScroll();
    }
  });

  onDestroy(() => {
    if (browser) {
      forceUnlockPageScroll();
    }
  });
</script>

{#if !isArchivePage}
  <header class="site-header" class:menu-is-open={menuOpen}>
    <a href="/" class="logo" onclick={closeMenu}>Eva Eichinger</a>

    <div class="desktop-page-label" aria-label={currentPageLabel}>
      {#if isHomePage}
        <lord-icon
          src="https://cdn.lordicon.com/skpqewwt.json"
          trigger="in"
          delay="1500"
          stroke="light"
          state="in-reveal"
          colors="primary:#000000,secondary:#000000"
          style="width:80px;height:80px"
        >
        </lord-icon>
      {:else if isAboutPage}
        <lord-icon
          src="https://cdn.lordicon.com/urswgamh.json"
          trigger="in"
          delay="1500"
          stroke="light"
          state="in-reveal"
          colors="primary:#000000,secondary:#000000"
          style="width:80px;height:80px"
        >
        </lord-icon>
      {:else if isPaintingPage}
        <lord-icon
          src="https://cdn.lordicon.com/snxksidl.json"
          trigger="in"
          delay="1500"
          stroke="light"
          state="in-reveal"
          colors="primary:#000000,secondary:#000000"
          style="width:80px;height:80px"
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
            <div class="menu-grid-item">
              <a href={item.href} class="main-menu-link" onclick={closeMenu}>
                {item.label}
              </a>

              {#if item.children && item.children.length > 0}
                <div class="submenu-grid">
                  {#each item.children as child}
                    <a
                      href={child.href}
                      class="submenu-link"
                      onclick={closeMenu}
                    >
                      {#if child.featuredImage}
                        <img
                          src={child.featuredImage}
                          alt=""
                          class="submenu-thumb"
                          loading="lazy"
                        />
                      {/if}

                      <span>{child.label}</span>
                    </a>
                  {/each}
                </div>
              {/if}
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
{/if}

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

  :global(html.menu-open-lock),
  :global(body.menu-open-lock) {
    overflow: hidden !important;
    overscroll-behavior: none;
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
    z-index: 104;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    padding: 76px 24px 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    background: #000000;
    opacity: 0;
    pointer-events: none;
    transform: translateX(100%);
    transition:
      transform 0.35s ease,
      opacity 0.25s ease;
  }

  .main-nav.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
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

  .submenu-grid {
    display: none;
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
    .desktop-menu-credit {
      display: none;
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
      z-index: 104;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      padding: 76px 24px 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 18px;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      background: #000000;
      opacity: 0;
      pointer-events: none;
      transform: translateX(100%);
    }

    .main-nav.open {
      opacity: 1;
      pointer-events: auto;
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

    .submenu-grid {
      display: none;
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
