<script setup>
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Sidebar from "primevue/sidebar";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { ref } from "vue";

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;
const loading = ref('not')


const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})
definePageMeta({
  layout: "dashboard",
  middleware: 'auth',
});

const route = useRoute();
const statusID = route.params.id;
const coreofOrders = ref([])
const pageNumber = ref(1)
const orders = ref([]);
const visibleRight = ref(false);
const vendor = ref([]); // Holds the dropdown options
const selectedVendor = ref(null); // Holds the selected vendor ID
const searchQuery = ref('');
const startDate = ref(null);
const endDate = ref(null);
const totalOrders = ref(0);

onMounted(async () => {
    getOrderData()
    getAllVendors()
});

const getOrderData = async () => {
    loading.value = "not";
    try {
    const response = await $fetch(`${EndPoint}/admin/${MasterKey}/orders?orderBy=desc&page=1&status=${statusID}`, {
    method: 'get',
    headers: headers.value,
    });
    coreofOrders.value = response.orders;
    // console.log(response.orders);
    orders.value = response.orders.data;
    loading.value = "success";
    } catch (err) {
        console.log(err);
    }
}

const paginate = async (page) => {
    loading.value = "not";
    pageNumber.value = page;

    if (page === "&laquo; Previous") {
        pageNumber.value  = ((coreofOrders.value.current_page-1) == 0 ? 1 : (coreofOrders.value.current_page-1));
    } else if (page === "Next &raquo;") {
        pageNumber.value  = ((coreofOrders.value.current_page+1) == coreofOrders.value.last_page ? coreofOrders.value.last_page : (coreofOrders.value.current_page+1));
    }

    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/orders?page=${pageNumber.value}`, {
            method: 'get',
            headers: headers.value,
        });
        orders.value = response;
        console.log("Response PAge:",response);
        orders.value = response.orders.data;

    } catch (error) {
        console.log(error);
    }

    loading.value = "success";
}

const getAllVendors = async () => {
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

// Utility function to get the name of the selected vendor
const getVendorName = (id) => {
    const selected = vendor.value.find(b => b.id === id);
    return selected ? selected.name : '';
};

// Implemented the search functionality
const fetchFilteredOrders = async () => {
    loading.value = "not";
    try {
        const stDateParams = startDate.value ? startDate.value.toISOString().split('T')[0] : '';
        const enDateParams = endDate.value ? endDate.value.toISOString().split('T')[0] : '';
        
        // Create the parameters object and remove any null, undefined, or empty values
        const params = {
            name: searchQuery.value || undefined,
            vendor_id: selectedVendor.value || undefined,
            from_date: stDateParams || undefined,
            to_date: enDateParams || undefined,
        };

        // Remove keys with undefined values
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        );

        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/orders`, {
            method: 'get',
            headers: headers.value,
            params: filteredParams,
        });

        orders.value = response.orders?.data || [];
        totalOrders.value = orders.value.length;
        loading.value = "success";
    } catch (error) {
        console.log(error);
        loading.value = "error";
    }
};



