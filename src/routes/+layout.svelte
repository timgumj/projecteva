<script>
  import { page } from "$app/state";

  let { children, data } = $props();

  let menuOpen = $state(false);

  const aboutItems = data?.aboutMenuItems || [];
  const paintingItems = data?.paintingMenuItems || [];
  const exhibitionItems = data?.exhibitionMenuItems || [];
  const eventItems = data?.eventMenuItems || [];

  const menuItems = [
    {
      label: "Home",
      href: "/",
      children: [],
    },
    {
      label: "About",
      href: "/about",
      children: aboutItems,
    },
    {
      label: "Paintings",
      href: "/painting",
      children: paintingItems,
    },
    {
      label: "Exhibitions",
      href: "/exhibitions",
      children: exhibitionItems,
    },
    {
      label: "Events",
      href: "/event",
      children: eventItems,
    },
    {
      label: "Contact",
      href: "/contact",
      children: [],
    },
    {
      label: "Archive",
      href: "/archive",
      children: [],
    },
  ];

  let menuImages = $derived(() => {
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

  let currentPageLabel = $derived(() => {
    const path = page.url.pathname;

    if (path === "/") return "Home";
    if (path.startsWith("/about")) return "About";
    if (path.startsWith("/painting")) return "Paintings";
    if (path.startsWith("/exhibitions")) return "Exhibitions";
    if (path.startsWith("/event")) return "Events";
    if (path.startsWith("/archive")) return "Archive";
    if (path.startsWith("/contact")) return "Contact";

    return "Work";
  });

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<header class="site-header" class:menu-is-open={menuOpen}>
  <a href="/" class="logo" onclick={closeMenu}>Eva Eichinger</a>

  <div class="desktop-page-label">
    {currentPageLabel()}
  </div>

  <button
    class="desktop-menu-text"
    type="button"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    onclick={toggleMenu}
  >
    {menuOpen ? "Close" : "Menu"}
  </button>

  <a href="/archive" class="desktop-archive-fixed" onclick={closeMenu}
    >Archive</a
  >

  <button
    class="menu-toggle"
    type="button"
    aria-label={menuOpen ? "Close menu" : "Open menu"}
    aria-expanded={menuOpen}
    onclick={toggleMenu}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <nav class:open={menuOpen} class="main-nav" aria-label="Main navigation">
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
                  <a href={child.href} class="submenu-link" onclick={closeMenu}>
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
          St. Ulrichs-Platz 6,<br />
          1070 Wien
        </address>
      </div>
    </div>
  </nav>
</header>

{@render children()}

<footer class="site-footer">
  <p>© 2006 Eva Eichinger</p>
  <p>Design by Zora Design</p>
</footer>

<style>
  :global(body) {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    background: #ffffff;
    color: #4d4a47;
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
    font-family: Arial, Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.04em;
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
    color: #8e8781;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    pointer-events: none;
    transition: color 0.25s ease;
  }

  .desktop-menu-text {
    position: fixed;
    top: 50%;
    right: 28px;
    z-index: 105;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000000;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
    cursor: pointer;
    transform: translateY(-50%);
    pointer-events: auto;
    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .desktop-menu-text:hover {
    opacity: 0.6;
  }

  .desktop-archive-fixed {
    position: fixed;
    right: 28px;
    bottom: 52px;
    z-index: 105;
    color: #000000;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    text-transform: uppercase;
    text-decoration: none;
    pointer-events: auto;
    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .desktop-archive-fixed:hover {
    opacity: 0.6;
  }

  .site-header.menu-is-open .desktop-page-label,
  .site-header.menu-is-open .desktop-menu-text,
  .site-header.menu-is-open .desktop-archive-fixed {
    color: #ffffff;
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

    background-color: #000000;
    background-image: none;

    color: #ffffff;
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);

    transition:
      transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
      opacity 0.4s ease;
  }

  .site-header.menu-is-open .logo,
  .site-header.menu-is-open .desktop-page-label,
  .site-header.menu-is-open .desktop-archive-fixed {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .site-header.menu-is-open .desktop-menu-text {
    color: #ffffff;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .main-nav.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
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
    font-family: Arial, Helvetica, sans-serif;
  }

  .main-menu-link {
    display: inline-block;
    color: #ffffff;
    font-size: clamp(48px, 4.2vw, 76px);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.075em;
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

  .mobile-menu-extra {
    display: none;
  }

  .site-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 28px;
    box-sizing: border-box;
    color: #8e8781;
    font-size: 14px;
    font-weight: 300;
    background: #ffffff;
    pointer-events: none;
  }

  .site-footer p {
    margin: 0;
  }

  @media (max-width: 1024px) {
    .logo {
      top: 22px;
      left: 24px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.45rem;
      letter-spacing: 0.055em;
    }

    .logo::after {
      content: "";
      display: block;
      width: 100%;
      height: 1px;
      margin-top: 7px;
      background: currentColor;
      opacity: 0.55;
    }

    .desktop-page-label,
    .desktop-menu-text,
    .desktop-archive-fixed,
    .desktop-menu-brand,
    .desktop-menu-images,
    .desktop-social-links,
    .desktop-menu-rights {
      display: none;
    }

    .menu-toggle {
      position: fixed;
      top: 22px;
      right: 24px;
      z-index: 105;
      display: flex;
      width: 34px;
      height: 26px;
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
        opacity 0.25s ease,
        background 0.25s ease;
    }

    .menu-toggle[aria-expanded="true"] span {
      background: #2f2d2b;
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(1) {
      transform: translateY(12.5px) rotate(45deg);
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle[aria-expanded="true"] span:nth-child(3) {
      transform: translateY(-12.5px) rotate(-45deg);
    }

    .main-nav {
      height: 100dvh;
      padding: 120px 24px 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 34px;
      overflow-y: auto;
      background: #ffffff;
      color: #4d4a47;
      transform: translateX(100%);
    }

    .main-nav.open {
      transform: translateX(0);
    }

    .menu-links-area {
      position: static;
      transform: none;
    }

    .menu-grid {
      display: flex;
      flex-direction: column;
      gap: 26px;
      overflow: visible;
    }

    .main-nav a {
      color: #6f6b68;
      font-family: Georgia, "Times New Roman", serif;
    }

    .main-menu-link {
      color: #2f2d2b;
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

    .submenu-grid {
      display: none;
    }

    .mobile-menu-extra {
      display: block;
      padding-top: 10px;
      border-top: 1px solid rgba(47, 45, 43, 0.18);
    }

    .mobile-social-icons {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      margin-bottom: 24px;
    }

    .mobile-social-icons a {
      color: #2f2d2b;
      font-size: 1rem;
      font-weight: 300;
      letter-spacing: normal;
      text-transform: uppercase;
      opacity: 1;
    }

    .mobile-contact-info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: #6f6b68;
      font-size: 1rem;
      font-weight: 300;
      line-height: 1.35;
      text-align: left;
    }

    .mobile-contact-info p {
      margin: 0;
      color: #2f2d2b;
      font-size: 1.1rem;
      font-weight: 400;
      letter-spacing: normal;
      text-transform: uppercase;
    }

    .mobile-contact-info a {
      color: #6f6b68;
      font-size: 1rem;
      line-height: 1.35;
    }

    .mobile-contact-info address {
      margin: 0;
      font-style: normal;
    }

    .site-footer {
      padding: 16px 24px;
      font-size: 13px;
      flex-direction: column;
      gap: 7px;
      align-items: flex-start;
    }
  }

  @media (max-width: 600px) {
    .main-nav {
      padding: 110px 24px 40px;
    }

    .menu-grid {
      gap: 28px;
    }

    .main-menu-link {
      font-size: 1.25rem;
    }
  }
</style>
