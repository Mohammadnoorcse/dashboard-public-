<script setup>
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
const route = useRoute();
const user_id = route.params.id;
const country = ref([]);
const selectedCountry = ref(null); // Holds the selected role ID
const name = ref('');
const email = ref('');

const extraFields = ref([]);
const extraProps = ref([]);

// Add extra field function goes here
const addMoreField = () => {
    extraFields.value = [
        ...extraFields.value, {
            field_name: "",
            value: "",
        }
    ];
}

// Remove extra field
const removeMoreField = (index) => {
    extraFields.value.splice(index, 1);
}

onMounted(async () => {
    // Fetch all roles
    await getAllStatus();
    // Fetch all countries
    await getAllCountry();
    // Fetch user details
    await getUser();
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

const updateCustomerInfo = async () => {
    try {
        extraFields.value.forEach((item, index) => {
            extraProps.value = { ...extraProps.value, [item.field_name]: item.value };
        });
        loading.value = "not";
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/user/${user_id}`, {
            method: 'POST',
            headers: headers.value,
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                role_id: selectedRoles.value,
                country_id: selectedCountry.value,
                extend_props: extraProps.value,

            }),
        });
        
    } catch (error) {
        console.error('Error updating User:', error);
    }
    router.push('/users');
    loading.value = "success";
}
</script>
<template>
    <NuxtLayout :name="layout">
        <div v-if="visibleAllow(4,3)" class="w-full px-3 mt-1">
            <div v-if="loading !== 'success' " class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                    <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
            </div>
            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between bg-gray-400 text-white">                           
                    <div class="font-semibold mt-1 ml-3">Update User</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>
                </div>
                <div class="h-full overflow-y-auto w-full max-h-[calc(100vh-8.2rem)] flex flex-col bg-gray-100">
                    <div class="flex justify-center items-center w-full">
                        <form class="w-1/2" @submit.prevent="updateCustomerInfo" enctype="multipart/form-data">
                            <div class="grid grid-cols-2 gap-2 mt-4 p-4 rounded-md">
                                <div>
                                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                                    <input v-model="name" type="text" name="name" id="name" autocomplete="name" class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                </div>
                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                    <input v-model="email" type="email" name="email" id="email" autocomplete="email" class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                </div>
                                <div>
                                    <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                                    <Dropdown v-model="selectedRoles" :options="roles" optionLabel="name" optionValue="id" filter placeholder="Select a User Type" class="w-full md:w-14rem p-2 mt-1">
                                        <template #value="slotProps">
                                            <div v-if="slotProps.value" class="flex align-items-center">
                                                <div>{{ getRolesName(slotProps.value) }}</div>
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
                                    <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                                    <Dropdown v-model="selectedCountry" :options="country" optionLabel="name" optionValue="id" filter placeholder="Select a User Type" class="w-full md:w-14rem p-2 mt-1">
                                        <template #value="slotProps">
                                            <div v-if="slotProps.value" class="flex align-items-center">
                                                <div>{{ getCountryName(slotProps.value) }}</div>
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
                            <div class="grid grid-col gap-2 mt-2 mb-20 p-4">
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
                                                @click="addMoreField">Add More <Icon
                                                    name="mdi:table-add" width="1.4em" height="1.4em">
                                                </Icon>
                                            </div>

                                        </div>
                                    </template>

                                    <div class="flex flex-row gap-2 w-full px-1 py-1 pb-7"
                                        v-for="(extra, index) in extraFields" :key="index">
                                        <div class="w-full flex flex-col gap-1">
                                            <div class="flex justify-center items-center">
                                                <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname">Field Name <Icon name="clarity:info-solid"></Icon></label>
                                            </div>
                                            <input type="text" v-model="extra.field_name" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name" />
                                        </div>

                                        <div class="w-full">
                                            <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                            <input type="text" v-model="extra.value" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value" />
                                        </div>
                                        <div class="bg-red-500 w-8 h-8 mt-5 p-2 rounded-md  cursor-pointer flex justify-center items-center " @click="removeMoreField(index)">
                                            <Icon class="text-white text-center" name="humbleicons:times"></Icon>
                                        </div>
                                    </div>
                                </Fieldset>
                        </div>
                            <div class="fixed bottom-9 w-[13.5%]">
                                <button type="submit" class="rounded-bl-md bg-cyan-600 hover:font-semibold hover:bg-cyan-500 text-gray-100 hover:text-black w-full px-4 py-2">
                                    Update <Icon name="fa6-solid:paper-plane"/>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </NuxtLayout>
</template>