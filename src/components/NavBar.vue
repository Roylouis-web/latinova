<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { faSearch, faPortrait, faShoppingBag, faBell } from '@fortawesome/free-solid-svg-icons';
import { Fa } from 'vue-fa';
import { toggleHamburgerMenu, hash, cartItemsCount, orderCount, payload } from '@/lib/helper'
import router from '@/router';
import { db } from '@/firebase/init';
import { collection, getDocs, query, where } from 'firebase/firestore';

const search = ref('');
const count = ref(0);

const links = [
    {
        name: 'About',
        link: 'about'
    },
    {
        name: 'Policy',
        link: 'policy'
    },
    {
        name: 'Contact',
        link: 'contact'
    }
];

watchEffect(async () => {
    if (payload.value.id) {
        if (payload.value.role === 'admin') {
            const docRef = query(collection(db, 'orders'), where('status', '!=', 'delivered'));
            const orders = await getDocs(docRef);
            orderCount.value = orders.docs.length;

        } else {
            const docRef = query(collection(db, 'carts'), where('client.id', '==', payload.value.id));
            const carts = await getDocs(docRef);
            cartItemsCount.value = carts.docs.length;
        }
    }
});

watchEffect(() => {
    if (count.value !== cartItemsCount.value && payload.value.role === 'user') {
        count.value = cartItemsCount.value;
    } else if (count.value !== orderCount.value && payload.value.role === 'admin') {
        count.value = orderCount.value;
    }
});

watchEffect(() => {
    if (router.currentRoute.value.path !== '/search') {
        search.value = '';
    }
});

const style = (link: string) => {
    return `${hash.value === link && 'text-[#BB8E51]'} hover:text-[#BB8E51]`
}

const handleSearch = () => {
    hash.value = '/search';
    router.push(`/search?query=${search.value}`);
}

</script>

<template>
    <header>
        <nav class="p-4 flex items-center justify-between">
            <section class="flex justify-center items-center gap-2">
                <button
                    class="w-8 md:w-12 h-[3px] md:h-[6px] rounded-xl bg-[#BB8E51] relative before:content-[''] before:absolute  before:bg-[#BB8E51] before:h-[3px] before:w-8 before:md:w-12 before:md:-top-3 before:md:h-[6px] before:-top-2 before:left-0 before:rounded-xl after:content-[''] after:absolute  after:bg-[#BB8E51] after:h-[3px] after:w-8 after:md:w-12 after:md:h-[6px] after:-bottom-2 after:md:-bottom-3 after:left-0 after:rounded-xl"
                    id="hamburgerMenu" @click="toggleHamburgerMenu"></button>
                <RouterLink to="/" @click="hash = '/'">
                    <img src="/WhatsApp Image 2024-01-02 at 13.51.10(2).jpeg" alt="logo"
                        class="w-16 md:w-24 lg:w-40 rounded-full">
                </RouterLink>
            </section>
            <section class="flex md:gap-12 gap-3  mr-4 sm:mr-0 lg:text-2xl lg:gap-12 place-content-center"
                v-for="({ name, link }) in links">
                <RouterLink :class="style(link)" :to='`/${link}`' @click="hash = link">
                    {{ name }}
                </RouterLink>
            </section>
            <section class="flex gap-4 sm:gap-6 md:gap-12 items-center">
                <RouterLink to="/account" @click="hash = ''">
                    <Fa :icon="faPortrait" class="text-2xl md:text-4xl text-[#BB8E51]" />
                </RouterLink>
                <RouterLink :to="payload.role === 'admin' ? '/admin/orders' : '/cart'" @click="hash = ''">
                    <aside class="relative">
                        <Fa :icon="payload.role === 'admin' ? faBell : faShoppingBag"
                            class="text-2xl md:text-4xl text-[#BB8E51]" />
                        <p v-if="count"
                            class="text-xs md:text-[15px] absolute
                    top-[1px]
                    md:-top-0 -right-2 bg-black text-white rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center">
                            {{ count }}
                        </p>
                    </aside>
                </RouterLink>
            </section>
        </nav>
        <form @submit.prevent class="flex items-center gap-4 justify-center mt-4">
            <input type="search" v-model="search" placeholder="search for products"
                class="outline outline-[#BB8E51] outline-2 p-6 md:p-8 w-3/4 h-8 text-xl md:text-2xl placeholder:text-xl md:placeholder:text-2xl rounded-full" />
            <Fa @click="handleSearch" :icon="faSearch" class="text-[#BB8E51] text-2xl md:text-3xl" />
        </form>
    </header>
</template>