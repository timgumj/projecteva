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
    .replace(/&amp;/g, "&");
}

function getFirstH2(post) {
  const html = post.content?.rendered || "";
  const match = html.match(/<h2[^>]*>(.*?)<\/h2>/i);

  return match ? decodeHtml(stripHtml(match[1])) : "";
}

function getFeaturedImage(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) return null;

  const src =
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium_large?.source_url ||
    media.media_details?.sizes?.full?.source_url ||
    media.source_url ||
    "";

  if (!src) return null;

  return {
    src,
    alt:
      decodeHtml(media.alt_text || "") ||
      decodeHtml(stripHtml(post.title?.rendered || "")) ||
      "Painting image"
  };
}

function extractGalleryImages(post, featuredImage = null) {
  const html = post.content?.rendered || "";
  const images = [];
  const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;

  let match;

  while ((match = regex.exec(html)) !== null) {
    const imgTag = match[0];
    const src = match[1];

    const altMatch = imgTag.match(/alt=["']([^"']*)["']/);
    const alt = altMatch
      ? decodeHtml(altMatch[1])
      : decodeHtml(stripHtml(post.title?.rendered || ""));

    const isDuplicate = images.some((image) => image.src === src);
    const isFeaturedImage = featuredImage?.src && src === featuredImage.src;

    if (src && !isDuplicate && !isFeaturedImage) {
      images.push({
        src,
        alt
      });
    }
  }

  return images;
}

function getPostYear(post) {
  if (!post.date) return "Works";

  return String(new Date(post.date).getFullYear());
}

export async function load({ fetch, url }) {
  const categoriesResponse = await fetch(
    `${PUBLIC_WP_API_URL}/categories?per_page=100`
  );

  const categories = await categoriesResponse.json();

  const paintingsCategory = categories.find(
    (category) => category.slug === "paintings"
  );

  if (!paintingsCategory) {
    return {
      paintings: [],
      requestedPostId: null
    };
  }

  const postsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/posts?_embed=1&per_page=100&categories=${paintingsCategory.id}`
  );

  const posts = await postsResponse.json();

  const paintings = posts.map((post) => {
    const year = getPostYear(post);
    const title = decodeHtml(stripHtml(post.title?.rendered || ""));
    const info = getFirstH2(post);
    const featuredImage = getFeaturedImage(post);
    const images = extractGalleryImages(post, featuredImage);

    return {
      id: post.id,
      year,
      postSlug: post.slug,
      title,
      info,
      featuredImage,
      images
    };
  });

  return {
    paintings,
    requestedPostId: Number(url.searchParams.get("post")) || null
  };
}