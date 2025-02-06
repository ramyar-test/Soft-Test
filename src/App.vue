<template>
  <div class="container mx-auto font-jost">
    <Navbar />

    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

</script>