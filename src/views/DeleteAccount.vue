<script setup lang="ts">
import { db } from '@/firebase/init';
import { payload } from '@/lib/helper';
import router from '@/router';
import { deleteDoc, doc } from 'firebase/firestore';

if (!payload.value.id) {
    router.push('/login');
}

const deleteAccount = () => {
    deleteDoc(doc(db, 'users', payload.value.id));
    payload.value = {} as Client;
    router.push('/');
}

</script>

<template>
    <section class="grow mt-10 text-xl md:text-3xl mb-16 rounded-xl p-4">
        <section class="shadow-black shadow p-4 rounded flex md:gap-10 gap-6 flex-col w-4/5 mx-auto ">
            <section class="flex justify-center">
                By choosing to delete your account, your account deletion request will be sent immediately after which
                your account will be totally deleted and you will need to register afresh to become a Latinova customer
                once again
            </section>
            <section class="flex flex-col place-content-center gap-4 md:w-2/6">
                <button @click="deleteAccount" class="bg-black text-white p-2 text-[16px] md:text-xl font-bold">
                    Delete Account
                </button>
            </section>
        </section>
    </section>
</template>