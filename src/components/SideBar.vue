<script setup lang="ts">
import { toggleHamburgerMenu, hash } from "@/lib/helper";

</script>
<template>
    <section
        class="h-screen w-56 bg-slate-200 fixed top-0 left-0 z-10 scale-0 origin-top-left transition-all overflow-x-hidden"
        id="sideBar">
        <section>
            <button
                class=" w-8
                    flex flex-col p-10 
                    ml-auto bg-transparent md:w-12 h-[3px] md:h-[6px] rounded-xl relative before:content-[''] before:absolute  before:bg-[#BB8E51] before:h-[3px] before:w-8 before:md:w-12 before:md:h-[6px] before:left-0 before:rotate-45 before:rounded-xl after:content-[''] after:absolute  after:bg-[#BB8E51] after:h-[3px] after:w-8 after:md:w-12 after:md:h-[6px] after:left-0 after:rounded-xl after:-rotate-45"
                id="hamburgerMenu" @click="toggleHamburgerMenu"></button>
        </section>
        <section class="flex flex-col md:text-2xl">
            <RouterLink to="/off_season" @click="toggleHamburgerMenu">
                <ol class="border border-solid border-slate-300 w-full" @click="hash = 'Off Season'">
                <li class="list-none" :style="{ color: hash === 'Off Season' ? '#BB8E51': 'black'}">
                    Off Season
                </li>
            </ol>
            </RouterLink>
            <ol class="group border border-solid border-slate-300 w-full">
                <li>
                    <p @click="hash = 'categories'" :style="{ color: hash.includes('categories') ? '#BB8E51': 'black'}">
                        <RouterLink
                        to="/categories"
                        >
                        Categories
                    </RouterLink></p>
                    <ol class="
                    bg-slate-100
                    mt-2
                    hidden rounded-xl
                     group-hover:flex flex-col gap-6 md:text-2xl">
                        <li @click="toggleHamburgerMenu">
                            <RouterLink
                             to="/categories/Pants"
                            @click="hash = 'categories/Pants'"
                            :style="{ color: hash === 'categories/Pants' ? '#BB8E51': 'black'}"
                            >
                                Pants
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/categories/Dresses"
                            @click="hash = 'categories/Dresses'"
                            :style="{ color: hash === 'categories/Dresses' ? '#BB8E51': 'black'}"
                            >
                                Dresses
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/categories/Skirts"
                            @click="hash = 'categories/Skirts'"
                            :style="{ color: hash === 'categories/Skirts' ? '#BB8E51': 'black'}"
                            >
                                Skirts
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/categories/Jumpsuits"
                            @click="hash = 'categories/Jumpsuits'"
                            :style="{ color: hash === 'categories/Jumpsuits' ? '#BB8E51': 'black'}"
                            >
                                Jumpsuits
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/categories/Tops"
                            @click="hash = 'categories/Tops'"
                            :style="{ color: hash === 'categories/Tops' ? '#BB8E51': 'black'}"
                            >
                                Tops
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/categories/Two-Pieces"
                            @click="hash = 'categories/Two-Pieces'"
                            :style="{ color: hash === 'categories/Two-Pieces' ? '#BB8E51': 'black'}"
                            >
                                Two-Pieces
                            </RouterLink>
                        </li>
                    </ol>
                </li>
            </ol>
            <ol class="group border border-solid border-slate-300 w-full">
                <li>
                <li>
                    <p @click="hash = 'best_selling'" :style="{ color: hash.includes('best_selling') ? '#BB8E51': 'black'}">
                        <RouterLink
                        to="/best_selling"
                        >
                        Best Selling
                    </RouterLink></p>
                    <ol class="
                    mt-2
                    hidden rounded-xl
                     group-hover:flex bg-slate-100 flex-col gap-6 md:text-2xl">
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/best_selling/Pants"
                            @click="hash = 'best_selling/Pants'"
                            :style="{ color: hash === 'best_selling/Pants' ? '#BB8E51': 'black'}"
                            >
                                Pants
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/best_selling/Dresses"
                            @click="hash = 'best_selling/Dresses'"
                            :style="{ color: hash === 'best_selling/Dresses' ? '#BB8E51': 'black'}">
                                Dresses
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/best_selling/Skirts"
                            @click="hash = 'best_selling/Skirts'"
                            :style="{ color: hash === 'best_selling/Skirts' ? '#BB8E51': 'black'}">
                                Skirts
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/best_selling/Jumpsuits"
                            @click="hash = 'best_selling/Jumpsuits'"
                            :style="{ color: hash === 'best_selling/Jumpsuits' ? '#BB8E51': 'black'}">
                                Jumpsuits
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/categories/Tops"
                            @click="hash = 'categories/Tops'"
                            :style="{ color: hash === 'categories/Tops' ? '#BB8E51': 'black'}"
                            >
                                Tops
                            </RouterLink>
                        </li>
                        <li @click="toggleHamburgerMenu">
                            <RouterLink to="/categories/Two-Pieces"
                            @click="hash = 'categories/Two-Pieces'"
                            :style="{ color: hash === 'categories/Two-Pieces' ? '#BB8E51': 'black'}"
                            >
                                Two-Pieces
                            </RouterLink>
                        </li>
                    </ol>
                </li>
                </li>
            </ol>
            <RouterLink to="/african_prints" @click="toggleHamburgerMenu">
            <ol class="border border-solid border-slate-300 w-full" @click="hash = 'African Prints'">
                <li class="list-none" :style="{ color: hash === 'African Prints' ? '#BB8E51': 'black'}">
                    African Prints
                </li>
            </ol>
            </RouterLink>
            <RouterLink to="/wishlist" @click="toggleHamburgerMenu">
            <ol class="border border-solid border-slate-300 w-full" @click="hash = 'Wishlist'">
                <li class="list-none" :style="{ color: hash === 'Wishlist' ? '#BB8E51': 'black'}">
                    Wishlist
                </li>
            </ol>
            </RouterLink>
            <RouterLink to="/policy" @click="toggleHamburgerMenu">
            <ol class="border border-solid border-slate-300 w-full" @click="hash = 'policy'">
                <li class="list-none" :style="{ color: hash === 'policy' ? '#BB8E51': 'black'}">
                    Privacy Policy
                </li>
            </ol>
            </RouterLink>
        </section>
    </section>
</template>

<style scoped>
ol {
    padding: 20px;
}
</style>