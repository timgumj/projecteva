import { PUBLIC_WP_API_URL } from '$env/static/public';

function cleanText(html = '') {
	return html.replace(/<[^>]*>/g, '').trim();
}

function extractHeading(html = '') {
	const match = html.match(/<h2[^>]*>(.*?)<\/h2>/);

	return match ? cleanText(match[1]) : '';
}

function extractImages(html = '') {
	const imageRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^"]*)"[^>]*>/g;

	const images = [];
	let match;

	while ((match = imageRegex.exec(html)) !== null) {
		images.push({
			src: match[1],
			alt: match[2] || 'Exhibition image'
		});
	}

	return images;
}

export async function load({ fetch, params }) {
	const categoriesResponse = await fetch(
		`${PUBLIC_WP_API_URL}/categories?per_page=100`
	);

	if (!categoriesResponse.ok) {
		return {
			title: 'Exhibition not found',
			year: params.year,
			credit: '',
			images: [],
			previousYear: null,
			nextYear: null
		};
	}

	const allCategories = await categoriesResponse.json();

	if (!Array.isArray(allCategories)) {
		return {
			title: 'Exhibition not found',
			year: params.year,
			credit: '',
			images: [],
			previousYear: null,
			nextYear: null
		};
	}

	const yearCategories = allCategories
		.filter((category) => /^\d{4}$/.test(category.slug))
		.sort((a, b) => Number(b.slug) - Number(a.slug));

	const currentCategory = yearCategories.find(
		(category) => category.slug === params.year
	);

	if (!currentCategory) {
		return {
			title: 'Exhibition not found',
			year: params.year,
			credit: '',
			images: [],
			previousYear: null,
			nextYear: null
		};
	}

	const currentIndex = yearCategories.findIndex(
		(category) => category.slug === params.year
	);

	const nextCategory = yearCategories[currentIndex + 1] || null;
	const previousCategory = yearCategories[currentIndex - 1] || null;

	const postsResponse = await fetch(
		`${PUBLIC_WP_API_URL}/posts?categories=${currentCategory.id}&_embed&per_page=1`
	);

	if (!postsResponse.ok) {
		return {
			title: 'No exhibition found for this year',
			year: currentCategory.name,
			credit: '',
			images: [],
			previousYear: previousCategory ? previousCategory.slug : null,
			nextYear: nextCategory ? nextCategory.slug : null
		};
	}

	const posts = await postsResponse.json();

	if (!Array.isArray(posts)) {
		return {
			title: 'No exhibition found for this year',
			year: currentCategory.name,
			credit: '',
			images: [],
			previousYear: previousCategory ? previousCategory.slug : null,
			nextYear: nextCategory ? nextCategory.slug : null
		};
	}

	const post = posts[0];

	if (!post) {
		return {
			title: 'No exhibition found for this year',
			year: currentCategory.name,
			credit: '',
			images: [],
			previousYear: previousCategory ? previousCategory.slug : null,
			nextYear: nextCategory ? nextCategory.slug : null
		};
	}

	const content = post.content?.rendered || '';

	return {
		title: cleanText(post.title?.rendered || ''),
		year: currentCategory.name,
		credit: extractHeading(content),
		images: extractImages(content),
		previousYear: previousCategory ? previousCategory.slug : null,
		nextYear: nextCategory ? nextCategory.slug : null
	};
}