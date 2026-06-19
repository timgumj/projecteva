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

function getYearCategory(post, categoriesMap, paintingCategory) {
  const postCategories = post.categories || [];

  for (const categoryId of postCategories) {
    const category = categoriesMap[categoryId];

    if (!category) continue;

    if (/^\d{4}$/.test(category.slug)) {
      if (!paintingCategory || category.parent === paintingCategory.id) {
        return category;
      }
    }

    if (category.parent && categoriesMap[category.parent]) {
      const parentCategory = categoriesMap[category.parent];

      if (/^\d{4}$/.test(parentCategory.slug)) {
        if (!paintingCategory || parentCategory.parent === paintingCategory.id) {
          return parentCategory;
        }
      }
    }
  }

  return null;
}

export async function load({ fetch }) {
  const postsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/posts?_embed&per_page=100`
  );

  const categoriesResponse = await fetch(
    `${PUBLIC_WP_API_URL}/categories?per_page=100`
  );

  const posts = await postsResponse.json();
  const categories = await categoriesResponse.json();

  const categoriesMap = {};

  categories.forEach((category) => {
    categoriesMap[category.id] = category;
  });

  const paintingCategory = categories.find(
    (category) => category.slug === "painting"
  );

  const yearsMap = {};

  posts.forEach((post) => {
    const yearCategory = getYearCategory(post, categoriesMap, paintingCategory);

    if (!yearCategory) return;

    const year = decodeHtml(yearCategory.name);
    const yearSlug = yearCategory.slug;
    const postTitle = decodeHtml(stripHtml(post.title?.rendered));
    const postInfo = getFirstH2(post);
    const galleryImages = extractGalleryImages(post);

    if (!yearsMap[yearSlug]) {
      yearsMap[yearSlug] = {
        year,
        yearSlug,
        title: postTitle,
        info: postInfo,
        images: []
      };
    }

    galleryImages.forEach((image) => {
      if (!yearsMap[yearSlug].images.some((item) => item.src === image.src)) {
        yearsMap[yearSlug].images.push(image);
      }
    });
  });

  const years = Object.values(yearsMap).sort((a, b) => {
    return Number(b.year) - Number(a.year);
  });

  return {
    years
  };
}