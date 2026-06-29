<script>
  import WorkGalleryPage from "$lib/components/WorkGalleryPage.svelte";

  let { data } = $props();
</script>

<WorkGalleryPage
  items={data.exhibitions}
  requestedPostId={data.requestedPostId}
  allLabel="ALL EXHIBITIONS"
  itemLabel="Exhibition"
  itemLabelPlural="Exhibitions"
  themeColor="#5f8f3f"
  metaTitle="Exhibitions | Eva Eichinger"
  metaDescription="Explore selected exhibitions, installation views, image galleries, and contemporary art projects by Eva Eichinger."
/>
