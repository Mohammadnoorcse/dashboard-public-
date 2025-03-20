<script setup>
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Sidebar from "primevue/sidebar";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import { ref } from "vue";

const coreOfUsersData = ref([])
const name = ref('');
const email = ref('');
const filteredCustomers = ref(0);

const pageNumber = ref(1)
const customers = ref([]);
const visibleRight = ref(false);
const roles = ref([]); // Holds the dropdown options
const selectedRole = ref(null); // Holds the selected staus ID
const orderCounts = ref({}); // Store total orders per user
const customer_id = ref([]);

const {dateMonthFunction} = useDataDate();
// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;
const loading = ref('not')

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

const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})

definePageMeta({
  layout: "dashboard",
  middleware: 'auth',
});


onMounted(async () => {
    getAllCustomersData()
    // getAllCustomersID()
    getAllRoles()
});


// const fetchUserTotalOrders = async (id) => {
//     try {
//         const response = await $fetch(`${EndPoint}/admin/${MasterKey}/orders?user_id=${id}`, {
//             method: 'get',
//             headers: headers.value,
//         });
//         // console.log("Total Orders for User:", id, response.orders.total);
//         orderCounts.value[id] = response.orders.total; // Store count in reactive object
//     } catch (error) {
//         console.error('Error fetching user orders:', error);
//         orderCounts.value[id] = "Error";
//     }
// };

// const getAllCustomersID = async () => {
//     // loading.value = "not";
//     try {

//         const response = await $fetch(`${EndPoint}/admin/${MasterKey}/user?data=all`, {
//             method: 'get',
//             headers: headers.value,
//         });
//         customer_id.value = response;
//         customer_id.value.forEach(user => fetchUserTotalOrders(user.id));
//     } catch (err) {
//         console.log(err);
//     }
// }

const getAllCustomersData = async () => {
    loading.value = "not";

    try {
        // const params = {
        //     name: name.value || undefined,
        //     email: email.value || undefined,
        //     role_id: selectedRole.value || undefined,
        //     page: pageNumber.value || undefined,
        // };

        // // Remove keys with undefined values
        // const filteredParams = Object.fromEntries(
        //     Object.entries(params).filter(([_, value]) => value !== undefined)
        // );

        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/user?orderBy=desc&page=${pageNumber.value}`, {
            method: 'get',
            headers: headers.value,
            // params: filteredParams,
        });
        coreOfUsersData.value = response;
        console.log("Core",coreOfUsersData.value);
        customers.value = response.data;
        loading.value = "success";
    } catch (err) {
        console.log(err);
    }
    loading.value = "success";
}

const paginate = async (page) => {
    loading.value = "not";
    pageNumber.value = page;

    if (page === "&laquo; Previous") {
        pageNumber.value  = ((coreOfUsersData.value.current_page-1) == 0 ? 1 : (coreOfUsersData.value.current_page-1));
    } else if (page === "Next &raquo;") {
        pageNumber.value  = ((coreOfUsersData.value.current_page+1) == coreOfUsersData.value.last_page ? coreOfUsersData.value.last_page : (coreOfUsersData.value.current_page+1));
    }

    try {
        const params = {
            name: name.value || undefined,
            email: email.value || undefined,
            role_id: selectedRole.value || undefined,
            // page: pageNumber.value || undefined,
        };

        // Remove keys with undefined values
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        );
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/user?page=${pageNumber.value}`, {
            method: 'get',
            headers: headers.value,
            params: filteredParams,
        });
        customers.value = response;
        console.log("Response Customer:",response);
        customers.value = response.data;

    } catch (error) {
        console.log(error);
    }

    loading.value = "success";
}