</script>
<template>
    <NuxtLayout :name="layout">
        <div class="w-full px-3 mt-1">
            <div v-if="loading !== 'success'" class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                <div class="w-12 mx-auto">
                    <img alt="loading..." src="/spinner.gif" />
                </div>
            </div>
            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between bg-gray-400 text-white">
                    <div class="font-semibold mt-1 ml-3">
                        <OrderStatus :status-i-d="statusID"/>
                    </div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon> Back
                        </button>

                        <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black text-sm px-4 py-2" @click="visibleRight = true">
                            <Icon name="iconoir:filter-solid"></Icon> Filter
                        </button>
                    </div>
                </div>

                <!-- Table list goes here -->
                <div class="h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
                    <table class="w-full table-auto">
                        <thead>
                            <tr class="w-full bg-gray-300 text-sm">
                                <th class="p-1 text-left text-sm w-8">SL</th>
                                <th class="p-1 text-left text-sm">Order Id</th>
                                <th class="p-1 text-left text-sm">Name</th>
                                <th class="p-1 text-left text-sm">Contact No</th>
                                <th class="p-1 text-left text-sm">Items</th>
                                <th class="p-1 text-left text-sm">Amount</th>
                                <th class="p-1 text-left text-sm">Discount</th>
                                <th class="p-1 text-left text-sm">Total</th>
                                <th class="p-1 text-left text-sm">Advance</th>
                                <th class="p-1 text-left text-sm">Due</th>
                                <th class="p-1 text-left text-sm">Status</th>
                                <th class="p-1 text-center text-sm">...</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(order) in orders" class="bg-white odd:bg-gray-100" :key="order.id">
                                <td class="p-1 text-left text-xs">{{ order.id }}</td>
                                <td class="p-1 text-left text-xs">{{ order.unique_id }}</td>
                                <td class="p-1 text-left text-xs">{{ order.extend_props.contact.name }}</td>
                                <td class="p-1 text-left text-xs">{{ order.extend_props.contact.mobile }}</td>
                                <!-- <td class="p-1 text-left text-xs">{{ order.order_items[0].item_name }}</td> -->
                                <td class="p-1 text-left text-xs">
                                    <ol class="list-decimal pl-5">
                                        <li v-for="item in order.order_items" :key="item.id">
                                            {{ item.item_name.length > 20 ? item.item_name.substring(0, 20) +'...' : item.item_name }}
                                        </li>
                                    </ol>
                                </td>
                                <td class="p-1 text-left text-xs">{{ order.total }}</td>
                                <td class="p-1 text-left text-xs">{{ order.discount }}</td>
                                <td class="p-1 text-left text-xs">{{ order.total }}</td>
                                <td class="p-1 text-left text-xs">{{ order.advance }}</td>
                                <td class="p-1 text-left text-xs">{{ order.due }}</td>
                                <td class="p-1 text-left text-xs">{{ order.status.name }}</td>
                                <td class="p-1 text-xs grid text-center justify-items-center">
                                    <div class="flex">
                                        <NuxtLink class="bg-cyan-400 p-1 text-white rounded" :to="`/order/details/${order.id}`">
                                            <Icon name="mdi:eye" width="1.4em" height="1.4em"/>
                                        </NuxtLink>
                                        <NuxtLink class="p-1 text-white rounded bg-red-500 ml-1" :to="`/order/print/${order.id}`">
                                            <Icon name="material-symbols:print-rounded" width="1.4em" height="1.4em"/>
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="order_title text-sm flex justify-between h-full">
                    <div class="mt-[2px] ml-3">
                        <InputGroup>
                            <input type="number" v-model="pageNumber" class="border border-r-0 p-1 focus:outline-none" placeholder="Page Number"/>
                            <Icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer" @click="paginate(pageNumber)" name="nonicons:go-16" color="#000"/>
                        </InputGroup>
                    </div>
                    <div class="flex -mt-1 h-dvh">
                        <a v-for="(page, index) in coreofOrders?.links" :key="index" @click="paginate(page.label)" v-html="page.label" :class="{'border-t-4 px-2 border-red-500 text-red-500': page.active == pageNumber}" class="px-2 pt-2 mt-1 block text-black" href="#"/>
                    </div>
                </div>
            </div>

            <Sidebar v-model:visible="visibleRight" header="Transaction Filter" position="right">
                <div class="w-full">
                    <label for="dd-city" class="text-sm w-full">Name</label>
                    <input type="text" v-model="searchQuery" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Enter Name"/>
                </div>
                <!-- Date Range-->
                <div class="w-full mt-2">
                    <label for="dd-city" class="text-sm w-full">Date Range</label>
                    <div>
                        <Calendar :pt="{input: {class: 'px-4 py-1 border',},}" class="w-[48%] mr-1 text-sm outline-none focus:border-red-200 rounded-md" v-model="startDate" placeholder="Start Date"/>
                        <Calendar :pt="{ input: {class: 'px-4 py-1 border',},}" class="w-1/2 text-sm outline-none focus:border-red-200 rounded-md" v-model="endDate" placeholder="End Date"/>
                    </div>
                </div>

                <!-- Status & Vendor-->
                <div class="w-full grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <label for="dd-city" class="text-sm w-full">Vendor</label>
                        <Dropdown v-model="selectedVendor" :options="vendor" optionLabel="name" optionValue="id" filter placeholder="Select a Vendor" class="w-full md:w-14rem">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <div>
                                        {{ getVendorName(slotProps.value) }}
                                    </div>
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

                <div class="font-semibold flex mt-2 place-content-end">
                    <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm rounded-md" @click="fetchFilteredOrders">
                        <Icon name="fluent:search-12-filled"></Icon> Search
                    </button>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                    <span v-if="totalOrders">Showing {{ totalOrders }} results</span>
                    <span v-else>No results found</span>
                </div>
            </Sidebar>
        </div>
    </NuxtLayout>
</template>

<style>
span.p-dropdown-label.p-inputtext.p-placeholder {
  padding: 0px;
  margin: 0px;
}
span.p-dropdown-label.p-inputtext {
  padding: 0px;
  font-size: 15px;
  font-weight: 500;
  color: #767676d1;
}
</style>
