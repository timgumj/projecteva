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
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function getFeaturedImage(post) {
  return (
    post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    ''
  );
}

export async function load({ fetch }) {
  const postsResponse = await fetch(
    `${PUBLIC_WP_API_URL}/posts?_embed&per_page=100`
  );

  if (!postsResponse.ok) {
    return {
      posts: []
    };
  }

  const posts = await postsResponse.json();

  const archivePosts = posts.map((post, index) => {
    return {
      id: post.id,
      number: String(index + 1).padStart(2, '0'),
      title: decodeHtml(stripHtml(post.title?.rendered || 'Untitled')),
      excerpt: decodeHtml(stripHtml(post.excerpt?.rendered || '')),
      content: decodeHtml(stripHtml(post.content?.rendered || '')),
      featuredImage: getFeaturedImage(post),
      frontendLink: post.slug ? `/blog/${post.slug}` : '#'
    };
  });

  return {
    posts: archivePosts
  };
}