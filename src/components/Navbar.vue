<template>
    <header class="flex flex-nowrap sm:justify-start sm:flex-nowrap w-full bg-gray-200 text-sm py-5">
        <nav class="container mx-auto px-4 sm:px-10 flex flex-nowrap items-center justify-between">
            <RouterLink :to="{ name: 'dashboard' }"
                class="flex justify-center sm:justify-baseline font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white">
                Soft Test
            </RouterLink>
            <div class="flex flex-row items-center gap-5">
                <RouterLink :to="{ name: 'dashboard' }" active-class="!text-blue-500 dark:!text-blue-400"
                    class="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500">
                    Dashboard
                </RouterLink>
                <RouterLink :to="{ name: 'blogs' }" active-class="!text-blue-500 dark:!text-blue-400"
                    class="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500">
                    Blogs
                </RouterLink>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref } from 'vue';

</script>