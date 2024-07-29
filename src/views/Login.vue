<script setup lang="ts">
import { ref, onMounted, reactive, type Ref } from 'vue';
import Fa from 'vue-fa';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { togglePassword, passwordVisibility, payload, cartItemsCount } from '@/lib/helper';
import router from '@/router';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/init';


const input = ref({
    focus: () => { }
});

const formState = reactive({
    email: '',
    password: '',
    role: ''
});

const status = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(() => {
    input.value.focus();
});

const clear = (handler: Ref<string>) => {
    setTimeout(() => {
        handler.value = '';
    }, 3000);
}

const login = async () => {
    if (!formState.email || !formState.password) {
        successMessage.value = '';
        errorMessage.value = 'Incomplete credentials !';
        clear(errorMessage);
    } else if (!formState.role) {
        successMessage.value = '';
        errorMessage.value = 'Please select a role';
        clear(errorMessage);
    } else {
        const docRef = query(collection(db, 'users'), and(where('email', '==', formState.email), where('password', '==', formState.password), where('role', '==', formState.role)));
        const snapShot = await getDocs(docRef);

        if (snapShot.empty) {
            successMessage.value = '';
            errorMessage.value = 'Incorrect email or password or role';
        } else {
            status.value = true;
            snapShot.forEach((user) => payload.value = { id: user.id, ...user.data() } as Client);
            const docRef = query(collection(db, 'carts'), where('client.id', '==', payload.value.id));
            const carts = await getDocs(docRef);
            cartItemsCount.value = carts.docs.length;
            errorMessage.value = '';
            successMessage.value = 'Login successful'
            status.value = false;
            setTimeout(() => router.push('/'), 2000);
        }
    }
}

</script>

<template>
    <form
        class="grow w-[80%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16"
        @submit.prevent>
        <input type="email" name="email" id="email" class="border-black border-2 outline-none p-4 rounded-full"
            placeholder="Enter Email" ref="input" v-model.trim="formState.email" />
        <span class="relative">
            <input type="password" name="password" id="password"
                class="border-black border-2 outline-none p-4 rounded-full w-full" placeholder="Enter Password"
                v-model.trim="formState.password" />
            <Fa @click="togglePassword('password')" :icon="passwordVisibility ? faEye : faEyeSlash"
                class="z-10 absolute top-5 right-5 text-slate-500" />
        </span>
        <button @click="login" type="button"
            class="flex justify-center rounded-xl text-white bg-[#BB8E51] w-4/5 md:w-1/2 mx-auto p-3 text-xl md:text-4xl hover:opacity-90">{{ status ? 'Logging In...' : 'Log In' }}</button>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
                successMessage || errorMessage }}</p>
        <aside>
            <p>Select a role</p>
            <span class="flex gap-4 mb-3">
                <input v-model="formState.role" type="radio" name="role" id="admin" value="admin">
                <label for="role">admin</label>
                <input v-model="formState.role" type="radio" name="role" id="user" value="user">
                <label for="role">user</label>
            </span>
            <RouterLink to="/reset_password" class="text-black hover:underline">Forgotten password?</RouterLink>
            <p class="text-center mb-6">or</p>
            <RouterLink to="/register"
                class="flex justify-center rounded-xl text-white w-3/4 md:w-1/2 mx-auto p-3 text-xl md:text-4xl hover:opacity-90 bg-black">
                Create Account</RouterLink>
        </aside>
    </form>
</template>