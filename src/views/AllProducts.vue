<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { Fa } from 'vue-fa';
import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue';
import router from '@/router';
import { db } from '@/firebase/init';
import { payload } from '@/lib/helper';
import { collection, getDocs, deleteDoc, doc, limit, orderBy, query, type QuerySnapshot, type DocumentData, startAfter, endBefore, where, limitToLast } from 'firebase/firestore';

const outfits = ref<Outfit[]>([] as Outfit[]);
const search = ref('');
const querySnapshot = ref({} as QuerySnapshot<DocumentData, DocumentData>);
const temp = ref<Outfit[]>([] as Outfit[]);
const loading = ref(true);

const trackNext = ref(0);
const trackPrev = ref(0);

onMounted(() => {
    window.scroll(0, 0);
});

const nextStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
    const docRef = query(collection(db, 'outfits'), orderBy('timestamp', 'desc'), startAfter(last), limit(10));
    querySnapshot2.value = await getDocs(docRef);
    if (!querySnapshot2.value.empty) {
        return true;
    }
    return false;
}

const prevStatus = async () => {
    const querySnapshot2 = ref({} as QuerySnapshot<DocumentData, DocumentData>);
    const first = querySnapshot.value.docs[0];

    const docRef = query(collection(db, 'outfits'), orderBy('timestamp', 'desc'), endBefore(first), limitToLast(10));
    querySnapshot2.value = await getDocs(docRef);

    if (!querySnapshot2.value.empty) {
        return true;
    }
    return false;
}

const fetchData = async (next: boolean, prev: boolean) => {
    const temp = [] as Outfit[];
    loading.value = true;
    if (next) {
        const last = querySnapshot.value.docs[querySnapshot.value.docs.length - 1];
        const docRef = query(collection(db, 'outfits'), orderBy('timestamp', 'desc'), startAfter(last), limit(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((outfit) => {
                temp.push({ id: outfit.id, ...outfit.data() } as Outfit);
            });

            outfits.value = temp
            const checkNext = await nextStatus();

            const checkPrev = await prevStatus();

            if (checkPrev) {
                trackPrev.value = 1;
            }

            if (!checkNext) {
                trackNext.value = 0;
            }
        }
    } else if (prev) {
        const first = querySnapshot.value.docs[0];
        const docRef = query(collection(db, 'outfits'), orderBy('timestamp', 'desc'), endBefore(first), limitToLast(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((outfit) => {
                temp.push({ id: outfit.id, ...outfit.data() } as Outfit);
            });

            outfits.value = temp;

            const checkPrev = await prevStatus();

            const checkNext = await nextStatus();

            if (checkNext) {
                trackNext.value = 1;
            }

            if (!checkPrev) {
                trackPrev.value = 0;
            }
        }

    } else {
        const docRef = query(collection(db, 'outfits'), orderBy('timestamp', 'desc'), limit(10));
        querySnapshot.value = await getDocs(docRef);
        if (!querySnapshot.value.empty) {
            querySnapshot.value.forEach((outfit) => {
                temp.push({ id: outfit.id, ...outfit.data() } as Outfit);
            });

            outfits.value = temp;

            const checkNext = await nextStatus();

            if (checkNext) {
                trackNext.value = 1;
            }
        }
    }

    loading.value = false;
}

watchEffect(async () => {
    if (!payload.value.id) {
        router.push('/login');
    }
    
    await fetchData(false, false);
});

const prevBtn = async () => {
    await fetchData(false, true);
}

const nextBtn = async () => {
    await fetchData(true, false);
}

const deleteProduct = async (id: string) => {
    const docRef = doc(db, 'outfits', id);
    const docRef2 = query(collection(db, 'wishlist'), where('product.id', '==', 'id'));

    const carts = await getDocs(docRef2);
    if (!carts.empty) {
        carts.forEach(async (cart) => {
            if (cart.data().product.id === id) {
                const cartDocRef = doc(db, 'carts', cart.id);
                await deleteDoc(cartDocRef);
            }
        });
    }

    await deleteDoc(docRef);
    querySnapshot.value.forEach((outfit) => {
        if (outfit.id !== id) {
            temp.value.push({ id: outfit.id, ...outfit.data() } as Outfit);
        }
    });
    outfits.value = temp.value;
}

const show = (id: string) => {
    const popUp = document.getElementById(id);
    popUp?.classList.remove('hidden');
    popUp?.classList.add('flex');
}

const hide = (id: string) => {
    const popUp = document.getElementById(id);
    popUp?.classList.remove('flex');
    popUp?.classList.add('hidden');
}

</script>

<template>
    <Spinner v-if="loading" />
    <section v-else-if="outfits.length" class="grow mt-10 text-xl md:text-3xl mb-16 rounded-xl p-4">
        <ul class="flex flex-col gap-6">
            <li v-for="({ name, price, imageUrls, id, category }) in outfits" :key="id">
                <section
                    class="shadow-black shadow p-4 rounded flex md:gap-16 gap-6 flex-col md:flex-row w-4/5 mx-auto relative">
                    <section class="flex justify-center">
                        <Card :name="name" :price="price" :imageUrl="imageUrls[0]"
                            :link="`/categories/${category}/items?id=${id}`" />
                    </section>
                    <section class="flex flex-col place-content-center gap-6 md:w-2/6">
                        <button @click="show(id)" class="bg-black text-white p-2 text-[16px] md:text-xl font-bold">
                            Delete Product
                        </button>
                        <RouterLink :to="`/edit_outfit?id=${id}`" class="bg-[#BB8E51] text-white p-2 text-[16px] md:text-xl
                        flex justify-center font-bold">
                            Edit Product
                        </RouterLink>
                    </section>
                    <section :id="id"
                        class="shadow-black shadow-xl p-4
                        bg-white rounded flex-col justify-center items-center gap-6 w-full absolute top-20 right-1 hidden lg:p-8">
                        <p>Are you sure you want to delete this item?</p>
                        <section class="md:w-2/6 gap-2 md:gap-6 flex">
                            <button @click="deleteProduct(id)"
                                class="bg-black text-white p-2 text-[16px] md:text-xl font-bold w-32">
                                Remove
                            </button>
                            <button @click="hide(id)"
                                class="bg-[#BB8E51] text-white p-2 text-[16px] md:text-xl font-bold w-32">
                                Cancel
                            </button>
                        </section>
                    </section>
                </section>
            </li>
        </ul>
        <aside class="flex mt-8 justify-between w-4/5 mx-auto">
            <button :class="`${trackPrev === 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="prevBtn"
                :disabled="trackPrev === 0 ? true : false">Previous</button>
            <button :class="`${trackNext == 0 ? 'text-gray-400' : 'text-orange-600'}`" @click="nextBtn"
                :disabled="trackNext === 0 ? true : false">Next</button>
        </aside>
    </section>
    <p v-else class="text-2xl md:text-4xl justify-center items-center grow p-20 md:p-48 flex">
        No products yet !
    </p>
</template>