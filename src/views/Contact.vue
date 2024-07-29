<script setup lang="ts">
import router from '@/router';
import { ref, onMounted, reactive, type Ref } from 'vue';

const successMessage = ref('');
const errorMessage = ref('');
const emailRegex = /^([A-Z]|[0-9]|\.|-)([A-Z]|[0-9]|\.|-)+@(gmail|hotmail|yahoo)\.com$/i;
const numberRegex = /^\d{11}$/;
const messageRegex = /^\w+(\s|,|\w)+$/;

const input = ref({
    focus: () => { }
});

const formState = reactive({
    email: '',
    telephone: '',
    message: ''
});

onMounted(() => {
    input.value.focus();
});

const clear = (handler: Ref<string>) => {
    setTimeout(() => {
        handler.value = '';
    }, 3000);
}

const submit = () => {
    if (!formState.email.match(emailRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Invalid email address';
        clear(errorMessage);
    } else if (!formState.telephone.match(numberRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Incorrect number format';
        clear(errorMessage);
    } else if (!formState.message.match(messageRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Incorrect message format';
        clear(errorMessage);
    } 
    else {
        errorMessage.value = '';
        successMessage.value = 'Thanks for your feedback !';
        setTimeout(() => router.push('/'), 2000);

    }
}

</script>

<template>
    <form
        class="grow w-[80%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16"
        @submit.prevent>
        <input type="email" name="email" id="email" class="border-black border-2 outline-none p-4 rounded-full"
            placeholder="Enter Your Email" ref="input" v-model.trim="formState.email"/>
        <input type="tel" name="password" id="password" class="border-black border-2 outline-none p-4 rounded-full"
            placeholder="Enter Your Telephone Number" v-model.trim="formState.telephone"/>
        <textarea name="message" id="message" class="border-black border-2 outline-none p-4 rounded-xl"
            placeholder="Enter Your Message" v-model.trim="formState.message"/>
        <button
            @click="submit"
            class="flex justify-center rounded-xl text-white bg-black w-1/2 mx-auto p-3 text-xl md:text-4xl hover:opacity-90">Submit
        </button>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
            successMessage || errorMessage }}</p>
    </form>
</template>