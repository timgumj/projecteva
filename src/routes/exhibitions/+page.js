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

function extractGalleryImages(post) {
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
      : decodeHtml(stripHtml(post.title?.rendered));

    if (src && !images.some((image) => image.src === src)) {
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

export async function load({ fetch, url })  {
  const categoriesResponse = await fetch(
    `${PUBLIC_WP_API_URL}/categories?per_page=100`
  );

  const categories = await categoriesResponse.json();

  const exhibitionsCategory = categories.find(
    (category) => category.slug === "exhibitions"
  );

  if (!exhibitionsCategory) {
    return {
      selectedExhibitions: []
    };
  }

  const postsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/posts?_embed&per_page=100&categories=${exhibitionsCategory.id}`
  );

  const posts = await postsResponse.json();

  const selectedExhibitions = posts.map((post) => {
    const year = getPostYear(post);
    const title = decodeHtml(stripHtml(post.title?.rendered));
    const info = getFirstH2(post);
    const images = extractGalleryImages(post);

    return {
      id: post.id,
      year,
      yearSlug: String(post.id),
      title,
      info,
      images
    };
  });

  return {
  selectedExhibitions,
  requestedPostId: Number(url.searchParams.get("post")) || null
};
}