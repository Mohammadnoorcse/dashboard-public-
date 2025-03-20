<script setup>
const route = useRoute();
const user_id = route.params.id;
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

const router = useRouter();
const roles = ref([]);
const selectedRoles = ref(null); // Holds the selected role ID
const country = ref([]);
const selectedCountry = ref(null); // Holds the selected role ID
const name = ref('');
const email = ref('');
const id = ref('')
const extraFields = ref([]);

onMounted(() => {
    getAllStatus();
    getAllCountry();
    getAllOrder()
    getUser();
});

const getAllStatus = async () => {
    try {
        loading.value = "not";
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
        console.error('Error fetching Status:', error);
    }
    loading.value = "success";
}
// Utility function to get the name of the selected roles
const getRolesName = (id) => {
    const selected = roles.value.find(b => b.id === id);
    return selected ? selected.name : '';
};

const getAllCountry = async () => {
    try {
        loading.value = "not";
        const response = await $fetch(`${EndPoint}/countries?data=all`, {
            method: 'GET',
            headers: headers.value,
        });
        // Map API data to the required format
        country.value = response.map(b => ({
            name: b.name, // Dropdown label
            id: b.id, // Dropdown value
        }));
    } catch (error) {
        console.error('Error fetching Country:', error);
    }
    loading.value = "success";
}
const getCountryName = (id) => {
    const selected = country.value.find(b => b.id === id);
    return selected ? selected.name : '';
};

const getUser = async () => {
    try {
        loading.value = "not";
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/user/${user_id}`, {
            method: 'GET',
            headers: headers.value,
        });

        id.value = response.user_id
        name.value = response.name;
        email.value = response.email;
        selectedCountry.value = response.country_id;
        selectedRoles.value = response.role_id;
        extraFields.value = response.props;
        if (response.extend_props) {
            extraFields.value = Object.entries(response.extend_props).map(([key, value]) => ({
                field_name: key,
                value: value,
            }));
        }
    } catch (error) {
        console.error('Error fetching User:', error);
    }
    loading.value = "success";
}

const orders = ref([])
const totalPurchase = ref(0)
const getAllOrder = async() => {
    loading.value = "not"

    orders.value = await $fetch(`${EndPoint}/admin/${MasterKey}/orders?data=all&user_id=${user_id}`, {
        method: 'GET',
        headers: headers.value,
    });
    totalPurchase.value = orders.value.orders.length
}
</script>
<template>
    <NuxtLayout :name="layout">
        <div v-if="visibleAllow(4,1)" class="w-full px-3 mt-1">
            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between bg-gray-400 text-white">                           
                    <div class="font-semibold mt-1 ml-3">User Details</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>
                </div>
                <div class="h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3">
                    <div class="grid grid-cols-2 items-center mt-2">
                        <div>
                            <p class="text-gray-500">
                                Name: {{ name }}
                                <br />
                                Address: {{ extraFields.find(field => field.field_name === "address")?.value || "N/A" }}
                            </p>
                            <p class="text-gray-500">
                                Email: {{ email }}
                                <br />
                                Mobile: {{ extraFields.find(field => field.field_name === "mobile")?.value || "N/A" }}
                            </p>

                        </div>
                        <div class="text-right">
                            <p class="text-gray-500">
                                Total Orders: {{ totalPurchase }}
                            </p>
                        </div>
                    </div>
                    <table class="w-full table-auto mt-2">
                        <thead class="border-b border-gray-400 bg-gray-100 text-gray-900 ">
                            <tr class="w-full bg-gray-300 text-sm">
                                <th class="p-1 text-left text-sm w-8 pl-6">SL</th>
                                <th class="p-1 text-left text-sm">Items</th>
                                <th class="p-1 text-left text-sm">Quantity</th>
                                <th class="p-1 text-left text-sm">Price</th>
                                <th class="p-1 text-left text-sm">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in orders.orders" :key="index" class="border-b border-gray-200">
                                <td class="p-1 text-left text-xs pl-6"> {{ index + 1}} </td>
                                <td class="p-1 text-left text-xs pl-6"> {{ item.order_items[0].item_name }} </td>
                                <td class="p-1 text-left text-xs pl-6"> {{ item.order_items[0].quantity }} </td>
                                <td class="p-1 text-left text-xs pl-6"> {{ item.order_items[0].current_price }} </td>
                                <td class="p-1 text-left text-xs pl-6"> {{ item.order_items[0].grand_total }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </NuxtLayout>
</template>