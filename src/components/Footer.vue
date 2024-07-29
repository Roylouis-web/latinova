<script setup lang="ts">
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Fa } from 'vue-fa';
</script>
<template>
    <footer class="flex bg-[#BB8E51] place-content-center p-10 text-white lg:text-2xl flex-col">
        <section class="flex flex-col gap-4 mb-4 items-center">
        <span class="flex gap-4 items-center">
            <Fa :icon="faPhone" />
            <p><a href="tel:+23407037471122"></a>+23407037471122</p>
        </span>
        <span class="flex gap-4 items-center">
            <Fa :icon="faEnvelope" />
            <p><a href="mailto:luxurybylatinova@gmail.com">luxurybylatinova@gmail.com</a></p>
        </span>
    </section>
        <p class="text-center">{{ `Latinova @${new Date().getFullYear()}` }}</p>
    </footer>
</template>