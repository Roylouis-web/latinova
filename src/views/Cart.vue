<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue';
import { db } from '@/firebase/init';
import { deleteDoc, getDocs, collection, query, where, doc, type QuerySnapshot, type DocumentData } from 'firebase/firestore';
import router from '@/router';
import { cartItemsCount, payload } from '@/lib/helper';

const carts = ref<Cart[]>([] as Cart[]);
let total = ref(0);
const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const loading = ref(true);
const successMessage = ref('');
const errorMessage = ref('');
const addressRegex = /^\w+(\s|,|\w)+$/;

watchEffect(async () => {
    if (!payload.value.id) {
        router.push('/login');
    }

    if (payload.value.id) {
        const docRef = query(collection(db, 'carts'), where('client.id', '==', payload.value.id))
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((outfit) => carts.value.push({ id: outfit.id, ...outfit.data() } as Cart));
            total.value = carts.value.reduce((x, y) => x + y.product.price, 0);
        }
    }
    loading.value = false;
});

const remove = async (id: string) => {
    cartItemsCount.value -= 1;
    const docRef = doc(db, 'carts', id);
    await deleteDoc(docRef);
    carts.value = carts.value.filter((cart) => cart.id !== id);
    total.value = carts.value.reduce((x, y) => x + y.product.price, 0);
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

const checkout = () => {
    if (!payload.value.address) {
        const address = prompt('Enter your address');
        if (!address?.match(addressRegex)) {
            errorMessage.value = 'Invalid address format';
            return setTimeout(() => errorMessage.value = '', 2000);
        }
    }

    router.push('/payment?query=checkout');
}

</script>

<template>
    <section v-if="carts.length" class="grow mt-10 text-xl md:text-3xl mb-16 rounded-xl p-4">
        <ul class="flex flex-col gap-6">
            <li v-for="({ product, id, quantity }) in carts" :key="id">
                <section
                    class="shadow-black shadow p-4 rounded flex md:gap-10 gap-6 flex-col md:flex-row w-4/5 mx-auto relative">
                    <section class="flex justify-center">
                        <Card :name="product.name" :imageUrl="product.imageUrls[0]" :price="product.price"
                            :link="`/categories/${product.category}/items?update=${id}`" />
                    </section>
                    <section class="flex flex-col place-content-center gap-4 md:w-2/6">
                        <p class="text-xl md:text-2xl text-center md:text-left">{{ `Quantity: ${quantity}` }}</p>
                        <button @click="show(id)" class="bg-black text-white p-2 text-[16px] md:text-xl font-bold">
                            Remove
                        </button>
                    </section>
                    <section :id="id"
                        class="shadow-black shadow-xl p-4
                        bg-slate-100 rounded flex-col justify-center items-center gap-6 w-full absolute top-20 right-1 hidden lg:p-8">
                        <p>Are you sure you want to delete this item?</p>
                        <section class="md:w-2/6 gap-2 md:gap-6 flex">
                            <button @click="remove(id)"
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
        <aside class="flex flex-col gap-4 mt-20 justify-center items-center rounded pt-6 pb-6">
            <p class="font-bold text-xl md:text-4xl">{{ `Total: ₦${total}` }}</p>
            <button type="button" @click="checkout"
                class="flex justify-center rounded-xl border-black border-x-2 border-y-2 w-4/6 text-xl md:text-4xl hover:opacity-90 p-5 hover:text-white hover:bg-black transition-all duration-500 font-bold">Checkout</button>
        </aside>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
                successMessage || errorMessage }}</p>
    </section>
    <p v-else-if="!loading && !carts.length"
        class="text-2xl md:text-4xl justify-center items-center grow p-20 md:p-48 flex">
        Your cart is empty !
    </p>
    <Spinner v-else />
</template>