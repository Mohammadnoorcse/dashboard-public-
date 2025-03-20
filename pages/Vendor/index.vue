<script setup>
    import InputGroup from 'primevue/inputgroup';
    import Sidebar from 'primevue/sidebar';
    import Dialog from 'primevue/dialog';
    import Toast from 'primevue/toast';
    import { useVendorStore } from '~/stores/vendor';

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
    console.log("Permission Fetch Result allAccess:", allAccess.value);

    // Function to check access
    const visibleAllow = (menu_id, access_id) => {
        // If user has "super_admin" access, return true
        if (accessMenuKeys.value.includes("super_admin")) {
            return true;
        }
        // Otherwise, check if the ID exists in allAccess
        return !!(allAccess.value && allAccess.value[menu_id] && allAccess.value[menu_id][access_id]);
    };
    // console.log(allAccess.value[7][2])

    // Vendors Row data And Pagination From Store
    const store = useVendorStore();
    const vendorData = computed(() => store.Vendors);
    const pagination = computed(() => store.pagination);
    //For Loading Component
    const isLoading = ref('success');
    //For Right Side Filter
    const visibleRight = ref(false);
    //delete
    const selectedVendorId = ref(null);
    const deleteModalVisible = ref(false);
    const deleteLoading = ref(false);
    //Pagination Initial PageNumber
    const pageNumber = ref(1);
    // Initialize Toast
    const toast = useToast();
    // Date Formatter
    const { dateMonthFunction } = useDataDate();
//sidebar
const vendorName = ref();
const tempVendorName =  ref()
const vendorStatus = ref("");
const tempVendorStatus = ref("")
const filteredDataCount = ref();
const filted = ref();
// Watch vendorName field changes and apply filter
const applyFilter = async () => {
            // Update vendorName from tempVendorName
        if (tempVendorName.value) {
            vendorName.value = tempVendorName.value;
        } else {
            vendorName.value = "";
        }

        // Update vendorStatus from tempVendorStatus
        if (tempVendorStatus.value) {
            vendorStatus.value = tempVendorStatus.value;
        } else {
            vendorStatus.value = "";
        }
    if (vendorName.value || vendorStatus.value) {
        isLoading.value = 'loading';
        const res = await store.filterdData(tempVendorName.value, tempVendorStatus.value);
        filted.value = res.data;
        filteredDataCount.value = res.data.length;
        isLoading.value = 'success';
    }
};

// watch([vendorName, vendorStatus], applyFilter);

    // On Load or Reload Get New Updated Data
    const loadVendors = async () => {
        isLoading.value = 'Loading';
        await store.getAllVendors(pageNumber.value, store.pagination.perPage);
        vendorData.value = store.Vendors;
        isLoading.value = 'success';
    };
    // Ensure data is loaded before the component mounts
    onBeforeMount(async () => {
    await loadVendors();
    });
    // Watch for changes in the store Vendor and update VendorData accordingly
    watch(
    () => store.Vendors,
    (newVendors) => {
        vendorData.value = newVendors;
    }
    );
    // Watch PageNumber Change
    watch(pageNumber,async (newPage) => {
    isLoading.value = 'loading';
    await store.getAllVendors(newPage, pagination.value.perPage);
    isLoading.value = 'success';
    });
    // OnPage Change Get New Data
    const onPageChange = (newPage) => {
        pageNumber.value = newPage;
        store.getAllVendors(pageNumber.value, pagination.value.perPage);
    };
    // On Search Get New Vendor Data
    const handleSearch = () => {
        pageNumber.value = 1;
        store.getAllVendors(pageNumber.value, store.pagination.perPage);
    };
    // On Apply Filter Get New Vendor Data
    const goToPage = (page) => {
        if (page > 0 && page <= pagination.value.totalPages) {
            pageNumber.value = page;
            store.getAllVendors(pageNumber.value, pagination.value.perPage);
        }
    };
    // Handle Delete Category
    const handleDelete = async () => {
        deleteLoading.value = true;
        const result = await store.deleteVendor(selectedVendorId.value);
        deleteLoading.value = false;
        deleteModalVisible.value = false;
        
        toast.add({
            severity: result.success ? 'success' : 'error',
            summary: result.success ? 'Success' : 'Error',
            detail: result.message,
            life: 3000,
        });
        // Reload the Vendors after deletion
        if (result.success) {
            await loadVendors();
        }
    };
    // Open the delete modal for the specific Vendor
    const openDeleteModal = (VendorId) => {
        selectedVendorId.value = VendorId;
        deleteModalVisible.value = true;
    };
