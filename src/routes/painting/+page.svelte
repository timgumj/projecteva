<script>
  import WorkGalleryPage from "$lib/components/WorkGalleryPage.svelte";

  let { data } = $props();
</script>

<WorkGalleryPage
  items={data.paintings}
  requestedPostId={data.requestedPostId}
  allLabel="ALL PAINTINGS"
  itemLabel="Painting"
  itemLabelPlural="Paintings"
  themeColor="#ff5c01"
  metaTitle="Paintings | Eva Eichinger"
  metaDescription="Explore selected paintings, visual works, image galleries, and contemporary art projects by Eva Eichinger."
/>
