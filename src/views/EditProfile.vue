<script setup lang="ts">
import router from '@/router';
import { ref, watchEffect, type Ref } from 'vue';
import { payload } from '@/lib/helper';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/init';

if (!payload.value.id) {
    router.push('/login');
}

const disabled = ref(true);

const formState = ref({
    firstName: payload.value.firstName,
    lastName: payload.value.lastName,
    email: payload.value.email,
    telephone: payload.value.telephone,
    address: payload.value.address || '',
});

const status = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const nameRegex = /^[A-Z]+$/i
const numberRegex = /^\d{11}$/;
const addressRegex = /^\w+(\s|,|\w)+$/;
const emailRegex = /^([A-Z]|[0-9]|\.|-)([A-Z]|[0-9]|\.|-)+@(gmail|hotmail|yahoo)\.com$/i;

watchEffect(() => {
    if (!formState.value.telephone && !formState.value.firstName && !formState.value.lastName && !formState.value.email) {
        disabled.value = true;
        formState.value = {
            firstName: payload.value.firstName,
            lastName: payload.value.lastName,
            email: payload.value.email,
            telephone: payload.value.telephone,
            address: payload.value.address,
        }
    }
});

const clear = (handler: Ref<string>) => {
    setTimeout(() => {
        handler.value = '';
    }, 3000);
}

const submit = async () => {
    if (disabled.value) {
        disabled.value = false;
    } else if (!formState.value.firstName.match(nameRegex) || !formState.value.lastName.match(nameRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Invalid name format';
        clear(errorMessage);
    } else if (!formState.value.email.match(emailRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Incorrect email format';
        clear(errorMessage);
    } else if (!formState.value.telephone.match(numberRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Incorrect number format';
        clear(errorMessage);
    } else if (formState.value.address && !formState.value.address.match(addressRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Invalid address format';
        clear(errorMessage);
    }
    else {
        status.value = true;
        await updateDoc(doc(db, 'users', payload.value.id), { ...formState.value });
        errorMessage.value = '';
        successMessage.value = 'Details successfully updated';
        setTimeout(() => router.push('/login'), 2000);

        (async () => {
            status.value = false;
            disabled.value = true;
        })();
    }
}
</script>

<template>
    <form
        class="grow w-[80%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16"
        @submit.prevent>
        <input :disabled="disabled" type="text" v-model.trim="formState.firstName" ref="input" name="FirstName"
            id="FirstName" class="border-black disabled:text-slate-500 border-2 outline-none p-4 rounded-full"
            placeholder="First Name" />
        <input :disabled="disabled" type="text" v-model.trim="formState.lastName" name="lastName" id="lastName" class="border-black
            disabled:text-slate-500 border-2 outline-none p-4 rounded-full" placeholder="Last Name" />
        <input :disabled="disabled" type="email" v-model.trim="formState.email" name="email" id="email" class="border-black 
            disabled:text-slate-500 border-2 outline-none p-4 rounded-full" placeholder="Enter Your Email" />
        <input :disabled="disabled" type="tel" v-model.trim="formState.telephone" name="telephone" id="telephone" class="border-black
            disabled:text-slate-500 border-2 outline-none p-4 rounded-full" placeholder="Enter Your Number" />
        <textarea :disabled="disabled" name="address" id="address" class="border-black
            disabled:text-slate-500 border-2 outline-none p-4 rounded-xl" placeholder="Enter New Address"
            v-model.trim="formState.address" />
        <button @click="submit"
            class="flex
            font-bold justify-center rounded-xl text-white bg-[#BB8E51] w-1/2 mx-auto p-3 text-xl md:text-4xl hover:opacity-90">{{ disabled
                ? 'Edit' : status ? 'Saving Changes...': 'Save Changes' }}</button>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
                successMessage || errorMessage }}</p>
    </form>
</template>