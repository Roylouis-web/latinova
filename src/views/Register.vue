<script setup lang="ts">
import { ref, onMounted, reactive, type Ref } from 'vue';
import Fa from 'vue-fa';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { togglePassword, registerPasswordisibility } from '@/lib/helper';
import router from '@/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/init'


const formState = reactive({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    password: '',
    role: ''
});

const input = ref({
    focus: () => { }
});

const successMessage = ref('');
const errorMessage = ref('');
const emailRegex = /^([A-Z]|[0-9]|\.|-)([A-Z]|[0-9]|\.|-)+@(gmail|hotmail|yahoo)\.com$/i;

const passwordRegex = /^([A-Z]+\d+(@|#|\$|\&|_)+|\d+[A-Z]+(@|#|\$|\&|_)+|\d+(@|#|\$|\&|_)+[A-Z]+|(@|#|\$|\&|_)+[A-Z]+\d+|[A-Z]+(@|#|\$|\&|_)+\d+|(@|#|\$|\&|_)+\d+[A-Z]+)([A-Z]|\d|(@|#|\$|\&|_))*$/i;

const nameRegex = /^[A-Z]+$/i

const numberRegex = /^\d{11}$/;

onMounted(() => {
    input.value.focus();
});


const clear = (handler: Ref<string>) => {
    setTimeout(() => {
        handler.value = '';
    }, 3000);
}

const register = async () => {
    if (!formState.email || !formState.password || !formState.firstName || !formState.lastName || !formState.telephone) {
        successMessage.value = '';
        errorMessage.value = 'Incomplete credentials !';
        clear(errorMessage);
    } else if (!formState.role) {
        successMessage.value = '';
        errorMessage.value = 'Please select a role';
        clear(errorMessage);
    } else if (!formState.firstName.match(nameRegex) || !formState.lastName.match(nameRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Invalid name format';
        clear(errorMessage);
    } else if (!formState.email.match(emailRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Incorrect email format';
        clear(errorMessage);
    } else if (!formState.telephone.match(numberRegex)) {
        successMessage.value = '';
        errorMessage.value = 'Incorrect number format';
        clear(errorMessage);
    } else if (!formState.password.match(passwordRegex) || formState.password.length > 15 || formState.password.length < 8) {
        successMessage.value = '';
        errorMessage.value = 'Password length must be greater than 8, contain an alphabet, at least one digit and contain at least one these special character (@,$,#,&,_ etc.)';
        clear(errorMessage);
    } else if (formState.role === 'admin' && formState.email !== 'luxurybylatinova@gmail.com') {
        successMessage.value = '';
        errorMessage.value = 'Unauthorized role';
        clear(errorMessage);
    }
    else {
        errorMessage.value = '';
        const colRef = collection(db, 'users');
        const dataObj = {
            firstName: formState.firstName,
            lastName: formState.lastName,
            email: formState.email,
            telephone: formState.telephone,
            password: formState.password,
            role: formState.role
        };

        await addDoc(colRef, dataObj);
        successMessage.value = 'Registeration successful';
        setTimeout(() => router.push('/login'), 2000);
    }
}

</script>

<template>
    <form
        class="grow w-[80%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16"
        @submit.prevent>
        <input type="text" v-model.trim="formState.firstName" ref="input" name="FirstName" id="FirstName"
            class="border-black border-2 outline-none p-4 rounded-full" placeholder="First Name" />
        <input type="text" v-model.trim="formState.lastName" name="lastName" id="lastName"
            class="border-black border-2 outline-none p-4 rounded-full" placeholder="Last Name" />
        <input type="email" v-model.trim="formState.email" name="email" id="email"
            class="border-black border-2 outline-none p-4 rounded-full" placeholder="Enter Your Email" />
        <input type="tel" v-model.trim="formState.telephone" name="telephone" id="telephone"
            class="border-black border-2 outline-none p-4 rounded-full" placeholder="Enter Your Number" />
        <span class="relative">
            <input type="password" name="registerPassword" id="registerPassword"
                class="border-black border-2 outline-none p-4 rounded-full w-full" placeholder="Enter Password"
                v-model.trim="formState.password" />
            <Fa @click="togglePassword('registerPassword')" :icon="registerPasswordisibility ? faEye : faEyeSlash"
                class="z-10 absolute top-5 right-5 text-slate-500" />
        </span>
        <button @click="register"
            class="flex justify-center rounded-xl text-white bg-[#BB8E51] w-4/5 md:w-1/2 mx-auto p-3 text-xl md:text-4xl hover:opacity-90">Register</button>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
                successMessage || errorMessage }}</p>
        <aside class="flex flex-col gap-2">
            <p>Select a role</p>
            <span class="flex gap-4">
                <input v-model="formState.role" type="radio" name="role" id="admin" value="admin">
                <label for="role">admin</label>
                <input v-model="formState.role" type="radio" name="role" id="user" value="user">
                <label for="role">user</label>
            </span>
            <RouterLink to="/login" class="text-black hover:underline">Already Have An Account?</RouterLink>
        </aside>
    </form>
</template>