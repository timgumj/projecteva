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

function formatEvent(event) {
  return {
    id: event.id,
    slug: event.slug,
    title: decodeHtml(stripHtml(event.title?.rendered)),
    content: event.content?.rendered || "",
    image: event.event_details?.featured_image_url || "",
    location: event.event_details?.location || "",
    address: event.event_details?.address || "",
    website: event.event_details?.website || "",
    date: event.event_details?.date || "",
    startTime: event.event_details?.start_time || "",
    endTime: event.event_details?.end_time || ""
  };
}

export async function load({ fetch }) {
  const response = await fetch(
    `${PUBLIC_WP_API_URL}/events?_embed&per_page=100`
  );

  if (!response.ok) {
    return {
      events: []
    };
  }

  const eventsData = await response.json();

  const events = eventsData
    .map(formatEvent)
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;

      return new Date(a.date) - new Date(b.date);
    });

  return {
    events
  };
}