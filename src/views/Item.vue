<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Fa } from 'vue-fa';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination } from 'vue3-carousel';
import router from '@/router';
import Spinner from '@/components/Spinner.vue';
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { getDownloadURL, ref as firebaseRef } from 'firebase/storage';
import { storage } from '@/firebase/init';
import { cartItemsCount, payload } from '@/lib/helper';
import { v4 as uuid4 } from 'uuid';

const loading = ref(true);
const { id, update } = router.currentRoute.value.query
const successMessage = ref('');
const errorMessage = ref('');
const addressRegex = /^\w+(\s|,|\w)+$/;
const state = ref<Partial<Cart>>();
const downloadedUrls = ref([] as string[]);

if (!payload.value.id) {
    router.push('/login');
}

watchEffect(async () => {
    if (update) {
        const res = await getDoc(doc(db, 'carts', update as string));
        state.value = res.data() as Cart;
        state.value.id = res.id;
    } else {
        const res = await getDoc(doc(db, 'outfits', id as string));
        state.value = {
            bust: '',
            waist: '',
            hips: '',
            height: '',
            additionalInfo: '',
            colour: '',
            size: '',
            quantity: 1,
            product: { id: res.id, ...res.data() } as Outfit,
            client: payload.value
        }

        if (state.value.product?.imageUrls) {
            for (const imageUrl of state.value.product.imageUrls) {
                const storageRef = firebaseRef(storage, imageUrl);
                downloadedUrls.value.push(await getDownloadURL(storageRef));
            }
        }
    }
});

const checkDetails = () => {
    const {
        bust,
        waist,
        hips,
        height,
        deliveryType
    } = state.value as {
            bust: string,
            waist: string,
            hips: string,
            height: string,
            deliveryType: string,
    };

    if (!bust || !waist || !hips || !height || !deliveryType) {
        return false;
    }

    return true;
}

const addToCart = async () => {

    if (!checkDetails()) {
        errorMessage.value = 'Please select all necessary details';
        return setTimeout(() => errorMessage.value = '', 2000);
    }

    cartItemsCount.value += 1;
    await addDoc(collection(db, 'carts'), state.value);
    successMessage.value = 'Product successfully added to cart';
    return setTimeout(() => successMessage.value = '', 2000);
}

const updateCart = async () => {
    if (!checkDetails()) {
        errorMessage.value = 'Please select all necessary details';
        return setTimeout(() => errorMessage.value = '', 2000);
    }

    await updateDoc(doc(db, 'carts', state.value?.id as string), state.value as Cart);
    successMessage.value = 'Cart successfully updated';
    return setTimeout(() => successMessage.value = '', 2000);
}

const order = () => {
    if (!checkDetails()) {
        errorMessage.value = 'Please select all necessary details';
        return setTimeout(() => errorMessage.value = '', 2000);
    }

    if (!payload.value.address) {
        const address = prompt('Enter your address');
        if (!address?.match(addressRegex)) {
            errorMessage.value = 'Invalid address format';
            return setTimeout(() => errorMessage.value = '', 2000);
        }
    }

    if (sessionStorage.getItem('orderNow')) {
        sessionStorage.setItem('orderNow', '');
    }

    sessionStorage.setItem('orderNow', JSON.stringify(state.value));

    router.push('/payment?query=orderNow');
}


const increase = () => {
    if (state.value?.quantity) {
        state.value.quantity += 1;
    }
}

const decrease = () => {
    if (state.value?.quantity) {
        if (state.value.quantity > 1) {
            state.value.quantity -= 1;
        }
    }
}

