<script setup lang="ts">
import { ref, onMounted, reactive, type Ref } from 'vue';
import Fa from 'vue-fa';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { db } from '@/firebase/init';
import { and, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { togglePassword, newPasswordVisibility, retypedPasswordVisibility, payload } from '@/lib/helper';
import router from '@/router';

const input = ref({
    focus: () => { }
});

const formState = reactive({
    email: '',
    password: '',
    retypedPassword: '',
    role: ''
});

const successMessage = ref('');
const errorMessage = ref('');

const passwordRegex = /^([A-Z]+\d+(@|#|\$|\&|_)+|\d+[A-Z]+(@|#|\$|\&|_)+|\d+(@|#|\$|\&|_)+[A-Z]+|(@|#|\$|\&|_)+[A-Z]+\d+|[A-Z]+(@|#|\$|\&|_)+\d+|(@|#|\$|\&|_)+\d+[A-Z]+)([A-Z]|\d|(@|#|\$|\&|_))*$/i;

const clear = (handler: Ref<string>) => {
    setTimeout(() => {
        handler.value = '';
    }, 3000);
}

const resetPassword = async () => {
    if (!formState.email || !formState.password || !formState.retypedPassword) {
        successMessage.value = '';
        errorMessage.value = 'Incomplete credentials';
        clear(errorMessage);
    } else if (!formState.role) {
        successMessage.value = '';
        errorMessage.value = 'Please select a role';
        clear(errorMessage);
    } else if (!formState.password.match(passwordRegex) || formState.password.length > 15 || formState.password.length < 8) {
        successMessage.value = '';
        errorMessage.value = 'Password length must be greater than 8, contain an alphabet, at least one digit and contain at least one these special character (@,$,#,&,_ etc.)';
        clear(errorMessage);
    } else if (formState.password !== formState.retypedPassword) {
        successMessage.value = '';
        errorMessage.value = 'Passwords do not match';
        clear(errorMessage);
    } else {
        const docRef = query(collection(db, 'users'), and(where('email', '==', formState.email), where('role', '==', formState.role)));
        const snapShot = await getDocs(docRef);
        if (snapShot.empty) {
            successMessage.value = '';
            errorMessage.value = 'Incorrect email or role';
            clear(errorMessage);
        } else {
            await updateDoc(doc(db, 'users', snapShot.docs[0].id), {
                password: formState.password,
            });
            errorMessage.value = '';
            successMessage.value = 'Password reset successful'
            setTimeout(() => router.push('/login'), 2000);
        }
    }
}

onMounted(() => {
    input.value.focus();
});
</script>

<template>
    <form
        class="grow w-[80%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16"
        @submit.prevent>
        <input ref="input" type="email" name="email" id="email"
            class="border-black border-2 outline-none p-4 rounded-full" placeholder="Enter Your Email"
            v-model.trim="formState.email" />
        <span class="relative">
            <input type="password" name="newPassword" id="newPassword"
                class="border-black border-2 outline-none p-4 rounded-full w-full" placeholder="New Password"
                v-model.trim="formState.password" />
            <Fa @click="togglePassword('newPassword')" :icon="newPasswordVisibility ? faEye : faEyeSlash"
                class="z-10 absolute top-5 right-5 text-slate-500" />
        </span>
        <span class="relative">
            <input type="password" name="retypedPassword" id="retypedPassword"
                class="border-black border-2 outline-none p-4 rounded-full w-full" placeholder="Retype Password"
                v-model.trim="formState.retypedPassword" />
            <Fa @click="togglePassword('retypedPassword')" :icon="retypedPasswordVisibility ? faEye : faEyeSlash"
                class="z-10 absolute top-5 right-5 text-slate-500" />
        </span>
        <button @click="resetPassword"
            class="flex justify-center rounded-xl text-white bg-[#BB8E51] md:w-1/2 w-10/12 p-4 mx-auto md:p-3 text-xl md:text-4xl hover:opacity-90">Reset
            Password</button>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
                successMessage || errorMessage }}</p>
        <aside class="gap-2 flex flex-col">
            <p>Select a role</p>
            <span class="flex gap-4">
                <input v-model="formState.role" type="radio" name="role" id="admin" value="admin">
                <label for="role">admin</label>
                <input v-model="formState.role" type="radio" name="role" id="user" value="user">
                <label for="role">user</label>
            </span>
        </aside>
    </form>
</template>