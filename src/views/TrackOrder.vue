<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue';
import { db } from '@/firebase/init';
import { orderCount, payload } from '@/lib/helper';
import router from '@/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const order = ref({} as Order);
const { id } = router.currentRoute.value.query;
const loading = ref(true);
const delivered = ref(false);

watchEffect(async () => {
    if (!payload.value.id) {
        router.push('/login');
    }
    
    const docRef = doc(db, 'orders', id as string);
    const data = await getDoc(docRef);
    order.value = { id: data.id, ...data.data() } as unknown as Order;
    loading.value = false;
});

const deliveredBtn = async () => {
    await updateDoc(doc(db, 'orders', id as string), {
        status: 'delivered'
    });

    if (orderCount.value > 0) {
        orderCount.value -= 1;
    }

    delivered.value = true;
}

</script>

<template>
    <section v-if="order.id" class="grow mt-10 text-xl md:text-3xl mb-16 rounded-xl p-4">
        <ul class="flex flex-col gap-6">
            <li v-for="product in order.product">
                <section
                    class="shadow-black shadow p-4 rounded flex md:gap-10 gap-6 flex-col md:flex-row w-4/5 mx-auto">
                    <section class="flex justify-center">
                        <Card :name="product.product.name" :price="product.product.price"
                            :imageUrl="product.product.imageUrls[0]"
                            :link="`/categories/${product.product.category}/items?id=${product.product.id}`" />
                    </section>
                    <section class="flex flex-col place-content-center md:w-2/6 p-4 italic">
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                            {{ `order date: ${order.createdAt}` }}
                        </p>
                        <section v-if="payload.role === 'admin'">
                            <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                {{ `name: ${product.client.firstName} ${product.client.lastName}` }}
                            </p>
                            <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                {{ `address: ${product.client.address}` }}
                            </p>
                            <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                                {{ `telephone: ${product.client.telephone}` }}
                            </p>
                        </section>
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                            {{ `quantity: ${product.quantity}` }}
                        </p>
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                            {{ `waist: ${product.waist}` }}
                        </p>
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                            {{ `hips: ${product.hips}` }}
                        </p>
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                            {{ `height: ${product.height}` }}
                        </p>
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                            {{ `colour: ${product.colour}` }}
                        </p>
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">
                            {{ `delivery type: ${product.deliveryType}` }}
                        </p>
                        <p class="p-2 text-[16px] md:text-xl font-bold text-left">{{ `status: ${order.status}` }}</p>
                    </section>
                </section>
                <section class="flex justify-center mt-5">
                    <button v-if="payload.role === 'admin'"
                        :class="`${delivered ? 'bg-green-600' : 'bg-yellow-500'} text-white p-4 rounded-xl border-x-2 border-y-2 w-4/6 text-xl md:text-4xl font-bold`"
                        @click="deliveredBtn">Delivered</button>
                </section>
            </li>
        </ul>
    </section>
    <Spinner v-else />
</template>