</script>
<template>
    <section v-if="state" class="grow pt-10 lg:pt-0 mb-12 lg:pl-12 lg:flex lg:gap-16 md:gap-10">
        <section>
            <Carousel :items-to-show="1" :autoplay="3000" :wrap-around="true">
                <Slide v-for="imageUrl in downloadedUrls"
                :key="uuid4()">
                    <section>
                        <img :src="imageUrl" alt="slide"
                            class="h-[300px] w-[300px] md:w-[500px] md:h-[500px] md:mt-20" />
                    </section>
                </Slide>
                <template #addons>
                    <Pagination />
                </template>
            </Carousel>
            <section
                class="flex gap-6 flex-col text-[16px] md:text-2xl items-start font-bold mt-4 mx-auto md:w-[500px] w-[300px]">
                <p>{{ state.product?.name }}</p>
                <p>{{ `₦${state.product?.price.toLocaleString()}` }}</p>
                <p>{{ state.product?.description }}</p>
            </section>
        </section>
        <section class="mb-24 mt-20">
            <section class="mx-auto md:w-[500px] w-[300px] font-bold mb-12 text-[16px] md:text-2xl">
                <h1>SIZE CHART</h1>
                <p>It is very important to view our price chart before placing an order</p>
            </section>
            <img src="/WhatsApp Image 2024-03-01 at 12.09.35.jpeg" alt="size chart"
                class="h-[300px] w-[300px] md:w-[500px] md:h-[500px] mx-auto mb-12">
            <form class="mx-auto md:w-[500px] w-[300px]">
                <select name="colour" id="colour" class="font-bold p-2 rounded-full md:text-xl bg-slate-200"
                    v-model="state.colour">
                    <option value="" disabled>Select a Colour</option>
                    <option value="Red">Red</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Royal Blue">Royal Blue</option>
                </select>
                <br />
                <br />
                <select name="size" id="size" v-model="state.size"
                    class="font-bold p-2 rounded-full md:text-xl bg-slate-200">
                    <option value="" disabled>Select a Perfect Size</option>
                    <option v-for="size in 20" :value="size">
                        {{ size }}
                    </option>
                </select>
                <br />
                <br />
                <details class="mt-12 font-bold bg-[#BB8E51] text-black rounded-xl p-4 md:text-xl">

                    <summary class="text-white mb-4">TAP HERE for Size Adjustments/additional info
                    </summary>
                    <section class="flex flex-col gap-4">
                        <input v-model="state.bust" type="text" class="p-2" name="bust" id="bust"
                            placeholder="BUST (e.g 34 inches)">
                        <input v-model="state.waist" type="text" class="p-2" name="waist" id="waist"
                            placeholder="WAIST (e.g 28 inches)">
                        <input v-model="state.hips" type="text" class="p-2" name="hips" id="hips"
                            placeholder="HIPS (e.g 32 inches)">
                        <input v-model="state.height" type="text" class="p-2" name="height" id="height"
                            placeholder="HEIGHT 5.5 inches or 6.1 inches">
                        <textarea v-model="state.additionalInfo" class="p-2" name="additionalInfo" id="additionalInfo"
                            placeholder="Additional Information" />
                    </section>
                </details>
                <section v-if="payload.role === 'user'" class="flex flex-col gap-4 mt-10">
                    <span class="flex gap-4 justify-center items-center md:text-2xl">
                        <Fa :icon="faPlus" @click="increase" class="text-2xl bg-black text-white rounded-full p-1" />
                        <p class="text-xl">{{ state.quantity }}</p>
                        <Fa :icon="faMinus" @click="decrease" class="text-2xl bg-black text-white rounded-full p-1" />
                    </span>
                    <span v-if="id" class="flex justify-around md:text-xl"> <button type="button"
                            class="bg-black text-white p-3 rounded" @click="addToCart">Add To Cart</button>
                        <button type="button" class="bg-black text-white p-3 rounded" @click="order">Order
                            Now</button></span>
                    <span v-else-if="update">
                        <button type="button" class="bg-black text-white p-3 rounded" @click="updateCart">Update
                            Cart</button>
                    </span>
                    <p v-if="successMessage || errorMessage"
                        :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">
                        {{
                            successMessage || errorMessage }}</p>
                </section>
                <RouterLink v-else :to="`/edit_outfit?id=${id}`" type="button" class="
                            flex place-content-center
                            bg-black font-bold text-white p-3 rounded
                            w-1/2 md:w-4/12 mt-12 md:text-xl" @click="addToCart">
                    Edit Outfit
                </RouterLink>
            </form>
        </section>
    </section>
    <p v-else-if="!loading && !state" class="text-2xl md:text-4xl justify-center items-center grow p-20 md:p-48 flex">
        Product does not exist!
    </p>
    <Spinner v-else />
</template>
