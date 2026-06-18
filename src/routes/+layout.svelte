<script>
  let { children } = $props();

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
</script>

<header class="site-header">
  <a href="/" class="logo">Eva Eichinger</a>

  <nav class="main-nav" aria-label="Main navigation">
    {#each menuItems as item}
      <a href={item.href}>{item.label}</a>
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

  @media (max-width: 700px) {
    .site-header {
      padding: 22px 24px 18px;
      flex-direction: column;
      gap: 20px;
      align-items: flex-start;
    }

    .logo {
      font-size: 1.45rem;
    }

    .main-nav {
      flex-wrap: wrap;
      gap: 18px 24px;
    }

    .main-nav a {
      font-size: 0.95rem;
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
