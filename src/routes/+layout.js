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

function getFeaturedImage(post) {
  return (
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.thumbnail
      ?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium
      ?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    ""
  );
}

function getPostYear(post) {
  if (!post.date) return "";

  return String(new Date(post.date).getFullYear());
}

function getYearCategory(post, categoriesMap) {
  const postCategories = post.categories || [];

  for (const categoryId of postCategories) {
    const category = categoriesMap[categoryId];

    if (!category) continue;

    if (/^\d{4}$/.test(category.slug)) {
      return category;
    }

    if (category.parent && categoriesMap[category.parent]) {
      const parentCategory = categoriesMap[category.parent];

      if (/^\d{4}$/.test(parentCategory.slug)) {
        return parentCategory;
      }
    }
  }

  return null;
}

function postHasCategorySlug(post, categoriesMap, targetSlug) {
  const postCategories = post.categories || [];

  return postCategories.some((categoryId) => {
    const category = categoriesMap[categoryId];

    if (!category) return false;

    if (category.slug === targetSlug) return true;

    if (category.parent && categoriesMap[category.parent]) {
      return categoriesMap[category.parent].slug === targetSlug;
    }

    return false;
  });
}

export async function load({ fetch }) {
  const aboutMenuItems = [
    {
      id: 1,
      label: "About Eva",
      href: "/about",
      featuredImage: "",
    },
    {
      id: 2,
      label: "Buy my arts",
      href: "/about",
      featuredImage: "",
    },
    {
      id: 3,
      label: "Studio",
      href: "/about",
      featuredImage: "",
    },
    {
      id: 4,
      label: "Press",
      href: "/about",
      featuredImage: "",
    },
    {
      id: 5,
      label: "Contact",
      href: "/about",
      featuredImage: "",
    },
  ];

  const postsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/posts?_embed&per_page=100`,
  );

  const categoriesResponse = await fetch(
    `${PUBLIC_WP_API_URL}/categories?per_page=100`,
  );

  const posts = postsResponse.ok ? await postsResponse.json() : [];

  const categories = categoriesResponse.ok
    ? await categoriesResponse.json()
    : [];

  const categoriesMap = {};

  categories.forEach((category) => {
    categoriesMap[category.id] = category;
  });

  const works = posts.map((post) => {
    const title = decodeHtml(stripHtml(post.title?.rendered));
    const yearCategory = getYearCategory(post, categoriesMap);
    const yearSlug = yearCategory ? yearCategory.slug : getPostYear(post);

    const isPaintingPost = postHasCategorySlug(
      post,
      categoriesMap,
      "paintings",
    );

    const isExhibitionPost = postHasCategorySlug(
      post,
      categoriesMap,
      "exhibitions",
    );

    const isPerformancePost = postHasCategorySlug(
      post,
      categoriesMap,
      "performances",
    );

    let href = "#";

    if (isPaintingPost) {
      href = `/painting?post=${post.id}`;
    }

    if (isPerformancePost) {
      href = `/performances?post=${post.id}`;
    }

    if (isExhibitionPost) {
      href = yearSlug ? `/exhibitions/${yearSlug}` : "/exhibitions";
    }

    return {
      id: post.id,
      postSlug: String(post.id),
      label: title,
      title,
      year: yearSlug,
      yearSlug,
      isPaintingPost,
      isExhibitionPost,
      isPerformancePost,
      featuredImage: getFeaturedImage(post),
      href,
    };
  });

  const paintingMenuItems = works.filter((work) => work.isPaintingPost);

  const exhibitionMenuItems = works.filter((work) => work.isExhibitionPost);

  const performanceMenuItems = works.filter((work) => work.isPerformancePost);

  const eventsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/events?_embed&per_page=100`,
  );

  const eventsData = eventsResponse.ok ? await eventsResponse.json() : [];

  const eventMenuItems = eventsData.map((event) => ({
    id: event.id,
    label: decodeHtml(stripHtml(event.title?.rendered)),
    href: "/event",
    featuredImage:
      event.event_details?.featured_image_url ||
      event._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "",
  }));

  return {
    aboutMenuItems,
    paintingMenuItems,
    exhibitionMenuItems,
    performanceMenuItems,
    eventMenuItems,
  };
}