<script setup lang="ts">
import { ref } from 'vue';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Fa } from 'vue-fa';
import { getDownloadURL, ref as firebaseRef } from 'firebase/storage';
import { db, storage } from '@/firebase/init';
import { watchEffect } from 'vue';
import { addDoc, and, collection, deleteDoc, doc, getDoc, getDocs, query, QuerySnapshot, serverTimestamp, where, type DocumentData } from 'firebase/firestore';
import { payload } from '@/lib/helper';

const props = defineProps<{
    productId?: string,
    name: string,
    price: number,
    imageUrl: string,
    link: string
}>();

const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const wishList = ref(undefined as WishList | undefined);
const downloadedUrl = ref('');
const name = props.name.length > 17 ? props.name.slice(0, 18) : props.name;

watchEffect(async () => {
    const temp = [] as WishList[];
    if (payload.value.id && props.productId) {
        const docRef = query(collection(db, 'wishlist'), where('client.id', '==', payload.value.id));
        querySnapshot.value = await getDocs(docRef);
    
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((item) => temp.push({ id: item.id, ...item.data() } as WishList));
        }

        wishList.value = temp.find((wishListItem) => wishListItem.product.id === props.productId);
    }

    const storageRef = firebaseRef(storage, props.imageUrl);
    downloadedUrl.value = await getDownloadURL(storageRef);
});

const changeBGColor = async (event: MouseEvent) => {
    if (wishList.value) {
        deleteDoc(doc(db, 'wishlist', wishList.value.id));
    } else {
        const res = await getDoc(doc(db, 'outfits', props.productId as string));
        await addDoc(collection(db, 'wishlist'), { product: { id: res.id, ...res.data() }, client: payload.value, timestamp: serverTimestamp() });
    }

    const svg = event.target as any as SVGAElement;
    svg.classList.toggle('animate-heart');
    svg.classList.toggle('text-[#BB8E51]');
}

</script>

<template>
    <section
        :class="`flex flex-col gap-2 md:text-2xl text-xl shadow-black shadow hover:scale-110 transition-all duration-300 pb-2 w-[200px] md:w-[300px] scale-105`">
        <span class="flex justify-end">
            <Fa v-if="productId" :icon="faHeart" role="button" :class="`text-3xl md:text-4xl p-2 transition-all ${wishList && 'text-[#BB8E51]'}`"
                @click="(event: MouseEvent) => changeBGColor(event)" />
        </span>
        <RouterLink :to="link">
            <section>
                <section v-if="!downloadedUrl" class="h-[200px] w-full md:h-[300px] animate-loading-effect animation delay">
                </section>
                <img v-else :src="downloadedUrl" alt="item" class="h-[200px] w-full md:h-[300px]"/>
            </section>
            <section class="flex gap-2 flex-col justify-center items-center text-[16px] md:text-xl">
                <p>{{ name }}</p>
                <p>{{ `₦${price.toLocaleString()}` }}</p>
            </section>
        </RouterLink>
    </section>
</template>