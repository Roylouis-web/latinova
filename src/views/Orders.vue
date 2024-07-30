<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue';
import { db } from '@/firebase/init';
import { orderCount, payload } from '@/lib/helper';
import router from '@/router';
import { collection, deleteDoc, doc, getDocs, where, query, orderBy, limit, startAfter, endBefore, type QuerySnapshot, type DocumentData, and, limitToLast, updateDoc } from 'firebase/firestore';

const orders = ref([] as Order[]);
const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const temp = ref<Cart[]>([] as Cart[]);
const loading = ref(true);
const trigger = ref(false);
const trackNext = ref(0);
const trackPrev = ref(0);

onMounted(() => {
    window.scroll(0, 0);
});


const nextStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
    const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '!=', 'delivered')), orderBy('timestamp', 'desc'), startAfter(last), limit(10));
    querySnapshot2.value = await getDocs(docRef);
    if (!querySnapshot2.value.empty) {
        return true;
    }

    return false;
}

const prevStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const first = querySnapshot.value.docs[0];
    const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '!=', 'delivered')), orderBy('timestamp', 'desc'), endBefore(first), limitToLast(10));
    querySnapshot2.value = await getDocs(docRef);
    if (!querySnapshot2.value.empty) {
        return true;
    }

    return false;
}


const fetchData = async (next: boolean, prev: boolean) => {
    const temp = [] as Order[];
    loading.value = true;
    if (next) {
        const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
        const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '!=', 'delivered')), orderBy('timestamp', 'desc'), startAfter(last), limit(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((order) => temp.push({ id: order.id, ...order.data() } as Order));

            orders.value = temp

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
        const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '!=', 'delivered')), orderBy('timestamp', 'desc'), endBefore(first), limitToLast(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((order) => temp.push({ id: order.id, ...order.data() } as Order));

            orders.value = temp

            const checkPrev = await prevStatus();

            const checkNext = await nextStatus();

            if (checkNext) {
                trackNext.value = 1;
            }

            if (!checkPrev) {
                trackPrev.value = 0;
            }
        }
    } else {
        const docRef = query(collection(db, 'orders'), and(where('client.id', '==', payload.value.id), where('status', '!=', 'delivered')), orderBy('timestamp', 'desc'), limit(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((order) => orders.value.push({ id: order.id, ...order.data() } as Order));

            const checkNext = await nextStatus();

            if (checkNext) {
                trackNext.value = 1;
            }
        }
    }
    loading.value = false;
}

watchEffect(async () => {
    if (!payload.value.id) {
        router.push('/login');
    }
    
    await fetchData(false, false);
});

const prevBtn = async () => {
    await fetchData(false, true);
}

const nextBtn = async () => {
    await fetchData(true, false);
}

const cancelOrder = async (id: string, productId: string) => {
    temp.value = [];
    querySnapshot.value.forEach(async (order) => {
        if (order.data().product.length === 1) {
            const docRef = doc(db, 'orders', order.id);
            await deleteDoc(docRef);
            orders.value = orders.value.filter((o) => o.id !== id);
            if (orderCount.value > 0) {
                orderCount.value -= 1;
            }
        } else {
            orders.value.map(order => {
                order.product = order.product.filter(product => {
                    if (product.id === productId) {
                        trigger.value = true;
                    }
                    return product.id !== productId
                });

                if (trigger.value) {
                    updateDoc(doc(db, 'orders', id), {
                        product: order.product
                    });
                }
            });
            trigger.value = false;
        }
    });
}

const show = (id: string) => {
    const popUp = document.getElementById(id);
    popUp?.classList.remove('hidden');
    popUp?.classList.add('flex');
}

const hide = (id: string) => {
    const popUp = document.getElementById(id);
    popUp?.classList.remove('flex');
    popUp?.classList.add('hidden');
}

</script>


<template>
    <Spinner v-if="loading" />
    <section v-else-if="orders.length" class="grow mt-10 text-xl md:text-3xl mb-16 rounded-xl p-4">
        <ul class="flex flex-col gap-6">
            <li v-for="({ id, product }) in orders" :key="id">
                <section v-for="p in product" :key="p.id"
                    class="shadow-black shadow p-4 rounded flex md:gap-16 gap-6 flex-col md:flex-row w-4/5 mx-auto relative">
                    <section class="flex justify-center">
                        <Card :name="p.product.name" :price="p.product.price" :imageUrl="p.product.imageUrls[0]"
                            :link="`/categories/${p.product.category}/items?id=${p.product.id}`" />
                    </section>
                    <section class="flex flex-col place-content-center gap-6 md:w-2/6">
                        <p class="text-center md:text-left">{{ `Quantity: ${p.quantity}` }}</p>
                        <button @click="show(id)" class="bg-black text-white p-2 text-[16px] md:text-xl font-bold">
                            Cancel Order
                        </button>
                        <RouterLink :to="`/track_order?id=${id}`" class="bg-[#BB8E51] text-white p-2 text-[16px] md:text-xl
                        flex justify-center font-bold">
                            Track Order
                        </RouterLink>
                    </section>
                    <section :id="id"
                        class="shadow-black shadow-xl p-4
                        bg-slate-100 rounded flex-col justify-center items-center gap-6 w-full absolute top-20 right-1 hidden lg:p-8">
                        <p>Are you sure you want to delete this item?</p>
                        <section class="md:w-2/6 gap-2 md:gap-6 flex">
                            <button @click="cancelOrder(id, p.product.id)"
                                class="bg-black text-white p-2 text-[16px] md:text-xl font-bold w-32">
                                Remove
                            </button>
                            <button @click="hide(id)"
                                class="bg-[#BB8E51] text-white p-2 text-[16px] md:text-xl font-bold w-32">
                                Cancel
                            </button>
                        </section>
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
        No orders yet !
    </p>
</template>