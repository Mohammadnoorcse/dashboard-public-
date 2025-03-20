<script setup>
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Fieldset from 'primevue/fieldset';

const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;


//Define Router
const router = useRouter();
const route = useRoute();
const Id = route.params.id;
//Get Toast
const toast = useToast();
//Define Page Meta
definePageMeta({
    layout: "dashboard",
    middleware: ['auth'],
})

//Loading State
const isLoading = ref(false);

//Get Reactive Data
const CategoryName = ref('');
const Commission = ref('');
const CommissionType = ref('fixed');
const Status = ref(1);
const CategoryIcon = ref('');
const CategoryBanner = ref('');
const CategoryThumbnail = ref('');
const Description = ref('');
const selectedCategory = ref(null);
const categories = ref([]);
const selectedCat = ref({ name: '', id: null });
const selectedCategoryItem = ref(false);


const extraProps = ref([]);
const extraFields = ref([]);

const addMoreField = () => {
    extraFields.value = [
        ...extraFields.value, {
            fieldName: "",
            fieldValue: "",
        },
    ];
}

const removeMoreField = (index) => {
    extraFields.value.splice(index, 1);
}

// File Upload
const handleFileUpload = (event, type) => {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            if (type === 'icon') CategoryIcon.value = reader.result;
            if (type === 'banner') CategoryBanner.value = reader.result;
            if (type === 'thumbnail') CategoryThumbnail.value = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

//submit data
const dataSubmit = async () => {
    extraFields.value.forEach((item, index) => {
        extraProps.value = { ...extraProps.value, [item.fieldName]: item.fieldValue };
    })

    isLoading.value = true;
    try {

        const categoryData = {
            name: CategoryName.value,
            icon: CategoryIcon.value,
            banner: CategoryBanner.value,
            thumbnail: CategoryThumbnail.value,
            description: Description.value,
            commission: Commission.value,
            commission_type: CommissionType.value,
            // parent_categories: selectedCategory.value,
            // parent_id: selectedCategory.value?.id,
            parent_categories: JSON.stringify(selectedCategory.value),
            parent_id: selectedCat.value?.id,
            status: Status.value,
            extend_props: extraProps.value
        }

        const res = await $fetch(`${EndPoint}/admin/${MasterKey}/category/${Id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${app_token}`,
            },
            body: JSON.stringify(categoryData),
        });


        getCategoryList();


        setTimeout(() => {
            router.push('/category');
        }, 2000);


    } catch (error) {

        console.log(error);
    } finally {
        isLoading.value = false;
    }

}


onMounted(() => {

    getCategoryList();
    getSingleCategory();
});


const getCategoryList = async () => {
    const res = await $fetch(`${EndPoint}/admin/${MasterKey}/category?parent_id=0&data=all&nestedLable=4`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${app_token}`
        },
    });

    console.log("ca", res);
    categories.value = res;


}

const getSingleCategory = async () => {

    const res = await $fetch(`${EndPoint}/admin/${MasterKey}/category/${Id}`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${app_token}`
        },
    });

    let Category = res?.data;
    console.log('category', Category);
    CategoryName.value = Category.name;
    Description.value = Category.description;
    Commission.value = Category.commission;
    CommissionType.value = Category.commission_type;
    selectedCat.value = { name: Category.parent_categories, id: Category.parent_id };
    selectedCategory.value = selectedCat.value.name;
    Status.value = Category.status
}

const handleCategorySelected = (categoryInfo) => {
    selectedCat.value = categoryInfo;
    selectedCategory.value = selectedCat.value.name;
    selectedCategoryItem.value = false;

};

const handleClick = () => {
    selectedCategoryItem.value = true;

};



