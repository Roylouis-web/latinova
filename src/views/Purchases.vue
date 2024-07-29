<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue';
import { db } from '@/firebase/init';
import { payload } from '@/lib/helper';
import router from '@/router';
import { collection, getDocs, where, query, orderBy, and, type QuerySnapshot, type DocumentData, startAfter, endBefore, limit, limitToLast } from 'firebase/firestore';

if (!payload.value.id) {
    router.push('/login');
}

const purchases = ref<Order[]>([] as Order[]);
const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const loading = ref(true);
const trackNext = ref(0);
const trackPrev = ref(0);

onMounted(() => {
    window.scroll(0, 0);
});

const nextStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
    const docRef = query(collection(db, 'orders'), where('status', '!=', 'delivered'), orderBy('timestamp', 'desc'), startAfter(last), limit(10));
    querySnapshot2.value = await getDocs(docRef);
    if (!querySnapshot2.value.empty) {
        return true
    }

    return false;
}

const prevStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const first = querySnapshot.value.docs[0];
    const docRef = query(collection(db, 'orders'), where('status', '!=', 'delivered'), orderBy('timestamp', 'desc'), endBefore(first), limitToLast(10));
    querySnapshot2.value = await getDocs(docRef);
    if (!querySnapshot2.value.empty) {
        return true
    }

    return false;
}


const fetchData = async (next: boolean, prev: boolean) => {
    const temp = [] as Order[];
    loading.value = true;
    if (next) {
        const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
        const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '==', 'delivered')), orderBy('timestamp', 'desc'), startAfter(last), limit(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((order) => temp.push({ id: order.id, ...order.data() } as Order));

            purchases.value = temp;

            const checkNext = await nextStatus();

            const checkPrev = await prevStatus();

            if (checkPrev) {
                trackPrev.value = 1;
            }

            if (!checkNext) {
                trackNext.value = 0;
            }
        }
    } else if (prev) {
        const first = querySnapshot.value.docs[0];
        const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '==', 'delivered')), orderBy('timestamp', 'desc'), endBefore(first), limitToLast(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((order) => temp.push({ id: order.id, ...order.data() } as Order));

            purchases.value = temp;

            const checkPrev = await prevStatus();

            const checkNext = await nextStatus();

            if (checkNext) {
                trackPrev.value = 1;
            }

            if (!checkPrev) {
                trackPrev.value = 0;
            }
        }
    } else {
        const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '==', 'delivered')), orderBy('timestamp', 'desc'), limit(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((order) => purchases.value.push({ id: order.id, ...order.data() } as Order));

            const checkNext = await nextStatus();

            if (checkNext) {
                trackNext.value = 1;
            }
        }
    }
    loading.value = false;
}

watchEffect(async () => {
    await fetchData(false, false);
});

const prevBtn = async () => {
    await fetchData(false, true);
}

const nextBtn = async () => {
    await fetchData(true, false);
}

</script>

<template>
    <Spinner v-if="loading" />
    <section v-else-if="purchases.length" class="grow mt-10 text-xl md:text-3xl mb-16 rounded-xl p-4">
        <ul class="flex flex-col gap-6">
            <li v-for="({ id, status, product, createdAt, deliveredAt }) in purchases" :key="id">
                <section v-for="p in product"
                    class="shadow-black shadow p-4 rounded flex md:gap-10 gap-6 flex-col md:flex-row w-4/5 mx-auto">
                    <section class="flex justify-center">
                        <Card :name="p.product.name" :price="p.product.price" :imageUrl="p.product.imageUrls[0]"
                            :link="`/categories/${p.product.category}/items?id=${p.product.id}`" />
                    </section>
                    <section class="flex flex-col place-content-center gap-4 md:w-2/6 italic">
                        <aside class="justify-center md:block flex">
                            <span>
                                <p class="p-2 text-[16px] md:text-xl font-bold ">
                                    {{ `order date: ${createdAt}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold ">
                                    {{ `delivery date: ${deliveredAt}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                    {{ `quantity: ${p.quantity}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                    {{ `waist: ${p.waist}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                    {{ `hips: ${p.hips}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                    {{ `height: ${p.height}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                    {{ `colour: ${p.colour}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                    {{ `delivery type: ${p.deliveryType}` }}
                                </p>
                                <p class="p-2 text-[16px] md:text-xl font-bold text-left">{{ `status: ${status}`
                                    }}</p>
                            </span>
                        </aside>
                        <RouterLink :to="`/categories/${p.product.category}/items?id=${p.product.id}`"
                            class="bg-[#BB8E51] text-white p-2 text-[16px] md:text-xl font-bold flex justify-center">
                            Buy Again
                        </RouterLink>
                    </section>
                </section>
            </li>
        </ul>
        <aside class="flex mt-8 justify-between w-4/5 mx-auto">
            <button :class="`${trackPrev === 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="prevBtn"
                :disabled="trackPrev === 0 ? true : false">Previous</button>
            <button :class="`${trackNext == 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="nextBtn"
                :disabled="trackNext === 0 ? true : false">Next</button>
        </aside>
    </section>
    <p v-else
        class="text-2xl md:text-4xl justify-center items-center grow p-20 md:p-48 flex">
        No purchases yet !
    </p>
</template>