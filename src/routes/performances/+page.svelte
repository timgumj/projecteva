<script>
  import WorkGalleryPage from "$lib/components/WorkGalleryPage.svelte";

  let { data } = $props();
</script>

<WorkGalleryPage
  items={data.performances}
  requestedPostId={data.requestedPostId}
  allLabel="ALL PERFORMANCES"
  itemLabel="Performance"
  itemLabelPlural="Performances"
  themeColor="#7b4cff"
  metaTitle="Performances | Eva Eichinger"
  metaDescription="Explore selected performances, documentation, image galleries, and contemporary art projects by Eva Eichinger."
/>
