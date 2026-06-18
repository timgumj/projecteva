import { PUBLIC_WP_API_URL } from '$env/static/public';

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').trim();
}

function decodeHtml(text = '') {
  return text
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&');
}

function getFeaturedImage(post) {
  return (
    post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    ''
  );
}

function getYearCategory(post, categoriesMap) {
  const postCategories = post.categories || [];

  for (const categoryId of postCategories) {
    const category = categoriesMap[categoryId];

    if (!category) continue;

    if (category.parent && categoriesMap[category.parent]) {
      return categoriesMap[category.parent];
    }

    if (/^\d{4}$/.test(category.slug)) {
      return category;
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

  const works = posts.map((post) => {
    const yearCategory = getYearCategory(post, categoriesMap);

    const year = yearCategory ? decodeHtml(yearCategory.name) : 'Works';
    const yearSlug = yearCategory ? yearCategory.slug : '';

    return {
      id: post.id,
      title: decodeHtml(stripHtml(post.title.rendered)),
      year,
      yearSlug,
      featuredImage: getFeaturedImage(post),
      frontendLink: yearSlug ? `/exhibitions/${yearSlug}` : '#'
    };
  });

  return {
    works
  };
}