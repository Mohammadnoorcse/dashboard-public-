<script setup>
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Sidebar from "primevue/sidebar";
import TabMenu from "primevue/tabmenu";
import Calendar from "primevue/calendar";

import Dropdown from "primevue/dropdown";

import { ref } from "vue";

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;

const loading = ref('not')
const products = ref([])
const pageNumber = ref(1)

const searchQuery = ref("");
const status = ref("");
const minPrice = ref();
const maxPrice = ref();
const stDate = ref();
const enDate = ref();
const totalProducts = ref(0);

const colors = ref([]);
const sizes = ref([]);
const selectedColor = ref(null);
const selectedSize = ref(null);

const visibleRight = ref(false);

// Get Brand Name from api
const brand = ref([]); // Holds the dropdown options
const selectedBrand = ref(null); // Holds the selected brand ID


const vendor = ref([]); // Holds the dropdown options
const selectedVendor = ref(null); // Holds the selected vendor ID

const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
});

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

onMounted(async () => {

    try {
        products.value = await $fetch(`${EndPoint}/admin/${MasterKey}/product?orderBy=desc&limit_per_page=10`,
            {
                method: 'get',
                headers: headers.value,
            }
        )

        loading.value = "success";
        console.log("All Products>>>>>>",products.value);


    } catch (err) {
        console.log(err)
    }

})


const paginate = async (page) => {
    loading.value = "not";
    pageNumber.value = page;

    if(page == "&laquo; Previous"){

        pageNumber.value  = ((products.value.current_page-1) == 0 ? 1 : (products.value.current_page-1));

    }else if( page == 'Next &raquo;'){

        pageNumber.value  = ((products.value.current_page+1) == products.value.last_page ? products.value.last_page : (products.value.current_page+1));
        
    }
        
    try {
            
        products.value = await $fetch(`${EndPoint}/admin/${MasterKey}/product?orderBy=desc&limit_per_page=10&page=${pageNumber.value}`,
                {
                    method: 'get',
                    headers: headers.value,
                }
            );
            // console.log("Curr",products.value.current_page)

    }
    catch (error) {
        console.log(error);
    }

    loading.value = "success";
}



const getAllBrand = async () =>{
    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/brand?`, {
            method: 'GET',
            headers: headers.value,
            });
            // Map API data to the required format
            brand.value = response.data.map(b => ({
                name: b.name, // Dropdown label
                id: b.id, // Dropdown value
            }));
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
}
getAllBrand()
    
// Utility function to get the name of the selected brand
const getBrandName = (id) => {
    const selected = brand.value.find(b => b.id === id);
    return selected ? selected.name : '';
};

const getAllVendor = async () =>{
    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/vendor?`, {
            method: 'GET',
            headers: headers.value,
        });
        // Map API data to the required format
        vendor.value = response.data.map(b => ({
            name: b.name, // Dropdown label
            id: b.id, // Dropdown value
        }));
    } catch (error) {
        console.error('Error fetching vendor:', error);
    }
}
getAllVendor()

// Utility function to get the name of the selected vendor
const getVendorName = (id) => {
    const selected = vendor.value.find(b => b.id === id);
    return selected ? selected.name : '';
};

// Function to fetch and set additional options
const getAdditional = async () =>{
    try {
        // Fetch the data from API
        const response = await $fetch(`${EndPoint}/additional`, {
            method: "GET",
            headers: headers.value,
        });
        // console.log("Response:", response); // Debug: Log the response to verify

        // Extract only the colors from the response
        if (response.colors) {
            // Map over the colors to create a proper structure
            colors.value = response.colors.map(c => ({
                name: c.color, // Extract the color name
            }));
        }
        if (response.sizes) {
            // Map over the sizes to create a proper structure
            sizes.value = response.sizes.map(s => ({
                name: s.size, // Extract the size name
            }));
        }
        // console.log("Sizes:", sizes.value); // Debug: Log colors to verify
        loading.value = "success";
    } catch (err) {
        console.log("Error fetching colors:", err);
        loading.value = "error";
    }
}
getAdditional()