</script>
<template>
        <NuxtLayout :name="layout">
            <Toast/>
            <Spiner :loading = isLoading />
            <div class="w-full px-3 mt-1">

                <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                    <!-- Header with Back, Filter, and Add Buttons -->
                    <div class="flex w-full justify-between bg-gray-400 text-white">
                        
                        <div class="font-semibold mt-1 ml-3">Vendor</div>
                        <div class="font-semibold ml-1 flex">
                            <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                                <Icon name="gg:arrow-left-o"></Icon>
                                Back
                            </button>

                            <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform  hover:text-black px-4 py-1 text-sm " @click="visibleRight = true">
                                <Icon name="iconoir:filter-solid"></Icon>
                                Filter
                            </button>
                            <NuxtLink to="Vendor/create" v-if="visibleAllow(7,2)" class="bg-cyan-600 hover:bg-cyan-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-rt-sm">
                                <Icon name="zondicons:add-outline"></Icon>
                                Add
                            </NuxtLink>
                        </div>
                        
                    </div>

                    <!-- Table list goes here -->
                    <div class=" h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
                        <table class="table-fixed w-full">
                            <!--Table Header-->
                            <thead>
                                <tr class="w-full bg-gray-300 text-sm">
                                    <th class="p-1 text-left text-sm w-8">SL</th>
                                    <th class="p-1 text-left text-sm w-12">Icon</th>
                                    <th class="p-1 text-left text-sm">Name</th> 
                                    <th class="p-1 text-left text-sm w-48">Description</th>
                                    <th class="p-1 text-left">Status</th>
                                    <th class="p-1 text-left">Created Date</th>
                                    <th class="p-1 text-center">Created By</th>
                                    <th class="p-1 text-center w-24">...</th>
                                </tr>
                            </thead>
                            <!-- Table Body -->
                            <tbody>
                                <tr v-for="vendor in (vendorName && vendorName.length > 0 || vendorStatus ? filted : vendorData)" :key="vendor.unique_id" class="bg-white odd:bg-gray-100">
                                    <!-- Serial ID -->
                                    <td class="p-1 text-center text-xs">{{  vendor.id }}</td>
                                    <!-- Icon -->
                                    <td class="p-1 text-left text-xs">
                                        <img :src="vendor.icon" alt="">
                                    </td>
                                    <!-- Name -->
                                    <td class="p-1 text-left text-xs">{{ vendor.name }}</td>
                                    <!--Description-->
                                    <td class="p-1 text-left text-xs">{{ vendor.description }}</td>
                                    <!--Status-->
                                    <td class="p-1 text-left text-xs">{{ vendor.status == '1' ? 'Active' : 'Inactive' }}</td>
                                    <!--Created_At-->
                                    <td class="p-1 text-left text-xs">{{ dateMonthFunction(vendor.created_at)  }}</td>
                                    <!--Created By-->
                                    <td class="p-1 text-center text-xs">{{ vendor.created_by =='1' ? "Admin":"Majedul Islam" }}</td>
                                    <!--& Others Button-->
                                    <td class="p-1 text-center text-xs flex justify-center">
                                        <div v-if="visibleAllow(7,3)" class="rounded-md mx-1 bg-yellow-500 p-1 text-white" title="Edit">
                                            <NuxtLink :to="`/vendor/${vendor.id}`">
                                                <Icon name="subway:pencil" width="1.4em" height="1.4em" />
                                            </NuxtLink>
                                        </div>
                                        <button v-if="visibleAllow(7,4)" @click="openDeleteModal(vendor.id)" class="rounded-md bg-red-600 p-1 text-white" title="Delete"><Icon name="bxs:trash" width="1.4em" height="1.4em" /></button>
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
                            <input type="number" v-model="pageNumber" @keyup.enter="goToPage(pageNumber)" class="border border-r-0 p-1 focus:outline-none" placeholder="Page Number" />
                            <icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer" name="nonicons:go-16" color="#000" @click="goToPage(pageNumber)" />
                            </InputGroup>
                        </div>
                        <!-- Pagination -->
                        <div class="pt-2">
                            <Pagination
                            :currentPage="pageNumber"
                            :totalPages="pagination.totalPages"
                            :links="pagination.links"
                            @paginate="onPageChange"
                            />
                        </div>
                    </div>
                </div>

                <Sidebar v-model:visible="visibleRight" header="Vendor Filter" position="right">
                    <div class="w-full">
                        <label for="dd-city" class="text-sm w-full">Vendor Name</label>
                        <input type="text" v-model="tempVendorName" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Vendor Name"/>
                    </div>
                    <div class="w-full mt-2">
                        <label for="dd-city" class="text-sm w-full">Status</label>
                        <select v-model="tempVendorStatus" name="status" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                            <option value="1"> Active</option>
                            <option value="0"> Inactive</option>
                            <option value=""> All</option>
                        </select>
                    </div>

                    <div class="font-semibold flex mt-2 place-content-end">

                        <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform  hover:text-black px-4 py-1 text-sm rounded-md" @click="applyFilter">
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
                        <Icon name="material-symbols:delete-sweep-rounded" width="120px" height="120px" class="mr-2 text-red-500" />
                        Are you sure you want to delete this Vendor?
                    </span>
                    <div class="flex justify-around">
                        <Button class="bg-yellow-600 text-red-100 px-4 py-2" type="button" label="Cancel" severity="secondary" @click="deleteModalVisible = false"></Button>
                        <Button class="bg-red-600 text-red-100 px-4 py-2" type="button" label="Delete" @click="handleDelete" :loading="deleteLoading"></Button>
                    </div>
                </Dialog>
            </div>
        </NuxtLayout>

</template>