<script>
  let { data } = $props();

  let posts = $derived(data.posts || []);
  let activePostId = $state(null);

  let activePost = $derived(
    posts.find((post) => post.id === activePostId) || null,
  );

  let archiveCenterTitle = $derived(
    activePost ? cleanText(activePost?.title) : "ARCHIVE OF ALL MY WORKS",
  );

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

  function clearPost() {
    if (!canUseDesktopHover()) return;

    activePostId = null;
  }
</script>

<svelte:head>
  <title>Archive | Eva Eichinger</title>

  <meta
    name="description"
    content="Archive of selected posts and works by Eva Eichinger."
  />
</svelte:head>

<main class="archive-page">
  <section class="archive-hero" aria-label="Archive">
    <div class="archive-fixed-top">
      <div class="archive-center-title">
        <strong>{archiveCenterTitle}</strong>
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
            onmouseenter={() => selectPost(post)}
            onfocus={() => selectPost(post)}
            onmouseleave={clearPost}
            onblur={clearPost}
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

  .archive-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: #000000;
    color: #ffffff;
    padding: 0;
    font-family: var(--site-font-family);
  }

  .archive-hero {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background: #000000;
  }

  .archive-fixed-top {
    position: relative;
    z-index: 5;
  }

  .archive-center-title {
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

  .archive-center-title strong {
    display: block;
    color: #ffffff;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 30px;
    font-weight: 400;
    line-height: 0.9;
    word-spacing: 0.1em;
    letter-spacing: -0.065em;
    text-transform: uppercase;
    transition: color 0.3s ease;
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
      opacity 0.3s ease;
  }

  .archive-item:hover,
  .archive-item:focus,
  .archive-item.active {
    color: #ffffff;
  }

  .archive-item strong {
    display: block;
    margin: 0 0 6px;
    color: inherit;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.15;
    text-transform: uppercase;
    transition: color 0.3s ease;
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

    .archive-center-title strong {
      color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: clamp(18px, 3.2vw, 25px);
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.01em;
      text-transform: uppercase;
    }

    .active-image-preview {
      display: none;
    }

    .archive-items {
      position: fixed;
      top: 170px;
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

    .archive-item:hover,
    .archive-item:focus,
    .archive-item.active {
      color: #ffffff;
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
  }

  @media (max-width: 700px) {
    .archive-center-title {
      top: 105px;
      left: 16px;
      width: calc(100% - 32px);
    }

    .archive-center-title strong {
      font-size: clamp(14px, 4.2vw, 18px);
    }

    .archive-items {
      top: 150px;
      gap: 40px;
      padding: 0 16px calc(100px + env(safe-area-inset-bottom));
    }

    .archive-item {
      padding-left: 16px;
    }

    .archive-item p {
      font-size: 13px;
    }
  }
</style>
