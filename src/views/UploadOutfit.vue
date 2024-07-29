<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { ref as firebaseRef, uploadBytes } from "firebase/storage";
import { v4 as uuid4 } from 'uuid';
import { db, storage } from '@/firebase/init';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { payload } from '@/lib/helper';
import router from '@/router';

type FormState = {
    name: string,
    price: number,
    category: string,
    tag: string,
    description: string;
    imageUrls: string[],
    files: File[]
}

const input = ref({
    focus: () => { }
});

const formState: Ref<FormState> = ref({
    name: '',
    price: 0,
    category: '',
    tag: '',
    description: '',
    imageUrls: [],
    files: []
});

let imageUrls: string[] = [];
const successMessage = ref('');
const errorMessage = ref('');
const status = ref(false);

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

// if (!payload.value.id) {
//     router.push('/login');
// }

onMounted(() => {
    input.value.focus();
});

const clear = (handler: Ref<string>) => {
    setTimeout(() => {
        handler.value = '';
    }, 3000);
}

const handleImageUrl = (event: Event) => {
    const input = event.target as any as HTMLInputElement;

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

const upload = async () => {
    if (formState.value.files.length === 0) {
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
    } else if (!formState.value.category && formState.value.tag !== 'Ankara Prints') {
        successMessage.value = '';
        errorMessage.value = 'Please select a category';
        clear(errorMessage);
    } else if (!formState.value.tag) {
        successMessage.value = '';
        errorMessage.value = 'Please select a tag';
        clear(errorMessage);
    } else {
        status.value = true;
        for (const file of formState.value.files) {
            const storageRef = firebaseRef(storage, uuid4());
            const snapShot = await uploadBytes(storageRef, file);
            imageUrls.push(snapShot.ref.fullPath);
        }

        await addDoc(collection(db, 'outfits'), {
            name: formState.value.name,
            price: formState.value.price,
            category: formState.value.category,
            tags: formState.value.tag,
            imageUrls,
            timestamp: serverTimestamp()
        });

        (async () => {
            errorMessage.value = '';
            status.value = false;
            successMessage.value = 'Product successfully uploaded';
            clear(successMessage);
            imageUrls = [];
        })();
    }
}

</script>

<template>
    <form
        class="grow w-[98%] md:w-[90%] mx-auto mt-16 text-xl md:text-3xl rounded-xl mb-16 p-8 shadow-black shadow flex flex-col gap-12 pt-16"
        @submit.prevent>
        <label
            :class="`border-black border-dotted border-x-2 border-y-2 ${formState.imageUrls.length ? 'h-96 w-80 md:h-96 md:w-80' : 'h-60 w-60'} justify-center items-center ${formState.imageUrls.length > 0 && 'border-none'} ${formState.imageUrls.length >= 3 ? 'grid grid-cols-2 p-16 pt-0' : 'flex flex-col'}`">
            <input @change="handleImageUrl" type="file" multiple hidden name="outfit" id="outfit">
            <img v-if="formState.imageUrls" v-for="imageUrl in formState.imageUrls" :src="imageUrl" alt="choosen outfit"
                :class="`${formState.imageUrls.length === 2 ? 'h-52 w-52' : 'h-full w-full'} object-cover`">
            <p v-if="formState.imageUrls.length === 0" class="md:text-xl flex justify-center items-center h-full">Select
                an image</p>
        </label>
        <input type="text" v-model="formState.name" ref="input" id="productName" name="productName"
            class="border-black border-2 outline-none p-4 rounded-full" placeholder="Product Name" />
        <input type="number" v-model="formState.price" id="productPrice" name="productPrice"
            class="border-black border-2 outline-none p-4 rounded-full" placeholder="Product Price" />
        <select name="category" id="category" v-model="formState.category"
            class="border-black border-2 outline-none p-4 rounded-full">
            <option value="" disabled>
                Select Category
            </option>
            <option v-for="category in categories" :value="category">
                {{ category }}
            </option>
        </select>
        <select name="tag" id="tag" v-model="formState.tag" class="border-black border-2 outline-none p-4 rounded-full">
            <option value="" disabled>Select a tag</option>
            <option v-for="tag in tags" :value="tag">
                {{ tag }}
            </option>
        </select>
        <textarea v-model="formState.description" name="description" id="description"
            class="border-black border-2 outline-none p-4 rounded-xl" placeholder="Enter description"></textarea>
        <p v-if="successMessage || errorMessage"
            :class="`text-center text-xl md:text-2xl ${successMessage ? 'text-green-600' : 'text-red-600'}`">{{
                successMessage || errorMessage }}</p>
        <button type="button" :disabled="status ? true : undefined" @click="upload"
            :class="`flex justify-center rounded-xl text-white bg-[#BB8E51] w-4/5 md:w-1/2 mx-auto p-3 text-xl md:text-4xl hover:opacity-90 ${status ? 'opacity-95' : ''}`">{{
                `${status ? 'Uploading...' : 'Upload Oufit'}` }}</button>
    </form>
</template>