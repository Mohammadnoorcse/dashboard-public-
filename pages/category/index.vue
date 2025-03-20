<script setup>
import InputGroup from 'primevue/inputgroup';
import Sidebar from 'primevue/sidebar';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useDataDate } from '~/composables/useDataDate';

//Define Page Meta
definePageMeta({
    layout: "dashboard",
    middleware: ['auth'],
})

const permissionStore = usePermissionStore();
const { accessMenu, allAccess } = storeToRefs(permissionStore);
// console.log("Category Fetch Result accessMenu:", accessMenu.value);
const accessMenuKeys = computed(() => Object.keys(accessMenu.value));
// console.log("Category Fetch Result accessMenuKeys:", accessMenuKeys.value);
// console.log("Permission Fetch Result allAccess:", allAccess.value);

// Function to check access
const visibleAllow = (menu_id, access_id) => {
    // If user has "super_admin" access, return true
    if (accessMenuKeys.value.includes("super_admin")) {
        return true;
    }
    // Otherwise, check if the ID exists in allAccess
    return !!(allAccess.value && allAccess.value[menu_id] && allAccess.value[menu_id][access_id]);
};

const store = useCategoryStore();
const categoryData = computed(() => store.categories);
const pagination = computed(() => store.pagination);
//For Loading Component
const isLoading = ref('success');
//For Right Side Filter
const visibleRight = ref(false);
//delete
const selectedCategoryId = ref(null);
const deleteModalVisible = ref(false);
const deleteLoading = ref(false);
//Pagination Initial PageNumber
const pageNumber = ref(1);
// Initialize Toast
const toast = useToast();
// Date Formatter
const { dateMonthFunction } = useDataDate();

