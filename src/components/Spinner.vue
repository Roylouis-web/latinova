<script setup lang="ts">
import { faSpinner, faStar } from '@fortawesome/free-solid-svg-icons';
import { Fa } from 'vue-fa';

const props = defineProps<{
    message? : string
}>();

</script>

<template>
    <section class="grow relative flex justify-center items-center flex-col gap-6 text-xl md:text-2xl font-bold md:p-24">
        <div class="h-20 w-20 md:h-32 md:w-32 bg-black relative rounded-full">
            <Fa class="absolute right-[10%] md:right-[25%] top-[30%] animate-spin text-3xl md:text-5xl h-16 w-16 text-white" :icon="faStar" />
        </div>
        <p>{{ message ? message : 'Loading...' }}</p>
    </section>
</template>