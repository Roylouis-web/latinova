<script setup lang="ts">

import Card from '@/components/Card.vue';
import router from '@/router';
import { onMounted, ref, watchEffect } from 'vue';
import { db } from '@/firebase/init';
import { payload } from '@/lib/helper';
import Spinner from '@/components/Spinner.vue';
import { collection, getDocs, query, type QuerySnapshot, type DocumentData } from 'firebase/firestore';

const data = ref<Outfit[]>([] as Outfit[]);
const search = ref('');
const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const outfits = ref<Outfit[]>([] as Outfit[]);
const paginatedOutfits = ref<Outfit[]>([] as Outfit[]);
const loading = ref(true);
const trackNext = ref(0);
const index = ref(0);

onMounted(() => {
    window.scroll(0, 0);
});

const nextStatus = async () => {
    const temp = outfits.value.slice(index.value, index.value + 10);

    if (temp.length) {
        return true;
    }
    return false;
}

const fetchData = async (next: boolean, prev: boolean) => {
    search.value = router.currentRoute.value.query.query as string;
    loading.value = true;
    if (next) {
        paginatedOutfits.value = outfits.value.slice(index.value, index.value + 10);
        index.value += 10;

        const checkNext = await nextStatus();

        if (!checkNext) {
            trackNext.value = 0;
        }

    } else if (prev) {
        if (index.value > 0) {
            paginatedOutfits.value = outfits.value.slice(index.value - 10, index.value);
            index.value -= 10;
        }
    } else {
        const docRef = query(collection(db, 'outfits'));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((outfit) => {
                if (!data.value.length) {
                    data.value.push({ id: outfit.id, ...outfit.data() } as Outfit)
                }
            });
            outfits.value = data.value.filter((outfit) => outfit.name.includes(search.value));
            paginatedOutfits.value = outfits.value.slice(0, 10);

            const checkNext = await nextStatus();

            if (!checkNext) {
                trackNext.value = 0;
            }
        }
    }
    
    loading.value = false;
}

const prevBtn = async () => {
    await fetchData(false, true);
}

const nextBtn = async () => {
    await fetchData(true, false);
}

watchEffect(async () => {
    await fetchData(false, false);
});

</script>

<template>
    <Spinner v-if="loading" />
    <section v-else-if="paginatedOutfits.length" class="grow mt-20 mb-12" id="top">
        <ul
            class="flex flex-col gap-10 justify-center items-center md:grid md:grid-cols-3 md:gap-y-12 mx-auto md:w-[85%]">
            <li v-for="({ imageUrls, name, price, category, id }) in paginatedOutfits">
                <Card :name="name" :image-url="imageUrls[0]" :price="price" :link="`/categories/${category}/items?id=${id}`" />
            </li>

        </ul>
        <aside class="flex mt-8 justify-between w-4/5 mx-auto md:w-[85%] text-lg md:text-xl">
            <button :class="`${index === 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="prevBtn"
                :disabled="index === 0 ? true : false">Previous</button>
            <button :class="`${trackNext == 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="nextBtn"
                :disabled="trackNext === 0 ? true : false">Next</button>
        </aside>
    </section>
    <p v-else
        class="text-2xl md:text-4xl justify-center items-center grow p-20 md:p-48 flex">
        No product found!
    </p>
</template>