//sidebar
const tempCategoryName = ref("");
const tempStatusName = ref("");
const categoryName = ref("");
const categoryStatus = ref("");
const CategoryCommition = ref("");
const filteredDataCount = ref();
const filted = ref([]);
// Watch slideName field changes and apply filter
const applyFilter = async () => {
    if (tempCategoryName.value) {
        categoryName.value = tempCategoryName.value;
    }
    else {
        categoryName.value = "";
    }

    if (tempStatusName.value) {
        categoryStatus.value = tempStatusName.value;
    }
    else {
        categoryStatus.value = "";
    }

    if (categoryName.value || categoryStatus.value || CategoryCommition.value) {
        isLoading.value = 'loading';
        const res = await store.filterdData(tempCategoryName.value, tempStatusName.value, CategoryCommition.value);
        filted.value = res.data;
        filteredDataCount.value = res.data.length;
        isLoading.value = 'success';
        // console.log(categoryStatus.value);
    }
};
// watch([categoryName, categoryStatus], applyFilter);
// On Load or Reload Get New Updated Data
const loadCategories = async () => {
    isLoading.value = 'Loading';
    await store.getAllCategories(pageNumber.value, store.pagination.perPage);
    categoryData.value = store.categories;
    isLoading.value = 'success';
};
// Ensure data is loaded before the component mounts
onBeforeMount(async () => {
    await loadCategories();
});
// For changes in the store Category and update CategoryData accordingly
const updateCategoryData = () => {
    categoryData.value = store.categories;
};
// Watch PageNumber Change
watch(pageNumber, async (newPage) => {
    isLoading.value = 'loading';
    await store.getAllCategories(newPage, pagination.value.perPage);
    isLoading.value = 'success';
});
// OnPage Change Get New Data
const onPageChange = (newPage) => {
    pageNumber.value = newPage;
    store.getAllCategories(pageNumber.value, pagination.value.perPage);
};
// On Search Get New Category Data
const handleSearch = () => {
    pageNumber.value = 1;
    store.getAllCategories(pageNumber.value, store.pagination.perPage);
};
// On Apply Filter Get New Category Data
const goToPage = (page) => {
    if (page > 0 && page <= pagination.value.totalPages) {
        pageNumber.value = page;
        store.getAllCategories(pageNumber.value, pagination.value.perPage);
    }
};
// Handle Delete Category
const handleDelete = async () => {
    deleteLoading.value = true;
    const result = await store.deleteCategory(selectedCategoryId.value);
    console.log(result);
    deleteLoading.value = false;
    deleteModalVisible.value = false;
    toast.add({
        severity: result.success ? 'success' : 'error',
        summary: result.success ? 'Success' : 'Error',
        detail: result.message,
        life: 3000,
    });
    // Reload the slides after deletion
    if (result.success) {
        await loadCategories();
    }
};
// Open the delete modal for the specific slide
const openDeleteModal = (CategoryId) => {
    selectedCategoryId.value = CategoryId;
    deleteModalVisible.value = true;
};
</script>
<template>
    <NuxtLayout :name="layout">
        <Toast />
        <Spiner :loading=isLoading />
        <div class="w-full px-3 mt-1">

            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <!-- Header with Back, Filter, and Add Buttons -->
                <div class="flex w-full justify-between bg-gray-400 text-white">

                    <div class="font-semibold mt-1 ml-3">Category</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()"
                            class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>

                        <button
                            class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform  hover:text-black px-4 py-1 text-sm "
                            @click="visibleRight = true">
                            <Icon name="iconoir:filter-solid"></Icon>
                            Filter
                        </button>
                        <NuxtLink to="category/create" v-if="visibleAllow(2, 2)"
                            class="bg-cyan-600 hover:bg-cyan-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-rt-sm">
                            <Icon name="zondicons:add-outline"></Icon>
                            Add
                        </NuxtLink>
                    </div>

                </div>

                <!-- Table list goes here -->
                <div class=" h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
                    <table class="table-fixed w-full">
                        <!-- Table Headers -->
                        <thead>
                            <tr class="w-full bg-gray-300 text-sm">
                                <th class="p-1 text-left text-sm w-8">SL</th>
                                <th class="p-1 text-left text-sm w-12">Icon</th>
                                <th class="p-1 text-left text-sm">Title</th>
                                <th class="p-1 text-left text-sm">Category</th>
                                <th class="p-1 text-left text-sm w-48">Description</th>
                                <th class="p-1 text-left text-sm">Comission</th>
                                <th class="p-1 text-left">Status</th>
                                <th class="p-1 text-left">Created Date</th>
                                <th class="p-1 text-center">Created By</th>
                                <th class="p-1 text-center w-24">Actions</th>
                            </tr>
                        </thead>
                        <!-- Table Body -->
                        <tbody>
                            <tr v-for="category in (categoryName && categoryName.length > 0 || categoryStatus ? filted : categoryData)"
                                :key="category.unique_id" class="bg-white odd:bg-gray-100">
                                <!-- Serial ID -->
                                <td class="p-1 text-center text-xs">
                                    {{ category.id }}
                                </td>
                                <!-- Icon -->
                                <td class="p-1 text-left text-xs">
                                    <img :src="category.icon" class="w-8 h-8" alt="icon" />
                                </td>
                                <td class="p-1 text-left text-xs">
                                    {{ category.name }}
                                </td>
                                <!--Sub Category-->
                                <td class="p-1 text-left text-xs">

                                    <span v-if="category.categories.length > 0">
                                        <template v-for="(parentC, index) in category.categories" :key="parentC.id">
                                            {{ parentC.name }}<span v-if="category?.categories.length > (index + 1)">,
                                            </span>
                                        </template>
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <!--Description-->
                                <td class="p-1 text-left text-xs">{{ category.description }}</td>
                                <!-- commission -->
                                <td class="p-1 text-left text-xs">{{ category.commission }}</td>
                                <!--Status-->
                                <td class="p-1 text-left text-xs">{{ category.status == '1' ? 'Active' : 'Inactive' }}
                                </td>
                                <!--Created Date-->
                                <td class="p-1 text-left text-xs">{{ dateMonthFunction(category.created_at) }}</td>
                                <!--Creaeted By-->
                                <td class="p-1 text-center text-xs">{{ category.created_by == '1' ? "Admin" : "Majedul Islam" }}</td>
                                <!-- & Other Buttons-->
                                <td class="p-1 text-center text-xs flex justify-center">
                                    <div class="rounded-md mx-1 cursor-pointer bg-yellow-500 p-1 text-white"
                                        title="Edit">
                                        <nuxt-link :to="`/category/${category.id}`">
                                            <Icon name="subway:pencil" width="1.4em" height="1.4em" />
                                        </nuxt-link>
                                    </div>
                                    <button @click="openDeleteModal(category.id)"
                                        class="rounded-md bg-red-600 p-1 text-white" title="Delete">
                                        <Icon name="bxs:trash" width="1.4em" height="1.4em" />
                                    </button>
                                </td>
                            </tr>



                        </tbody>
                    </table>
                </div>

                <!-- Table Footer-->
                <div class="order_title text-sm flex justify-between h-full">
                    <!-- Search Box -->
                    <div class="mt-[2px] ml-3">
                        <InputGroup>
                            <input type="number" v-model="pageNumber" @keyup.enter="goToPage(pageNumber)"
                                class="border border-r-0 p-1 focus:outline-none" placeholder="Page Number" />
                            <icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer" name="nonicons:go-16"
                                color="#000" @click="goToPage(pageNumber)" />
                        </InputGroup>
                    </div>
                    <!-- Pagination -->
                    <div class="pt-2">
                        <Pagination :currentPage="pageNumber" :totalPages="pagination.totalPages"
                            :links="pagination.links" @paginate="onPageChange" />
                    </div>
                </div>
            </div>

            <Sidebar v-model:visible="visibleRight" header="Category Filter" position="right">
                <div class="w-full">
                    <label for="dd-city" class="text-sm w-full">Category Name</label>
                    <input type="text" v-model="tempCategoryName"
                        class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                        placeholder="Category Name" />
                </div>
                <div class="w-full mt-2">
                    <label for="dd-city" class="text-sm w-full">Status</label>
                    <select v-model="tempStatusName" name="status" id="commission_type"
                        class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                        <option value="1"> Active</option>
                        <option value="0"> Inactive</option>
                        <option value=""> All</option>
                    </select>
                </div>
                <!-- <div class="w-full">
                        <label for="dd-city" class="text-sm w-full">Category Commition</label>
                        <input type="number" v-model="CategoryCommition" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Category Commition"/>
                    </div> -->
                <div class="font-semibold flex mt-2 place-content-end">
                    <button
                        class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm rounded-md"
                        @click="applyFilter">
                        <Icon name="fluent:search-12-filled"></Icon>
                        Search
                    </button>
                </div>
                <!-- Show the length of filtered data -->
                <div class="mt-2 text-sm text-gray-600">
                    <span v-if="filteredDataCount">Showing {{ filteredDataCount }} results</span>
                    <span v-else>No results found</span>
                </div>
            </Sidebar>


            <!-- Delete Modal -->
            <Dialog v-model:visible="deleteModalVisible" modal header="Delete Slide" :style="{ width: '25rem' }">
                <span class="p-text-secondary flex items-center justify-center flex-col mb-5">
                    <Icon name="material-symbols:delete-sweep-rounded" width="120px" height="120px"
                        class="mr-2 text-red-500" />
                    Are you sure you want to delete this Category?
                </span>
                <div class="flex justify-around">
                    <Button class="bg-yellow-600 text-red-100 px-4 py-2" type="button" label="Cancel"
                        severity="secondary" @click="deleteModalVisible = false"></Button>
                    <Button class="bg-red-600 text-red-100 px-4 py-2" type="button" label="Delete" @click="handleDelete"
                        :loading="deleteLoading"></Button>
                </div>
            </Dialog>
        </div>
    </NuxtLayout>

</template>