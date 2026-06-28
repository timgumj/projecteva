import { PUBLIC_WP_API_URL } from "$env/static/public";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

function decodeHtml(text = "") {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function getFeaturedImage(post) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large
      ?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large
      ?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    ""
  );
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

function getCategorySlug(post) {
  const category =
    post._embedded?.["wp:term"]?.flat()?.find((term) => {
      return term.taxonomy === "category";
    }) || null;

  const slug = slugify(category?.slug || category?.name || "");

  if (slug === "painting" || slug === "paintings") return "painting";
  if (slug === "exhibition" || slug === "exhibitions") return "exhibitions";
  if (slug === "event" || slug === "events") return "event";
  if (slug === "performance" || slug === "performances") return "performances";

  return slug;
}

function getFrontendLink(post) {
  const categorySlug = getCategorySlug(post);

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

  return `/archive?post=${post.id}`;
}

export async function load({ fetch }) {
  const apiBase = PUBLIC_WP_API_URL?.replace(/\/$/, "");

  if (!apiBase) {
    return {
      posts: [],
    };
  }

  try {
    const postsResponse = await fetch(
      `${apiBase}/posts?_embed&per_page=100&orderby=date&order=desc`,
    );

    if (!postsResponse.ok) {
      return {
        posts: [],
      };
    }

    const posts = await postsResponse.json();

    const archivePosts = posts.map((post, index) => {
      const categorySlug = getCategorySlug(post);

      return {
        id: post.id,
        number: String(index + 1).padStart(2, "0"),
        title: decodeHtml(stripHtml(post.title?.rendered || "Untitled")),
        excerpt: decodeHtml(stripHtml(post.excerpt?.rendered || "")),
        content: decodeHtml(stripHtml(post.content?.rendered || "")),
        featuredImage: getFeaturedImage(post),
        categorySlug,
        frontendLink: getFrontendLink(post),
      };
    });

    return {
      posts: archivePosts,
    };
  } catch (error) {
    console.error("Archive posts could not be loaded:", error);

    return {
      posts: [],
    };
  }
}