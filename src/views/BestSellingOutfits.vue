<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { db } from '@/firebase/init';
import { collection, getDocs, where, query, orderBy, and, startAfter, endBefore, limit, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import router from '@/router';
import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue';

const state = ref();
const outfits = ref<Outfit[]>([] as Outfit[]);
const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const loading = ref(true);

const trackNext = ref(0);
const trackPrev = ref(0);

const nextStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
    const docRef = query(collection(db, 'outfits'), and(where('tags', '==', 'Best Selling'), where('category', '==', state.value)), orderBy('timestamp', 'desc'), startAfter(last), limit(10));
    querySnapshot2.value = await getDocs(docRef);
    if (!querySnapshot2.value.empty) {
        return true;
    }

    return false;
}

const prevStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
    const docRef = query(collection(db, 'outfits'), and(where('tags', '==', 'Best Selling'), where('category', '==', state.value)), orderBy('timestamp', 'desc'), endBefore(last), limit(10));
    querySnapshot2.value = await getDocs(docRef);
    if (!querySnapshot2.value.empty) {
       return true;
    }
    return false;
}

const fetchData = async (next: boolean, prev: boolean) => {
    state.value = router.currentRoute.value.params.category;

    if (router.currentRoute.value.params.category) {
        if (next) {
            const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
            const docRef = query(collection(db, 'outfits'), and(where('tags', '==', 'Best Selling'), where('category', '==', state.value)), startAfter(last), orderBy('timestamp', 'desc'), limit(10));
            querySnapshot.value = await getDocs(docRef);
            if (!querySnapshot.value.empty) {
                querySnapshot.value.forEach((outfit) => {
                    outfits.value.push({ id: outfit.id, ...outfit.data() } as Outfit);
                });

                const checkNext = await nextStatus();

                if (!checkNext) {
                    trackNext.value = 0;
                }
            }

        } else if (prev) {
            const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
            const docRef = query(collection(db, 'outfits'), and(where('tags', '==', 'Best Selling'), where('category', '==', state.value)), endBefore(last), orderBy('timestamp', 'desc'), limit(10));
            querySnapshot.value = await getDocs(docRef);
            if (!querySnapshot.value.empty) {
                querySnapshot.value.forEach((outfit) => {
                    outfits.value.push({ id: outfit.id, ...outfit.data() } as Outfit);
                });

                const checkPrev = await prevStatus();

                if (!checkPrev) {
                    trackPrev.value = 0;
                }
            }
        } else {
            const docRef = query(collection(db, 'outfits'), and(where('tags', '==', 'Best Selling'), where('category', '==', state.value)), orderBy('timestamp', 'desc'), limit(10));
            querySnapshot.value = await getDocs(docRef);
            if (!querySnapshot.value.empty) {
                querySnapshot.value.forEach((outfit) => {
                    outfits.value.push({ id: outfit.id, ...outfit.data() } as Outfit);
                });

                const checkNext = await nextStatus();
                const checkPrev = await prevStatus();

                if (checkNext) {
                    trackNext.value = 1;
                }

                if (checkPrev) {
                    trackPrev.value = 1
                }
            }
        }
    }
}

watchEffect(async () => {
    await fetchData(false, false);
    loading.value = false;
});

const prevBtn = async () => {
    await fetchData(false, true);
}

const nextBtn = async () => {
    await fetchData(true, false);
}

</script>

<template>
    <section v-if="outfits.length" class="grow mt-20 mb-12" id="top">
        <ul
            class="flex flex-col gap-10 justify-center items-center md:grid md:grid-cols-3 md:gap-y-12 mx-auto md:w-[85%]">
            <li v-for="({ imageUrls, name, price, category, id }) in outfits">
                <Card :name="name" :imageUrl="imageUrls[0]" :price="price"
                    :link="`/categories/${category}/items?id=${id}`" />
            </li>
        </ul>
        <aside class="flex mt-8 justify-between w-4/5 mx-auto md:w-[85%] text-lg md:text-xl">
            <button :class="`${trackPrev === 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="prevBtn"
                :disabled="trackPrev === 0 ? true : false">Previous</button>
            <button :class="`${trackNext == 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="nextBtn"
                :disabled="trackNext === 0 ? true : false">Next</button>
        </aside>
    </section>
    <p v-else-if="!loading && !outfits.length"
        class="text-2xl md:text-4xl justify-center items-center grow p-20 md:p-48 flex">
        No product found!
    </p>
    <Spinner v-else />
</template>