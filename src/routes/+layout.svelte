<script>
  let { children } = $props();

  let menuOpen = $state(false);

  const menuItems = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Exhibitions",
      href: "/exhibitions",
    },
    {
      label: "Performance",
      href: "/performance",
    },
    {
      label: "Events",
      href: "/events",
    },
  ];

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }
</script>

<header class="site-header">
  <a href="/" class="logo" onclick={closeMenu}>Eva Eichinger</a>

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
    {#each menuItems as item}
      <a href={item.href} onclick={closeMenu}>{item.label}</a>
    {/each}
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
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
    padding: 28px 40px 22px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    background: #ffffff;
  }

  .logo {
    color: #2f2d2b;
    text-decoration: none;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.65rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.055em;
    transition: opacity 0.25s ease;
    z-index: 102;
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

  .logo:hover {
    opacity: 0.7;
  }

  .main-nav {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .main-nav a {
    color: #6f6b68;
    text-decoration: none;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.045em;
    transition:
      color 0.25s ease,
      opacity 0.25s ease;
  }

  .main-nav a::after {
    content: "";
    display: block;
    width: 0;
    height: 1px;
    margin-top: 6px;
    background: currentColor;
    transition: width 0.25s ease;
  }

  .main-nav a:hover,
  .main-nav a:focus {
    color: #2f2d2b;
  }

  .main-nav a:hover::after,
  .main-nav a:focus::after {
    width: 100%;
  }

  .menu-toggle {
    display: none;
  }

  .site-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 40px;
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

  @media (max-width: 900px) {
    .site-header {
      padding: 22px 24px 18px;
      align-items: center;
    }

    .logo {
      font-size: 1.45rem;
    }

    .menu-toggle {
      position: relative;
      z-index: 102;
      display: flex;
      width: 34px;
      height: 26px;
      padding: 0;
      border: none;
      background: transparent;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
    }

    .menu-toggle span {
      display: block;
      width: 100%;
      height: 1px;
      background: #2f2d2b;
      transition:
        transform 0.25s ease,
        opacity 0.25s ease;
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
      position: fixed;
      top: 0;
      right: 0;
      z-index: 101;
      width: 100%;
      height: 100vh;
      padding: 120px 24px 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 28px;
      background: #ffffff;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }

    .main-nav.open {
      transform: translateX(0);
    }

    .main-nav a {
      font-size: 1.25rem;
    }

    .site-footer {
      padding: 16px 24px;
      font-size: 13px;
      flex-direction: column;
      gap: 7px;
      align-items: flex-start;
    }
  }
</style>