const getAllRoles = async () => {
    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/roleAccess?`, {
            method: 'GET',
            headers: headers.value,
        });
        // Map API data to the required format
        roles.value = response.roles.map(b => ({
            name: b.name, // Dropdown label
            id: b.id, // Dropdown value
        }));
    } catch (error) {
        console.error('Error fetching:', error);
    }
}
        
// Utility function to get the name of the selected roles
const getRoleNames = (id) => {
    const selected = roles.value.find(b => b.id === id);
    return selected ? selected.name : '';
};


// Implemented the search functionality
const fetchFilteredOrders = async () => {
    loading.value = "not";
    try {
        // Create the parameters object and remove any null, undefined, or empty values
        const params = {
            name: name.value || undefined,
            email: email.value || undefined,
            role_id: selectedRole.value || undefined,
        };

        // Remove keys with undefined values
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        );

        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/user`, {
            method: 'get',
            headers: headers.value,
            params: filteredParams,
        });

        customers.value = response?.data || [];
        filteredCustomers.value = response?.total;
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
                <div class="font-semibold mt-1 ml-3">All Customers</div>
                <div class="font-semibold ml-1 flex">
                    <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                        <Icon name="gg:arrow-left-o"></Icon> Back
                    </button>
                    <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black text-sm px-4 py-2" @click="visibleRight = true">
                        <Icon name="iconoir:filter-solid"></Icon> Filter
                    </button>
                    <NuxtLink v-if="visibleAllow(4, 2)" to="users/create" class="bg-cyan-600 hover:bg-cyan-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-rt-sm" >
                            <Icon name="zondicons:add-outline"></Icon> Add
                    </NuxtLink>
                </div>
            </div>
            <!-- Table list goes here -->
            <div class="h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
                <table class="w-full table-auto">
                    <thead>
                        <tr class="w-full bg-gray-300 text-sm">
                            <th class="p-1 text-left text-sm w-8 pl-6">SL</th>
                            <th class="p-1 text-left text-sm">Name</th>
                            <th class="p-1 text-left text-sm">Mobile</th>
                            <th class="p-1 text-left text-sm">Email</th>
                            <!-- <th class="p-1 text-left text-sm">Mobile</th> -->
                            <th class="p-1 text-left text-sm">Address</th>
                            <th class="p-1 text-left text-sm">Register Date</th>
                            <th class="p-1 text-center text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user) in customers" class="bg-white odd:bg-gray-100" :key="user.id">
                            <td class="p-1 text-left text-xs pl-6"> {{ user.id }} </td>
                            <td class="p-1 text-left text-xs">{{ user.name }}</td>
                            <td class="p-1 text-left text-xs text-gray-500">{{ user?.extend_props?.mobile || ""  }}</td>
                            <td class="p-1 text-left text-xs">{{ user.email }}</td>
                            <!-- <td class="p-1 text-left text-xs">0123456789</td> -->
                            <td class="p-1 text-left text-xs text-gray-500">{{ user?.extend_props?.address || ""  }}</td>
                            <!-- <td class="p-1 text-left text-xs">{{ orderCounts[user.id] ?? "Loading..." }}</td> -->
                            <td class="p-1 text-left text-xs">{{ dateMonthFunction(user.created_at) }}</td>
                            <td class="p-1 text-xs flex justify-center">
                                <div v-if="visibleAllow(4, 1)" class="flex p-1">
                                    <NuxtLink  class="bg-cyan-400 p-1 text-white rounded" :to="`/users/details/${user.id}`">
                                        <Icon name="mdi:eye" width="1.4em" height="1.4em" />
                                    </NuxtLink>
                                </div>
                                <div v-if="visibleAllow(4, 3)" class="flex p-1">
                                    <NuxtLink class="bg-yellow-400 p-1 text-white rounded" :to="`/users/edit/${user.id}`">
                                        <Icon name="mdi:pencil" width="1.4em" height="1.4em" />
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
                        <input type="number" v-model="pageNumber" class="border border-r-0 p-1 focus:outline-none" placeholder="Page Number" />
                        <Icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer" @click="paginate(pageNumber)" name="nonicons:go-16" color="#000" />
                    </InputGroup>
                </div>
                <div class="flex -mt-1 h-dvh">
                <a v-for="(page, index) in coreOfUsersData?.links" :key="index" @click="paginate(page.label)" v-html="page.label" :class="{'border-t-4 px-2 border-red-500 text-red-500': page.label == pageNumber}" class="px-2 pt-2 mt-1 block text-black" href="#" />
                </div>
            </div>
            </div>
            <Sidebar v-model:visible="visibleRight" header="Filter Customer" position="right">
            <div class="w-full">
                <label for="dd-city" class="text-sm w-full">Name</label>
                <input type="text" v-model="name" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Enter Name" />
            </div>
            <div class="w-full mt-2">
                <label for="dd-city" class="text-sm w-full">Email</label>
                <input type="email" v-model="email" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Enter Email" />
            </div>
            <!-- Role -->
            <div class="w-full grid grid-cols-1 mt-2">
                <div>
                    <label for="dd-city" class="text-sm w-full">Roles</label>
                    <Dropdown v-model="selectedRole" :options="roles" optionLabel="name" optionValue="id" filter placeholder="Select a Role" class="w-full md:w-14rem">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex align-items-center">
                                <div>{{ getRoleNames(slotProps.value) }}</div>
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
                <span v-if="filteredCustomers">Total {{ filteredCustomers }} results</span>
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
