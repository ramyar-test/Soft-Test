<template>
  <div class="container mx-auto p-5 py-10 sm:p-10">

    <!-- Title Page -->
    <h1 class="text-base font-semibold text-gray-700 mb-5">Dashboard</h1>

    <!-- Filters -->
    <div class="flex items-center gap-3 whitespace-nowrap mb-5">
      <!-- Search -->
      <input v-model="params.search" type="text"
        class="py-2.5 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        placeholder="Search..." />

      <!-- Select Status -->
      <div class="relative">
        <button
          class="relative z-10 flex items-center gap-2 border-2 border-blue-600 overflow-hidden focus:outline-none leading-loose align-middle px-4 py-1.5 rounded-md cursor-pointer text-sm bg-blue-600 text-white"
          @click="isOpenStatus = !isOpenStatus, isOpenChooser = false">
          <span v-if="params.published == ''">Select Status</span>
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
              :class="{ 'bg-blue-200 text-blue-700': params.published.id === type.id }"
              class="w-full flex items-center justify-between gap-2 text-sm capitalize text-start text-gray-900 hover:bg-blue-600 hover:text-white px-4 py-2 cursor-pointer">
              <span>{{ type.value }}</span>
              <span v-if="params.published.id === type.id">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" />
                </svg>
              </span>
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
    <vue3-datatable :rows="filterRows" :columns="cols" :loading="loading" :totalRows="total_rows"
      :pageSize="params.pagesize" :sortable="true" :sortColumn="params.sort_column"
      :sortDirection="params.sort_direction" :search="params.search" @change="changeServer"
      class="alt-pagination capitalize whitespace-nowrap">

      <template #id="data">
        <strong>#{{ data.value.id }}</strong>
      </template>

      <template #status="data">
        <span :class="data.value.status === 'published' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'"
          class="text-sm px-2 py-1 rounded-full text-xs">{{ data.value.status }}</span>
      </template>

      <template #content="data">
        <p class="truncate max-w-52">{{ data.value.content }}</p>
      </template>

      <template #actions="data">
        <div class="flex gap-4">

          <button type="button" class="text-green-800 cursor-pointer" @click="openModal(data.value)">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M1 12c0-5.185 0-7.778 1.61-9.39C4.223 1 6.816 1 12 1s7.778 0 9.39 1.61C23 4.223 23 6.816 23 12s0 7.778-1.61 9.39C19.777 23 17.184 23 12 23s-7.778 0-9.39-1.61C1 19.777 1 17.184 1 12"
                opacity="0.5" />
              <path fill="currentColor"
                d="M13.926 14.302c.245-.191.467-.413.912-.858l5.54-5.54c.134-.134.073-.365-.106-.427a6.1 6.1 0 0 1-2.3-1.449a6.1 6.1 0 0 1-1.45-2.3c-.061-.18-.292-.24-.426-.106l-5.54 5.54c-.445.444-.667.667-.858.912a5 5 0 0 0-.577.932c-.133.28-.233.579-.431 1.175l-.257.77l-.409 1.226l-.382 1.148a.817.817 0 0 0 1.032 1.033l1.15-.383l1.224-.408l.77-.257c.597-.199.895-.298 1.175-.432q.498-.237.933-.576m8.187-8.132a3.028 3.028 0 0 0-4.282-4.283l-.179.178a.73.73 0 0 0-.206.651c.027.15.077.37.168.633a4.9 4.9 0 0 0 1.174 1.863a4.9 4.9 0 0 0 1.862 1.174c.263.09.483.141.633.168c.24.043.48-.035.652-.207z" />
            </svg>
          </button>

          <button type="button" class="text-red-800 cursor-pointer" @click="deleteUser(data.value)">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877" />
              <path fill="currentColor" fill-rule="evenodd"
                d="M9.425 11.482c.413-.044.78.273.821.707l.5 5.263c.041.433-.26.82-.671.864c-.412.043-.78-.273-.821-.707l-.5-5.263c-.041-.434.26-.821.671-.864m5.15 0c.412.043.713.43.671.864l-.5 5.263c-.04.434-.408.75-.82.707c-.413-.044-.713-.43-.672-.864l.5-5.264c.041-.433.409-.75.82-.707"
                clip-rule="evenodd" />
              <path fill="currentColor"
                d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5s-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886"
                opacity="0.5" />
            </svg>
          </button>

        </div>
      </template>

    </vue3-datatable>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue';
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";
import axios from 'axios';
import { useBlogStore } from '@/stores/blog';

const blogStore = useBlogStore();

const isOpenStatus = ref(false);
const isOpenChooser = ref(false);

const types = ref([]);

const loading = ref(true);
const total_rows = ref(0);

const params = reactive({
  current_page: 1,
  pagesize: 10,
  search: '',
  published: '',
  column_filters: [],
  sort_column: 'id',
  sort_direction: 'desc',
});
const rows = ref([]);

const cols =
  ref([
    { field: 'id', title: 'ID', isUnique: true, type: 'number' },
    { field: 'author', title: 'Author', hide: true },
    { field: 'title', title: 'Title' },
    { field: 'status', title: 'Status' },
    { field: 'content', title: 'Content', sort: false, hide: true },
  ]) || [];

const filterRows = ref([]);

onMounted(async () => {
  loading.value = true
  await blogStore.fetchBlogs();
  setRows();
  setStatus();
  loading.value = false;
});

let timer;
const filterBlogs = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    filterRows.value = rows.value.filter((row) => {
      return (
        (!params.published || row.status.toLowerCase() === params.published.value.toLowerCase()) &&
        (!params.search || row.author.toLowerCase().includes(params.search.toLowerCase()) ||
          row.title.toLowerCase().includes(params.search.toLowerCase()) ||
          row.content.toLowerCase().includes(params.search.toLowerCase()))
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

const setRows = () => {
  rows.value = blogStore.blogs;
  total_rows.value = blogStore.totalRows;
  filterRows.value = rows.value;
};

const setStatus = () => {
  const uniqueStatuses = new Set();
  types.value = rows.value.reduce((acc, row) => {
    if (!uniqueStatuses.has(row.status)) {
      uniqueStatuses.add(row.status);
      acc.push({ id: acc.length + 1, value: row.status });
    }
    return acc;
  }, []);
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