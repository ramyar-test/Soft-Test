<template>
  <div class="container mx-auto p-5 py-10 sm:p-10">

    <!-- Title Page -->
    <h1 class="text-base font-semibold text-gray-700 mb-5">Blogs</h1>

    <!-- Filters -->
    <div class="flex items-center gap-3 whitespace-nowrap mb-5">
      <!-- Search -->
      <input v-model="params.search" type="text"
        class="py-2.5 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        placeholder="Search..." />

      <!-- Select Type -->
      <div class="relative">
        <button
          class="relative z-10 flex items-center gap-2 border-2 border-blue-600 overflow-hidden focus:outline-none leading-loose align-middle px-4 py-1.5 rounded-md cursor-pointer text-sm bg-blue-600 text-white"
          @click="isOpenStatus = !isOpenStatus, isOpenChooser = false">
          <span v-if="params.published == ''">Select Type</span>
          <span v-else class="capitalize">{{ params.published.value }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path
                d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path fill="currentColor"
                d="M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95l4.95-4.95a1 1 0 0 1 1.414 1.414z" />
            </g>
          </svg>
        </button>

        <div v-if="isOpenStatus" @click="isOpenStatus = false" tabindex="-1"
          class="fixed inset-0 h-full w-full bg-black opacity-0 cursor-default">
        </div>

        <transition>
          <div v-if="isOpenStatus"
            class="absolute top-full rtl:start-0 ltr:end-0 z-50 min-w-40 max-w-max py-2 mt-1 rounded-lg border-gray-900 bg-white shadow-xl">
            <button type="button" v-for="type in types" :key="type.id" @click="selectType(type); isOpenStatus = false"
              :class="{ 'bg-blue-600 text-white': params.published.id === type.id }"
              class="w-full text-sm capitalize text-start text-gray-900 hover:bg-blue-600 hover:text-white block px-4 py-2 cursor-pointer">
              {{ type.value }}
            </button>
          </div>
        </transition>

      </div>

      <!-- Column Chooser -->
      <div class="relative">
        <button type="button"
          class="relative flex items-center gap-2 border-2 border-blue-600 overflow-hidden focus:outline-none leading-loose align-middle px-4 py-2.5 rounded-md cursor-pointer text-sm bg-blue-600 text-white"
          @click="isOpenChooser = !isOpenChooser, isOpenStatus = false">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 512 512">
            <path fill="currentColor"
              d="M472 168H40a24 24 0 0 1 0-48h432a24 24 0 0 1 0 48m-80 112H120a24 24 0 0 1 0-48h272a24 24 0 0 1 0 48m-96 112h-80a24 24 0 0 1 0-48h80a24 24 0 0 1 0 48" />
          </svg>
        </button>

        <div v-if="isOpenChooser" @click="isOpenChooser = false" tabindex="-1"
          class="fixed inset-0 h-full w-full bg-black opacity-0 cursor-default">
        </div>

        <transition>
          <ul v-if="isOpenChooser"
            class="absolute top-full rtl:start-0 ltr:end-0 mt-1 p-2.5 z-50 min-w-[150px] bg-white rounded-md shadow-md space-y-1">
            <li v-for="col in cols" :key="col.field">
              <label class="flex items-center gap-2 w-full cursor-pointer text-gray-600 hover:text-black">
                <input type="checkbox"
                  class="form-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  :checked="!col.hide" @change="col.hide = !$event.target.checked" />
                <span>{{ col.title }}</span>
              </label>
            </li>
          </ul>
        </transition>
      </div>

    </div>

    <!-- Table -->
    <vue3-datatable :rows="filterRows" :columns="cols" :loading="loading" :totalRows="total_rows" :isServerMode="true"
      :pageSize="params.pagesize" :search="params.search" :sortable="true" @change="changeServer"
      class="alt-pagination">

      <template #status="{ data }">
        <span v-if="data === 'published'" class="text-green-500 bg-green-100 rounded-full px-2 py-1">Published</span>
        <span v-else class="text-red-500 bg-red-100 rounded-full px-2 py-1">Unpublished</span>
      </template>

      <template #actions="data">
        <div class="flex gap-4">
          <button type="button" class="btn btn-success !py-1" @click="viewUser(data.value)">View</button>
          <button type="button" class="btn btn-danger !py-1" @click="deleteUser(data.value)">Delete</button>
        </div>
      </template>

    </vue3-datatable>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue';
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css'
import axios from 'axios';
import { useBlogStore } from '@/stores/blog';

const blogStore = useBlogStore();

const isOpenStatus = ref(false);
const isOpenChooser = ref(false);

const types = [
  { id: 1, value: 'published' },
  { id: 2, value: 'unpublished' },
]

const loading = ref(true);
const total_rows = ref(0);

const params = reactive({
  current_page: 1,
  pagesize: 10,
  search: '',
  published: '',
  column_filters: [],
});
const rows = ref([]);

const cols =
  ref([
    { field: 'id', title: 'ID', isUnique: true, type: 'number' },
    { field: 'author', title: 'Author' },
    { field: 'title', title: 'Title' },
    { field: 'status', title: 'Status' },
    { field: 'content', title: 'Content', sort: false },
    { field: 'actions', title: 'Actions', sort: false },
  ]) || [];

const filterRows = ref([]);

onMounted(async () => {
  loading.value = true
  await blogStore.fetchBlogs();
  rows.value = blogStore.blogs;
  console.log(rows.value);
  total_rows.value = blogStore.totalRows;
  filterRows.value = rows.value;
  loading.value = false;
});

let timer;
const filterBlogs = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    filterRows.value = rows.value.filter((row) => {
      console.log(row.status, params.published.value);
      return (
        (params.published ? row.status != params.published.value : true) &&
        (params.search ? row.author.toLowerCase().includes(params.search.toLowerCase()) : true) ||
        (params.search ? row.title.toLowerCase().includes(params.search.toLowerCase()) : true) ||
        (params.search ? row.content.toLowerCase().includes(params.search.toLowerCase()) : true)
      );
    });
    total_rows.value = filterRows.value.length;
  }, 300);
};

const selectType = (type) => {

  // check if the selected type is the same as the current selected type
  if (params.published.id === type.id) {
    // if it is, then set the selected type to null
    params.published = '';
    filterBlogs();
    return;
  }

  params.published = type;
  filterBlogs();
};

const changeServer = (event) => {
  params.current_page = event.currentPage;
  params.pagesize = event.pageSize;

  filterBlogs();
};
</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>