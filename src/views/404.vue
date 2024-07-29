<template>
    <section class="grow md:w-1/2 w-3/4 mx-auto mt-24 text-3xl md:text-6xl flex flex-col gap-24">
        <section class="flex gap-6">
            <p>Page Not Found</p>
        <span>😢</span>
        </section>
            <button
            class="flex justify-center bg-black rounded-xl p-2 text-white md:text-3xl text-xl md:mb-16"
            @click="$router.go(-1)">Go back</button>
        </section>
</template>