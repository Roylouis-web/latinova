<script setup lang="ts">
import { db } from '@/firebase/init';
import { payload } from '@/lib/helper';
import router from '@/router';
import { addDoc, collection, serverTimestamp, where, query as firebaseQuery, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, watchEffect } from 'vue';
import paystack from 'vue3-paystack';
import { v4 as uuid4 } from 'uuid';

const carts = ref([] as Cart[]);
const query = router.currentRoute.value.query as unknown as string;
const deliveryType = ref('');

watchEffect(async () => {
    // if (query === 'orderNow') {
    //     const storedItem = JSON.parse(sessionStorage.getItem('orderNow') as string);

    //     carts.value.push(storedItem);
    // } else {
    //     const docRef = firebaseQuery(collection(db, 'carts'), where('client.id', '==', payload.value.id))

    //     const querySnapshot = await getDocs(docRef);

    //     if (!querySnapshot.empty) {
    //         querySnapshot.forEach((cart) => {
    //             carts.value.push({ id: cart.id, ...cart.data() } as Cart);

    //             deleteDoc(doc(db, 'carts', cart.id));
    //         });

    //         const data = {
    //             product: carts.value,
    //             client: payload.value,
    //             createdAt: new Date().toLocaleDateString(),
    //             deliveredAt: '',
    //             status: 'pending',
    //             timestamp: serverTimestamp()
    //         }

    //         await addDoc(collection(db, 'orders'), data);
    //     }
    // }
});

const onCancelledPayment = () => {
    prompt('Payment cancelled');
}

const onSuccessfulPayment = () => {
    prompt('Payment Successful');
}

</script>

<template>
    <section
        class="grow w-[98%] md:w-[50%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16 pb-16">
        <form class="flex flex-col justify-center mx-auto gap-10">
            <h2 class="font-bold pb-4">Order Confirmation</h2>
            <hr class="bg-slate-200 h-1">
            <p class="b-2 font-bold md:text-2xl">
                {{ `Number of items: 10` }}
            </p>
            <hr class="bg-slate-200 h-1">
            <section class="flex gap-6">
                <select name="deliveryType" id="deliveryType"
                    class="font-bold p-2 rounded-full md:text-2xl bg-slate-200" v-model="deliveryType">
                    <option value="" disabled>Select Delivery Type</option>
                    <option value="home">Home</option>
                    <option value="DHL">DHL</option>
                </select>
            </section>
            <paystack
            currency="NGN"
            :onSuccess="onSuccessfulPayment" :onCanel="onCancelledPayment" email="powellleroy488@gmail.com"
                publicKey="pk_live_c27ca260d356dbb93cf9183a701d9402b758965c" :amount="1000" :reference="uuid4()"
                :disabled="!deliveryType ? true : null" buttonText="Confirm Order" buttonClass="flex justify-center items-center rounded-xl border-black border-x-2 border-y-2 text-xl md:text-2xl hover:opacity-90 p-5 hover:text-white hover:bg-black transition-all duration-500 font-bold mt-6 disabled:bg-slate-200 disabled:text-gray-400
                disabled:border-gray-400">
            </paystack>
        </form>
    </section>
</template>