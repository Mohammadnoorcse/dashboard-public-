<script setup>
    import InputGroup from 'primevue/inputgroup';
    import Sidebar from 'primevue/sidebar';
    import Dialog from 'primevue/dialog';
    import Toast from 'primevue/toast';
    import { useDataDate } from '~/composables/useDataDate';
    import { useCouponStore } from '~/stores/coupon';

    //Define Page Meta
    definePageMeta({
        layout: "dashboard",
        middleware: ['auth'],
    })
    
    const permissionStore = usePermissionStore();
    const { accessMenu, allAccess } = storeToRefs(permissionStore);
    const accessMenuKeys = computed(() => Object.keys(accessMenu.value));
    console.log("Permission Fetch Result allAccess:", allAccess.value);

    // Function to check access
    const visibleAllow = (menu_id, access_id) => {
        if (accessMenuKeys.value.includes("super_admin")) {
            return true; // If user has "super_admin" access, return true
        }
        return !!(allAccess.value && allAccess.value[menu_id] && allAccess.value[menu_id][access_id]); // Otherwise, check if the ID exists in allAccess
    };

    // Coupon Row data And Pagination From Store
    const store = useCouponStore();
    const couponData = computed(() => store.coupons);
    const pagination = computed(() => store.pagination);
    //For Loading Component
    const isLoading = ref('success');
    //For Right Side Filter
    const visibleRight = ref(false);
    //delete
    const selectedCouponId = ref(null);
    const deleteModalVisible = ref(false);
    const deleteLoading = ref(false);
    //Pagination Initial PageNumber
    const pageNumber = ref(1);
    // Initialize Toast
    const toast = useToast();
    //sidebar
    const couponName = ref();
    const couponStatus = ref("");
    const filteredDataCount = ref();
    const filted = ref();
    // Date Formatter
    const { dateMonthFunction } = useDataDate();
    //FilterData
    const tempCouponName = ref("")
    const tempCouponStatus = ref("")

    const filterCoupons = async () => {
        // Update couponName from tempCouponName
        if (tempCouponName.value) {
            couponName.value = tempCouponName.value;
        } else {
            couponName.value = "";
        }

        // Update couponStatus from tempCouponStatus
        if (tempCouponStatus.value) {
            couponStatus.value = tempCouponStatus.value;
        } else {
            couponStatus.value = "";
        }

        // Check if there is a filter applied
        if (couponName.value || couponStatus.value) {
            isLoading.value = 'loading';
            try {
                const res = await store.filterdData(tempCouponName.value, tempCouponStatus.value);
                filted.value = res.data;
                // console.log("Response::", res, "Name:", tempCouponName.value, "Status:", tempCouponStatus.value);
                filteredDataCount.value = res.data.length;
                isLoading.value = 'success';
            } catch (error) {
                console.error("Error fetching filtered data:", error);
                isLoading.value = 'error';
            }
        }
    };

    // watch(tempCouponName, filterCoupons);
    watch(couponStatus, filterCoupons);
    // On Load or Reload Get New Updated Data
    const loadCoupons = async () => {
        isLoading.value = 'Loading';
        await store.getAllCoupons(pageNumber.value, store.pagination.perPage);
        couponData.value = store.coupons;
        isLoading.value = 'success';
    };
    // Ensure data is loaded before the component mounts
    onBeforeMount(async () => {
     await loadCoupons();
    });
    // Watch for changes in the store Coupon and update CouponData accordingly
    // watch(
    //     () => store.coupons,
    //     (newCoupons) => {
    //         couponData.value = newCoupons;
    //     }
    // );
    // const updateCouponData = () => {
    //     couponData.value = store.coupons;
    // };
    // onMounted(() => {
    //     updateCouponData();
    // })
    // Watch PageNumber Change
    watch(pageNumber,async (newPage) => {
        isLoading.value = 'loading';
        await store.getAllCoupons(newPage, pagination.value.perPage);
        isLoading.value = 'success';
    });
    // OnPage Change Get New Data
    const onPageChange = (newPage) => {
        pageNumber.value = newPage;
        store.getAllCoupons(pageNumber.value, pagination.value.perPage);
    };
    // On Search Get New Coupon Data
    const handleSearch = () => {
        pageNumber.value = 1;
        store.getAllCoupons(pageNumber.value, store.pagination.perPage);
    };
    // On Apply Filter Get New Coupon Data
    const goToPage = (page) => {
        if (page > 0 && page <= pagination.value.totalPages) {
            pageNumber.value = page;
            store.getAllCoupons(pageNumber.value, pagination.value.perPage);
        }
    };
    // Handle Delete Coupon
    const handleDelete = async () => {
        deleteLoading.value = true;
        const result = await store.deleteCoupon(selectedCouponId.value);
        console.log(result);
        deleteLoading.value = false;
        deleteModalVisible.value = false;
        toast.add({
            severity: result.success ? 'success' : 'error',
            summary: result.success ? 'Success' : 'Error',
            detail: result.message,
            life: 3000,
        });
        // Reload the Coupon after deletion
        if (result.success) {
            await loadCoupons();
        }
    };
    // Open the delete modal for the specific Coupon
    const openDeleteModal = (couponId) => {
        selectedCouponId.value = couponId;
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
                        
                        <div class="font-semibold mt-1 ml-3">Coupon</div>
                        <div class="font-semibold ml-1 flex">
                            <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                                <Icon name="gg:arrow-left-o"></Icon>
                                Back
                            </button>

                            <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform  hover:text-black px-4 py-1 text-sm " @click="visibleRight = true">
                                <Icon name="iconoir:filter-solid"></Icon>
                                Filter
                            </button>
                            <NuxtLink v-if="visibleAllow(12, 2)" to="Coupon/create" class="bg-cyan-600 hover:bg-cyan-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-rt-sm">
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
                                    <th class="p-1 text-left text-sm">Name</th>
                                    <th class="p-1 text-left text-sm">Max Amount</th>
                                    <th class="p-1 text-left text-sm">Use Limit</th>
                                    <th class="p-1 text-left text-sm">Start Offer</th>
                                    <th class="p-1 text-left text-sm">End Offer</th>
                                    <th class="p-1 text-left">Status</th>
                                    <th class="p-1 text-left w-24">Created At</th>
                                    <th class="p-1 text-center">Created By</th>
                                    <th class="p-1 text-center w-24">Actions</th>
                                </tr>
                            </thead>
                            <!-- Table Body -->
                            <tbody>
                                <tr v-for="coupon in (couponName && couponName.length > 0 || couponStatus ? filted : couponData)" :key="coupon.unique_id" class="bg-white odd:bg-gray-100">
                                    <!-- Serial ID -->
                                    <td class="p-1 text-left text-sm w-8">{{ coupon.id }}</td>
                                    <!-- Icon -->
                                    <td class="p-1 text-left text-sm w-12">
                                        <img :src="coupon.icon" class="w-8 h-8" alt="Coupon Icon">
                                    </td>
                                    <!--Coupon Name-->
                                    <td class="p-1 text-left text-sm">{{ coupon.name }}</td>
                                    <!--Max Amount-->
                                    <td class="p-1 text-left text-sm">{{ coupon.max_amount }}</td>
                                    <!--Use Limite-->
                                    <td class="p-1 text-left text-sm">{{ coupon.use_limit }}</td>
                                    <!--Start Offer-->
                                    <td class="p-1 text-left text-sm">{{ coupon.start_offer }}</td>
                                    <!--End Offer-->
                                    <td class="p-1 text-left text-sm">{{coupon.end_offer}}</td>
                                    <!--Status-->
                                    <td class="p-1 text-left text-xs">{{ coupon.status == '1' ? 'Active' : 'Inactive' }}</td>
                                    <!--Created Date-->
                                    <td class="p-1 text-left text-xs">{{  dateMonthFunction(coupon.created_at)  }}</td>
                                    <!--Created By-->
                                    <td class="p-1 text-center text-xs">{{ coupon.created_by =='1' ? "Admin":"Majedul Islam" }}</td>
                                    <!--& Others Button-->
                                    <td class="p-1 text-center text-xs flex justify-center">
                                        <div v-if="visibleAllow(12, 3)" class="rounded-md mx-1 bg-yellow-500 p-1 text-white" title="Edit">
                                            <NuxtLink :to="`/coupon/${ coupon.id }`">
                                                <Icon name="subway:pencil" width="1.4em" height="1.4em" />
                                            </NuxtLink>
                                        </div>
                                        <button v-if="visibleAllow(12, 4)" @click="openDeleteModal(coupon.id)" class="rounded-md bg-red-600 p-1 text-white" title="Delete"><Icon name="bxs:trash" width="1.4em" height="1.4em" /></button>
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

                <Sidebar v-model:visible="visibleRight" header="Coupon Filter" position="right">
                    <div class="w-full">
                        <label for="dd-city" class="text-sm w-full">Coupon Name</label>
                        <input type="text" v-model="tempCouponName" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Coupon Name"/>
                    </div>
                    <div class="w-full mt-2">
                        <label for="dd-city" class="text-sm w-full">Status</label>
                        <select v-model="tempCouponStatus" name="status" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                            <option value="1"> Active</option>
                            <option value="0"> Inactive</option>
                            <option value=""> All</option>
                        </select>
                    </div>

                    <div class="font-semibold flex mt-2 place-content-end">
                        

                        <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform  hover:text-black px-4 py-1 text-sm rounded-md" @click="filterCoupons">
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
                <Dialog v-model:visible="deleteModalVisible" modal header="Delete Coupon" :style="{ width: '25rem' }">
                    <span class="p-text-secondary flex items-center justify-center flex-col mb-5">
                        <Icon name="material-symbols:delete-sweep-rounded" width="120px" height="120px" class="mr-2 text-red-500" />
                        Are you sure you want to delete this Coupon ?
                    </span>
                    <div class="flex justify-around">
                        <Button class="bg-yellow-600 text-red-100 px-4 py-2" type="button" label="Cancel" severity="secondary" @click="deleteModalVisible = false"></Button>
                        <Button class="bg-red-600 text-red-100 px-4 py-2" type="button" label="Delete" @click="handleDelete" :loading="deleteLoading"></Button>
                    </div>
                </Dialog>
            </div>
        </NuxtLayout>

</template>