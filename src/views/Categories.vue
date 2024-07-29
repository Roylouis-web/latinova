<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import Card from '@/components/Card.vue';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel';
import { db } from '@/firebase/init';
import { collection, getDocs, where, query, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import Spinner from '@/components/Spinner.vue';

const outfits = ref<Tag[]>([] as Tag[]);
const show = ref(innerWidth >= 1024 ? 3 : innerWidth >= 768 ? 2 : 1);
const categories = [
    'Pants', 'Dresses', 'Skirts',
    'Jumpsuits', 'Tops', 'Two-Pieces'
];
const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const loading = ref(true);

watchEffect(async () => {
    const docRef = query(collection(db, 'outfits'), where('tags', '==', 'Normal'));
    querySnapshot.value = await getDocs(docRef);
    if (!querySnapshot.value.empty) {
        categories.forEach((category) => {
            const temp: Tag = {
                name: category,
                data: []
            }
            querySnapshot.value.forEach((outfit) => {
                if (outfit.data().category === category) {
                    temp.data.push(outfit.data() as Outfit);
                }
            });
            if (temp.data.length) {
                outfits.value.push(temp);
            }
        });
    }
    loading.value = false;
});

watchEffect(() => {
    window.addEventListener('resize', () => {
        show.value = innerWidth >= 1024 ? 3 : innerWidth >= 768 ? 2 : 1;
    });
});

</script>

<template>
    <section v-if="outfits.length" class="mt-24 grow">
        <article class="pt-4 mb-16 lg:pl-12" v-for="({name, data }) in outfits">
            <h1 class="font-bold text-xl md:text-4xl mb-10 bg-black text-white p-3  w-11/12 mx-auto">{{ name }}</h1>
                <Carousel
             :items-to-show="show" :autoplay="3000" :wrap-around="true">
                <Slide v-for="d in data" :key="d.id">
                    <Card 
                    :name="d.name" 
                    :imageUrl="d.imageUrls[0]"
                    :price="d.price" 
                    :link="`categories/${d.category}`"
                    class="m-4"/>
                </Slide>
            </Carousel>
        </article>
    </section>
    <p v-else-if="!loading && !outfits.length"
        class="text-2xl md:text-4xl justify-center items-center grow p-20 md:p-48 flex">
        No outfits yet !
    </p>
    <Spinner v-else />
</template>