</script>
<template>
    <NuxtLayout :name="layout">
        <Toast />
        <spiner v-if="isLoading" />
        <div class="w-full px-3 mt-1">

            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between  bg-gray-400 text-white">

                    <div class="font-semibold mt-1 ml-3">Create Category</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()"
                            class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-tr-sm">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>

                </div>
                <!-- Body Content goes here -->
                <div class=" h-[calc(100vh-8rem)] overflow-y-auto border-b px-3 pt-2">
                    <div class="flex w-full justify-center">
                        <div class="w-1/2">
                            <form @submit.prevent="dataSubmit">

                                <!-- Category Name -->
                                <div class="grid grid-cols-2 gap-2">
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Category Name</label>
                                        <input type="text" v-model="CategoryName"
                                            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                                            placeholder="Category Name" />
                                    </div>
                                    <div class="w-full relative">
                                        <label for="dd-city" class="text-sm">Parent Category</label>

                                        <input type="text" v-model="selectedCategory"
                                            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                                            placeholder="Select a Category" @click="handleClick" />

                                        <ul v-if="selectedCategoryItem" name="parent_category" id="parent_category"
                                            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md overflow-y-auto h-60 absolute bg-white z-10">
                                            <!-- <Category v-for="category in categories" :key="category.id" :category="category" :value="category">{{ category.name }}</Category> -->
                                            <Category v-for="category in categories" :key="category.id"
                                                :category="category" @category-clicked="handleCategorySelected" />
                                        </ul>
                                    </div>
                                </div>

                                <!-- Static Category Name -->
                                <div class="grid grid-cols-2 gap-2 mt-2">
                                    <div class="w-full">
                                        <div class="card flex justify-content-center">

                                        </div>
                                    </div>
                                </div>

                                <!-- File Upload -->
                                <div class="grid grid-cols-3 gap-2 mt-2">
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Category Icon</label>
                                        <FileUpload :pt="{
                                            chooseButton: {
                                                class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                            },


                                        }" mode="basic" name="icon" accept="image/*"
                                            @select="(event) => handleFileUpload(event, 'icon')" />
                                    </div>
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Category Banner</label>
                                        <FileUpload :pt="{
                                            chooseButton: {
                                                class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                            },


                                        }" mode="basic" name="banner" accept="image/*"
                                            @select="(event) => handleFileUpload(event, 'banner')" />
                                    </div>
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Category Thumbnail</label>
                                        <FileUpload :pt="{
                                            chooseButton: {
                                                class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                            },


                                        }" mode="basic" name="thumbnail" accept="image/*"
                                            @select="(event) => handleFileUpload(event, 'thumbnail')" />
                                    </div>
                                </div>

                                <!-- comission tab -->
                                <div class="grid grid-cols-3 gap-2 mt-2">
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Commission</label>
                                        <input type="number" v-model="Commission"
                                            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                                            placeholder="Commission" />
                                    </div>
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Commission Type</label>
                                        <select v-model="CommissionType" name="commission_type" id="commission_type"
                                            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                            <option value="fixed"> Fixed</option>
                                            <option value="parcentage"> Parcentage</option>
                                        </select>
                                    </div>
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Status</label>
                                        <select v-model="Status" name="status" id="commission_type"
                                            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                            <option value="1"> Active</option>
                                            <option value="0"> Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- dynamic field -->
                                <div class="grid grid-col gap-2 mt-2">
                                    <Fieldset legend="Extra Props" :pt="{
                                        root: {
                                            class: 'border p-2'
                                        },
                                        legend: {
                                            class: 'p-0 m-0'
                                        },
                                        togglerIcon: {

                                        }
                                    }">
                                        <template #legend>
                                            <div class="flex align-items-center pl-2">
                                                <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer"
                                                    @click="addMoreField">Add More <Icon name="mdi:table-add"
                                                        width="1.4em" height="1.4em"></Icon>
                                                </div>
                                                <span class="font-bold">Extra Props</span>
                                            </div>
                                        </template>

                                        <div class="flex w-full px-2 py-1" v-for="(extra, index) in extraFields"
                                            :key="index">

                                            <div class="w-full mr-2">
                                                <label for="dd-citwy" class="text-sm w-full"
                                                    title="Use field name like: filedName, field_name or filedname">
                                                    Field Name <Icon name="clarity:info-solid"></Icon></label>
                                                <input type="text" v-model="extra.fieldName"
                                                    class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                                                    placeholder="Field Name" />
                                            </div>
                                            <div class="w-full mr-2">
                                                <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                                <input type="text" v-model="extra.fieldValue"
                                                    class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                                                    placeholder="Field Value" />
                                            </div>
                                            <div class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer"
                                                @click="removeMoreField(index)">
                                                <Icon class="text-white" name="humbleicons:times"></Icon>
                                            </div>

                                        </div>


                                    </Fieldset>

                                </div>

                                <!--Description-->
                                <div class="w-full mt-1">
                                    <label for="dd-city" class="text-sm w-full">Description {{ selectedCategory?.id
                                    }}</label>
                                    <textarea v-model="Description" placeholder="Write in Details..."
                                        class="w-full p-2 border rounded-md"></textarea>
                                </div>

                                <!--Submit Button-->
                                <div class="place-content-end flex w-full">
                                    <button :disabled="isLoading === true"
                                        class="bg-green-500 mt-1 font-semibold text-white py-1 rounded-md px-4 mb-4"
                                        type="submit">
                                        <div v-if="isLoading === false">
                                            Add <Icon name="fa-solid:paper-plane"></Icon>
                                        </div>
                                        <div v-else>
                                            Loading... <Icon name="fa-solid:paper-plane"></Icon>
                                        </div>
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>


                </div>

            </div>

        </div>
    </NuxtLayout>
</template>

<style scoped>
.p-cascadeselect-items-wrapper {
    margin-top: 8rem !important;
    max-height: 20px !important;
    overflow-y: auto !important;
    background-color: yellowgreen !important;
}

.p-cascadeselect-panel {
    z-index: 1 !important;
    position: relative !important;
    top: 10px !important;
    left: 838.75px;
    min-width: 100px;
    transform-origin: center bottom;
    margin-top: calc(var(--p-anchor-gutter)* -1);
}

.p-cascadeselect-items {
    max-height: 20px !important;
    overflow-y: auto !important;
    background-color: yellowgreen !important;
}
</style>