// Implemented the search functionality
const fetchFilteredProducts = async () => {
    loading.value = "not";
    try {
        // Handle price range, colors, and sizes
        const priceRange = minPrice.value && maxPrice.value 
            ? `${minPrice.value},${maxPrice.value}` 
            : undefined;

        const colorParams = Array.isArray(selectedColor.value) 
            ? selectedColor.value.map(color => color.name.trim()).join(',')
            : selectedColor.value?.name?.trim();

        const sizeParams = Array.isArray(selectedSize.value) 
            ? selectedSize.value.map(size => size.name.trim()).join(',')
            : selectedSize.value?.name?.trim();

        const stDateParams = stDate.value ? stDate.value.toISOString().split('T')[0] : undefined;
        const enDateParams = enDate.value ? enDate.value.toISOString().split('T')[0] : undefined;

        // Create the parameters object
        const params = {
            name: searchQuery.value || undefined,
            status: status.value,
            current_price_range: priceRange || undefined,
            brand_id: selectedBrand.value || undefined,
            vendor_id: selectedVendor.value || undefined,
            colors: colorParams || undefined,
            sizes: sizeParams || undefined,
            range_from_date: stDateParams || undefined,
            range_to_date: enDateParams || undefined,
        };

        // Filter out null, undefined, or empty values
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
        );

        // Make the API request
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/product`, {
            method: 'get',
            headers: headers.value,
            params: filteredParams,
        });

        // Process the response
        products.value = response;
        totalProducts.value = response.total;
        loading.value = "success";

        // Debugging logs
        // console.log("Sizes:", selectedSize.value);
        console.log("Filtered products:", products.value);
    } catch (error) {
        console.log(error);
        loading.value = "error";
    }
};
</script>
<template>
    <NuxtLayout :name="layout">
        <div class="w-full px-3 mt-1">
            <div v-if="loading !== 'success'" class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed" >
                <div class="w-12 mx-auto">
                    <img alt="loading..." src="/spinner.gif" />
                </div>
            </div>
            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md" >
                <div class="flex w-full justify-between bg-gray-400 text-white">
                    <div class="font-semibold mt-1 ml-3">Products</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100" >
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>

                        <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm" @click="visibleRight = true" >
                            <Icon name="iconoir:filter-solid"></Icon>
                            Filter
                        </button>
                        <NuxtLink v-if="visibleAllow(8,2)" to="product/create" class="bg-cyan-600 hover:bg-cyan-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-rt-sm" >
                            <Icon name="zondicons:add-outline"></Icon>
                            Add
                        </NuxtLink>
                    </div>
                </div>

                <!-- Table list goes here -->
                <div class="h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3" >
                    <table class="w-full table-auto">
                        <thead>
                            <tr class="w-full bg-gray-300 text-sm">
                                <th class="p-1 text-left text-sm w-8">SL</th>
                                <th class="p-1 text-left text-sm w-12">Icon</th>
                                <th class="p-1 text-left text-sm">Product Name</th>
                                <th class="p-1 text-left text-sm">Price</th>
                                <th class="p-1 text-left text-sm">Stock</th>
                                <th class="p-1 text-left text-sm">Category</th>
                                <th class="p-1 text-left text-sm">Color</th>
                                <th class="p-1 text-left text-sm">Size</th>
                                <th class="p-1 text-left text-sm">Vendor</th>
                                <th class="p-1 text-left">Status</th>
                                <th class="p-1 text-center w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in products.data" class="bg-white odd:bg-gray-100" :key="product.id">
                                <!-- Maintain for serial key -->
                                <td class="p-1 text-center text-xs"> {{ products.current_page > 1 ?(((products.total) - ((products.current_page-1)*products.per_page))-index) : ((products.total) - index) }}</td>
                                <td class="p-1 text-left text-xs"><img class="h-8" :src="product.icon_small"/></td>
                                <td class="p-1 text-left text-xs"><p class="w-72">{{ product.name }}</p></td>
                                <td class="p-1 text-left text-xs">{{ product.current_price }} <del>{{ product.regular_price }}</del></td>
                                <td class="p-1 text-left text-xs">{{ product.stock }}</td>
                                <td class="p-1 text-left text-xs"><span v-for="(category, index) in product?.categories" :key="index">{{ category.name }}<span v-if="product?.categories.length > (index+1)">,</span></span></td>
                                <td class="p-1 text-left text-xs">{{ product.attributes.colors }}</td>
                                <td class="p-1 text-center text-xs">{{ product.attributes.sizes }}</td>
                                <td class="p-1 text-center text-xs">{{ product.vendor?.name }}</td>
                                <td class="p-1 text-center text-xs">{{ product.status ? "Active" : "Inactive" }}</td>
                                <td class="p-1 text-center text-xs flex">
                                    <div v-if="visibleAllow(8,3)" class="rounded-s-sm bg-blue-600 px-2 py-1 mt-1 text-white" title="Additional Product">
                                        <NuxtLink :to="`/product/additional/${product.id}`"><Icon name="fa6-solid:clone" width="1em" height="1em"/></NuxtLink>
                                    </div>

                                    <NuxtLink v-if="visibleAllow(8,1)" class="bg-cyan-400 px-2 py-1 mt-1 text-white" title="View" :to="`/product/details/${product.id}`">
                                        <Icon name="mdi:eye" width="1em" height="1em"/>
                                    </NuxtLink>

                                    <NuxtLink v-if="visibleAllow(8,3)" class="bg-green-600 px-2 py-1 mt-1 text-white" title="View" :to="`/product/medias/${product.id}`">
                                        <Icon name="ic:sharp-perm-media" width="1em" height="1em"/>
                                    </NuxtLink>

                                    <NuxtLink v-if="visibleAllow(8,3)" :to="`/product/${product.id}/edit`" class="bg-yellow-500 px-2 py-1 mt-1 text-white" title="Edit" >
                                        <Icon name="subway:pencil" width="1em" height="1em"/>
                                    </NuxtLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="order_title text-sm flex justify-between h-full">
                    <div class="mt-[2px] ml-3">
                        <InputGroup>
                            <input type="number" v-model="pageNumber" class="border border-r-0 p-1 focus:outline-none" placeholder="Pagen Number"/>
                            <icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer" @click="paginate(pageNumber)" name="nonicons:go-16" color="#000" />
                        </InputGroup>
                    </div>
                    <div class="flex -mt-1 h-dvh">
                        <a v-for="(page, index) in products?.links" :key="index" @click="paginate(page.label)" v-html="page.label" :class="{'border-t-4 px-2 border-red-500 text-red-500':page.active }" class="px-2 pt-2 mt-1 block text-black" href="#" />
                    </div>
                </div>
            </div>

            <!-- Filter Order Sidebar -->
            <Sidebar v-model:visible="visibleRight" header="Product Filter" position="right" >
                <!--  Product Name  -->
                <div class="w-full">
                    <label for="dd-city" class="text-sm w-full">By Name</label>
                    <input type="text" v-model="searchQuery" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Enter Product Name" />
                </div>

                <!--  Product Status-->
                <div class="w-full mt-2">
                    <label for="dd-city" class="text-sm w-full">Status</label>
                    <select v-model="status" name="status" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" >
                        <option :value="1">Active</option>
                        <option :value="0">Inactive</option>
                        <option value="">All</option>
                    </select>
                </div>
                <!--  Price Range-->
                <div class="w-full mt-2">
                    <label for="dd-city" class="text-sm w-full" >Price Range</label>
                    <div>
                        <input type="number" v-model="minPrice" class="w-[48%] mr-1 text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Min." />
                        <input type="number" v-model="maxPrice" class="w-1/2 text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Max." />
                    </div>
                </div>
                <!-- Date Range-->
                <div class="w-full mt-2">
                    <label for="dd-city" class="text-sm w-full">Date Range</label>
                    <div>
                        <Calendar :pt="{ input: { class: 'px-4 py-1 border', }, }" class="w-[48%] mr-1 text-sm outline-none focus:border-red-200 rounded-md" v-model="stDate" placeholder="Start Date" />
                        <Calendar :pt="{ input: { class: 'px-4 py-1 border', }, }" class="w-1/2 text-sm outline-none focus:border-red-200 rounded-md" v-model="enDate" placeholder="End Date" />
                    </div>
                </div>
                <!-- size & Color-->
                <div class="w-full grid grid-cols-2 gap-2 mt-2">
                    <!-- Color Filter -->
                    <div class="w-full mt-2">
                        <label for="size-filter" class="text-sm w-full">Color</label>
                        <MultiSelect v-model="selectedColor" :options="colors" optionLabel="name" placeholder="Select a Color" class="w-full md:w-14rem h-11 flex items-center border border-gray-300"></MultiSelect>
                    </div>
                    <!-- Size Filter -->
                    <div class="w-full mt-2">
                        <label for="color-filter" class="text-sm w-full">Size</label>
                        <Dropdown v-model="selectedSize" :options="sizes" optionLabel="name" placeholder="Select a Size" class="w-full md:w-14rem" >
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center" >
                                    <div>{{ slotProps.value.name }}</div>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                </div>
                <!-- Brand & Vendors-->
                <div class="w-full grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label for="dd-city" class="text-sm w-full">Brand</label>
                        <Dropdown v-model="selectedBrand" :options="brand"  optionLabel="name" optionValue="id" filter placeholder="Select a Brand" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <div>{{ getBrandName(slotProps.value) }}</div>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <div>
                        <label for="dd-city" class="text-sm w-full">Vendor</label>
                        <Dropdown v-model="selectedVendor" :options="vendor" optionLabel="name" optionValue="id" filter placeholder="Select a Vendor" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center" >
                                    <div>{{ getVendorName(slotProps.value) }}</div>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <div></div>
                </div>

                <!-- Search Icon -->
                <div class="font-semibold flex mt-2 place-content-end">
                    <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm rounded-md" @click="fetchFilteredProducts" >
                        <Icon name="fluent:search-12-filled"></Icon>
                        Search
                    </button>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                    <span v-if="totalProducts">Showing {{ totalProducts }} results</span>
                    <span v-else>No results found</span>
                </div>
            </Sidebar>
        </div>
    </NuxtLayout>
</template>

<style scoped>
span.p-dropdown-label.p-inputtext.p-placeholder {
    padding: 2px;
}
</style>