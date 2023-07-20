<script setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';
// import { storeToRefs } from 'pinia';
// import { useUI } from '@/stores/ui';
// import { mapOptionsToParams } from '@/helpers/tableHelper';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW MODULE',
  flat: true,
  style: { color: 'black' },
  // to: { name: 'create-course' },
};

// UI states
// const uiStore = useUI();
// const { loading } = storeToRefs(uiStore);
const confirmDialog = ref(null);

// const coursesStore = useCourses();
// const { courses, coursesTotal } = storeToRefs(coursesStore);

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    sort: null,
    sortDirection: null,
    keyword: null,
    published: null,
    // join: ['modules', 'subject', 'author'],
  },
  total: {
    current: 0,
    overall: 0,
  },
};

let fetchParams = reactive({ ...initial.params });

function initialize() {
  // coursesStore.$reset();
  fetchParams = reactive({ ...initial.params });
}

// async function fetchCourses() {
//   await coursesStore.fetchCourses(fetchParams);

//   updateSubjectFilterOptions();
// }


// function onClearFilter() {
//   fetchParams.subjectId = null;

//   fetchCourses();
// }

// function editCourse(event, { item }) {
//   router.push({
//     name: 'edit-course',
//     params: { courseId: item.raw.id },
//   });
// }

// async function deleteCourse(id) {
//   const confirm = await confirmDialog.value.open({
//     title: 'Delete Course',
//     message:
//       'Deleting a course will also delete its modules, are you sure you want to delete this course?',
//     primaryAction: 'DELETE',
//     primaryColor: 'error',
//   });

//   if (confirm) {
//     await coursesStore.deleteCourse(id);
//   }
// }

// function onUpdateTableOptions(event) {
//   const updatedParams = mapOptionsToParams(event);

//   fetchParams = reactive({
//     ...initial.params,
//     ...updatedParams,
//   });

//   fetchCourses();
// }

// async function onAction({ action, item }) {
//   const id = item.raw.id;

//   switch (action) {
//     case 'delete':
//       await deleteCourse(id);
//       break;
//     case 'publish':
//       await coursesStore.updateCourse(id, { isPublished: true });
//       break;
//     case 'draft':
//       await coursesStore.updateCourse(id, { isPublished: false });
//       break;
//     default:
//       break;
//   }

//   // Re-fetch courses
//   fetchCourses();
// }

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
page-confirm-dialog(ref="confirmDialog")

page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  has-center-section
)
  template(#center-section)
    search-and-filter(
      v-model:search-text="fetchParams.keyword"
      v-model:status-filter="fetchParams.published"
    )
page-content
</template>
