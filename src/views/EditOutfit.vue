<script setup lang="ts">
import router from '@/router';
import { ref, onMounted, watchEffect, type Ref } from 'vue';
import { ref as firebaseRef, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { db, storage } from '@/firebase/init';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { payload } from '@/lib/helper';
import Spinner from '@/components/Spinner.vue';

type FormState = {
    name: string,
    price: number,
    category: string,
    tags: string,
    imageUrls: string[],
    files: File[],
}

const input = ref({
    focus: () => { }
});

const id = router.currentRoute.value.query.id

const formState: Ref<FormState & {
    payloadUrls: string[],
    initialImageUrls: string[],
}> = ref({
    name: '',
    price: 0,
    category: '',
    tags: '',
    payloadUrls: [],
    imageUrls: [],
    initialImageUrls: [],
    files: []
});

const editMode = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const imageUrls: string[] = [];
const categories = [
    'Pants', 'Dresses', 'Skirts',
    'Jumpsuits', 'Tops', 'Two-Pieces'
];

const tags = [
    'Normal', 'Off Season', 'Best Selling', 'African Prints'
];

const memeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
];

onMounted(() => {
    input.value.focus();
});

watchEffect(async () => {
    if (!payload.value.id) {
        router.push('/login');
    }

    const res = await getDoc(doc(db, 'outfits', id as string));

    const { name, imageUrls, price, category, tags } = res.data() as FormState
    const initialImageUrls = [];

    for (const imageUrl of imageUrls) {
        const storageRef = firebaseRef(storage, imageUrl);
        initialImageUrls.push(await getDownloadURL(storageRef));
    }

    formState.value = {
        name, imageUrls: initialImageUrls, payloadUrls: [], price, category, tags, initialImageUrls, files: []
    }
})

const clear = (handler: Ref<string>) => {
    setTimeout(() => {
        handler.value = '';
    }, 3000);
}

const handleImageUrl = (event: Event) => {
    const input = event.target as any as HTMLInputElement;

    if (formState.value.initialImageUrls.length) {
        formState.value.initialImageUrls = [];
        formState.value.imageUrls = [];
    }

    if (input.files && input.files.length > 0) {
        if (formState.value.files.length < 4 && input.files.length <= 4) {
            for (let file of input.files) {
                if (memeTypes.indexOf(file.type) !== -1 && formState.value.files.length < 4) {
                    formState.value.imageUrls.push(URL.createObjectURL(file));
                    formState.value.files.push(file);
                } else {
                    errorMessage.value = 'Please select only images';
                    clear(errorMessage);
                }
            }
        } else {
            errorMessage.value = 'Maximum number of photos is 4';
            clear(errorMessage);
        }
    } else {
        formState.value.imageUrls = [];
        formState.value.files = [];
    }
}

const edit = async () => {
    if (!editMode.value) {
        editMode.value = true;
    }
    else if (formState.value.files.length === 0) {
        successMessage.value = '';
        errorMessage.value = 'Choose at least one image';
        clear(errorMessage);
    } else if (!formState.value.name) {
        successMessage.value = '';
        errorMessage.value = 'Product name can not be empty';
        clear(errorMessage);
    } else if (!formState.value.price) {
        successMessage.value = '';
        errorMessage.value = 'Please input a price';
        clear(errorMessage);
    } else if (!formState.value.category && formState.value.tags !== 'Ankara Prints') {
        successMessage.value = '';
        errorMessage.value = 'Please select a category';
        clear(errorMessage);
    } else if (!formState.value.tags) {
        successMessage.value = '';
        errorMessage.value = 'Please select a tag';
        clear(errorMessage);
    } else {
        for (const file of formState.value.payloadUrls) {
            await deleteObject(firebaseRef(storage, file));
        }

        for (const file of formState.value.files) {
            const storageRef = firebaseRef(storage, `images/${file.name}`);
            const snapShot = await uploadBytes(storageRef, file);
            imageUrls.push(snapShot.ref.fullPath);
        }

        await updateDoc(doc(db, 'outfits', id as string), {
            name: formState.value.name,
            price: formState.value.price,
            category: formState.value.category,
            tags: formState.value.tags,
            imageUrls
        });

        successMessage.value = 'Product successfully updated';
    }
}

</script>

<template>
    <form v-if="formState.name"
        class="grow w-[98%] md:w-[90%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16"
        @submit.prevent>
        <label
            :class="`border-black border-dotted border-x-2 border-y-2 ${formState.imageUrls.length ? 'h-96 w-80 md:h-96 md:w-80' : 'h-60 w-60'} md:h-96 md:w-80 justify-center items-center p-10 ${!editMode && 'border-slate-600'} ${formState.imageUrls.length > 0 && 'border-none'} ${formState.imageUrls.length ? 'grid grid-cols-2 p-16 pt-0' : 'flex flex-col'}`">
            <input :disabled="editMode === false" @change="handleImageUrl" type="file" hidden multiple name="outfit"
                id="outfit">
            <img v-if="formState.imageUrls.length" v-for="imageUrl in formState.imageUrls" :src="imageUrl"
                alt="choosen outfit"
                :class="`${!editMode && 'opacity-80'} ${formState.imageUrls.length === 2 ? 'h-52 w-52' : 'h-full w-full'} object-cover`">
            <p v-if="formState.imageUrls.length === 0 && formState.initialImageUrls.length === 0"
                :class="`md:text-xl flex justify-center items-center h-full ${!editMode && 'text-slate-600'}`">Select
                an image</p>
        </label>
        <input :disabled="editMode === false" type="text" v-model="formState.name" ref="input" id="productName"
            name="productName"
            class="border-black border-2 outline-none p-4 rounded-full disabled:border-slate-600 disabled:text-slate-600"
            placeholder="Product Name" />
        <input :disabled="editMode === false" type="number" v-model="formState.price" id="productPrice"
            name="productPrice"
            class="border-black border-2 outline-none p-4 rounded-full disabled:border-slate-600 disabled:text-slate-600"
            placeholder="Product Price" />
        <select :disabled="editMode === false" name="category" id="category" v-model="formState.category"
            class="border-black border-2 outline-none p-4 rounded-full">
            <option value="" disabled>
                Select Category
            </option>
            <option v-for="category in categories" :value="category">
                {{ category }}
            </option>
        </select>
        <select :disabled="editMode === false" name="tag" id="tag" v-model="formState.tags"
            class="border-black border-2 outline-none p-4 rounded-full">
            <option value="" disabled>Select a tag</option>
            <option v-for="tag in tags" :value="tag">
                {{ tag }}
            </option>
        </select>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
                successMessage || errorMessage }}</p>
        <button type="button" @click="edit"
            :class="`flex justify-center rounded-xl text-white bg-[#BB8E51] w-4/5 md:w-1/2 mx-auto p-3 text-xl md:text-4xl hover:opacity-90`">{{
                editMode ? 'Upload Outfit' : 'Edit Outfit' }}</button>
    </form>
    <Spinner v-else />
</template>