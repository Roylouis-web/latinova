<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';
import Footer from '@/components/Footer.vue';
import Loader from './components/Loader.vue';
import Spinner from './components/Spinner.vue';

</script>

<template>
    <Loader />
    <NavBar />
    <SideBar />
    <RouterView />
    <Footer />
</template>
