export async function load({ fetch }) {
  const postsResponse = await fetch(
    "https://testing.zorawebdesign.com/wp-json/wp/v2/posts?_embed&per_page=100"
  );

  if (!postsResponse.ok) {
    return {
      years: [],
    };
  }

  const posts = await postsResponse.json();

  if (!Array.isArray(posts)) {
    return {
      years: [],
    };
  }

  const years = [
    ...new Set(
      posts
        .flatMap((post) => post._embedded?.["wp:term"]?.flat() || [])
        .filter(
          (term) =>
            term.taxonomy === "category" && /^\d{4}$/.test(term.name)
        )
        .map((term) => term.name)
    ),
  ].sort((a, b) => Number(b) - Number(a));

  return {
    years,
  };
}