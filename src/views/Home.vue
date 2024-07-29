<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel';
import { hash } from '@/lib/helper';

const images = [
  {
    imageUrl: '/WhatsApp Image 2024-01-14 at 13.07.46.jpeg',
    message: '<p class="md:ml-10 lg:mt-0 mt-10 text-gray-900 brightness-105 text-[16px] font-bold text-slate-800 lg:text-4xl lg:w-[510px]">Our Designs, Strut It With Confidence And Be Unapologetically You.</p>'
  },
  {
    imageUrl: '/WhatsApp Image 2024-01-14 at 13.07.42.jpeg',
    message: '<p class="text-[16px] font-bold text-slate-800 lg:text-4xl lg:w-[510px] md:ml-10 lg:mt-0 mt-10 text-gray-900 brightness-105">Our Designs Are Affordable For Everyone To Own.</p>'
  },
  {
    imageUrl: '/WhatsApp Image 2024-01-14 at 13.18.15.jpeg',
    message: '<p class="text-[16px] font-bold text-slate-800 lg:text-4xl lg:w-[510px] md:ml-10 lg:mt-0 mt-10 text-gray-900 brightness-105">We Deliver Locally And Internationally.</p>'
  }
];

</script>
<template>
        <section class="grow pt-10 lg:pt-0 mb-12 lg:pl-12">
          <Carousel :items-to-show="1" :autoplay="3000" :wrap-around="true">
            <Slide v-for="({ imageUrl, message }) in images" :key="imageUrl" class="flex p-4 lg:p-20 gap-4 md:gap-6">
              <img :src="imageUrl" alt="slide" class="h-[300px] w-[300px] lg:h-[500px] lg:w-screen md:w-4/6" />
              <p v-html="message"></p>
            </Slide>
          </Carousel>
          <RouterLink
          @click="hash = 'categories/dresses'"
          to="/categories" class="flex justify-center mt-24 rounded-xl text-white bg-[#BB8E51] w-1/2 mx-auto p-2 text-xl md:text-2xl lg:mb-32 md:p-4 hover:opacity-90">Shop Now</RouterLink>
      </section>
</template>