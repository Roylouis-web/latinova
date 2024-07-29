<script setup lang="ts">
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Fa } from 'vue-fa';
import { ref, watchEffect } from 'vue';

const loading = ref(false);

watchEffect(() => {
    setTimeout(() => {
        loading.value = true;
    }, 3000)
});

</script>

<template>
    <section :class="{ hidden: loading}">
        <img src="/WhatsApp Image 2024-02-05 at 12.02.34 AM.jpeg" alt="loader" class="fixed h-full z-20 w-full">
        <Fa class="fixed z-30 top-3/4 right-[40%] md:right-[45%] animate-spin text-5xl md:text-7xl" :icon="faSpinner" />
    </section>
</template>