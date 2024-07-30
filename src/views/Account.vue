<script setup lang="ts">
import router from '@/router';
import { payload } from '@/lib/helper';

const links = [
    {
        name: 'Login',
        link: '/login'
    },
    {
        name: payload.value.role === 'admin' ? 'Sales' : 'Purchases',
        link: payload.value.role === 'admin' ? '/sales' : '/purchases'
    },
    {
        name: 'Orders',
        link: payload.value.role === 'admin' ? '/admin/orders' : '/orders'
    },
    {
        name: 'Edit Profile',
        link: '/edit_profile'
    },

];

const logout = () => {
    payload.value = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        password: '',
        address: '',
        role: ''
    }
    return router.push('/');
}

</script>

<template>
    <section class="grow w-[80%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow">
        <ul>
            <RouterLink v-for="({ name, link }) in links" :to="link">
                <li
                    class="mb-8 hover:bg-[#BB8E51] hover:text-white hover:scale-105 transition-all duration-300 p-6 border-[1px] border-black rounded-xl">
                    {{ name }}
                </li>
            </RouterLink>
            <section v-if="payload.role === 'admin'">
                <RouterLink to="/my_products">
                    <li
                        class="mb-8 hover:bg-[#BB8E51] hover:text-white hover:scale-105 transition-all duration-300 p-6 border-[1px] border-black rounded-xl">
                        My Products
                    </li>
                </RouterLink>
                <RouterLink to="/upload">
                    <li
                        class="mb-8 hover:bg-[#BB8E51] hover:text-white hover:scale-105 transition-all duration-300 p-6 border-[1px] border-black rounded-xl">
                        Upload Product
                    </li>
                </RouterLink>
            </section>
            <section v-else>
                <RouterLink to="/delete_account">
                    <li
                        class="mb-8 hover:bg-[#BB8E51] hover:text-white hover:scale-105 transition-all duration-300 p-6 border-[1px] border-black rounded-xl">
                        Delete Account
                    </li>
                </RouterLink>
            </section>
            <li @click="logout"
                class="mb-8 hover:bg-[#BB8E51] hover:text-white hover:scale-105 transition-all duration-300 p-6 border-[1px] border-black rounded-xl">
                Log Out
            </li>
        </ul>
    </section>
</template>