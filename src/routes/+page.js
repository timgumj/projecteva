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

function formatCategoryName(category) {
  return decodeHtml(category?.name || category?.slug || 'Home Page');
}

function getMainCategory(post, categoriesMap) {
  const postCategories = post.categories || [];

  for (const categoryId of postCategories) {
    const category = categoriesMap[categoryId];

    if (!category) continue;

    return category;
  }

  return null;
}

function getFrontendLink(post, category) {
  if (!category) {
    return `/works?post=${post.id}`;
  }

  if (category.slug === 'exhibitions') {
    return `/exhibitions?post=${post.id}`;
  }

  if (category.slug === 'paintings') {
    return `/painting?post=${post.id}`;
  }

  if (category.slug === 'performances') {
    return `/performances?post=${post.id}`;
  }

  return `/works?post=${post.id}`;
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
    const mainCategory = getMainCategory(post, categoriesMap);
    const group = mainCategory ? formatCategoryName(mainCategory) : 'Home Page';

    return {
      id: post.id,
      title: decodeHtml(stripHtml(post.title.rendered)),
      group,
      categorySlug: mainCategory?.slug || 'home-page',
      categoryId: mainCategory?.id || null,
      featuredImage: getFeaturedImage(post),
      frontendLink: getFrontendLink(post, mainCategory)
    };
  });

  return {
    works
  };
}