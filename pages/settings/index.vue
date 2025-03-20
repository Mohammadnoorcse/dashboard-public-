<script setup>
    
import { ref } from "vue";
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Fieldset from 'primevue/fieldset';

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;

const updateId = ref(null)
const Namefield = ref(null)
// const Valuefield = ref(null)
const filedGroup = ref(null)
const web_settings = ref([])
const pageNumber = ref(1)
const loading = ref('not')

const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
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

onMounted(async () => {
    getData()
});
const extraProps = ref({
    field_name: "",
    value: "",
    group: ""
});

const sendextraPropsData = async () => {

    try {
        let url;
        if (updateId.value != null){
            url = "web_settings/"+updateId.value
        }else{
            url = "web_settings"
        }
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/${url}`, {
            method: 'post',
            headers: headers.value,
            body: JSON.stringify(extraProps.value),
        });
        extraProps.value = {
        field_name: "",
        value: "",
        group: ""
    };
        console.log("ExtraProps:",extraProps.value.field_name)
        console.log("Response:",response)
    } catch (err) {
        console.log(err);
    }
};

const dataSubmit = () => {
    sendextraPropsData();
    getData()
}

const getData = async () => {
    try {
        web_settings.value = await $fetch(`${EndPoint}/admin/${MasterKey}/web_settings?limit_per_page=10`, {
            method: 'get',
            headers: headers.value,
        });

        loading.value = "success";
        console.log("Web data:",web_settings.value);
    } catch (err) {
        console.log(err);
    }
}

const paginate = async (page) => {
    loading.value = "not";
    pageNumber.value = page;

    if (page === "&laquo; Previous") {
        pageNumber.value = (web_settings.value.current_page-1);
    } else if (page === "Next &raquo;") {
        pageNumber.value = (web_settings.value.current_page+1)
    }

    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/web_settings?limit_per_page=10&page=${pageNumber.value}`, {
            method: 'get',
            headers: headers.value,
        });
        web_settings.value = response;
        // console.log("Current Page:",web_settings.value.current_page);
        // web_settings.value = response.web_settings.data;
    } catch (error) {
        console.log(error);
    }

    loading.value = "success";
}

const editField = async (id) => {
    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/web_settings/${id}`, {
            method: 'get',
            headers: headers.value,
        });

        if (response && response.data) {
            updateId.value = response.data.id;
            extraProps.value = {
                field_name: response.data.field_name,
                value: response.data.value,
                group: response.data.group
            };
            console.log("ExtraField:", extraProps.value);
        }

        console.log("Edit Function", response);
    } catch (err) {
        console.log(err);
    }
}

const deleteData = async (id) => {
    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/web_settings/${id}`, {
            method: "DELETE",
            headers: headers.value,
            // body: { _method: 'delete' },
        });
        console.log(id)
        console.log("Delete", response)
    } catch (err) {
        console.log(err);
    }
}

const nameFieldFunc = async (n) => {
    const fieldMapping = {
        field_name: Namefield,
        // value: Valuefield,
        group: filedGroup,
    };

    // Dynamically update the corresponding field
    if (fieldMapping[n.target.name]) {
        fieldMapping[n.target.name].value = n.target.value || null;
    }

    console.log("Name:", Namefield.value);
    // console.log("Value:", Valuefield.value);
    console.log("Group:", filedGroup.value);

    // Construct URL dynamically
    let url = `${EndPoint}/admin/${MasterKey}/web_settings?limit_per_page=10`;
    const params = {
        field_name: Namefield.value,
        // value: Valuefield.value,
        group: filedGroup.value,
    };

    // Add parameters to the URL if they exist
    Object.entries(params).forEach(([key, val]) => {
        if (val) url += `&${key}=${val}`;
    });

    try {
        web_settings.value = await $fetch(url, {
            method: 'GET',
            headers: headers.value,
        });
        loading.value = "success";
    } catch (err) {
        console.error(err);
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
                <div class="flex w-full justify-between  bg-gray-400 text-white">
                    <div class="font-semibold mt-1 ml-3">Add Settings</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-tr-sm">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>
                </div>

                <div class="w-full flex justify-center">
                    <div class="w-9/12 justify-center">
                        <div class="w-full mt-2 justify-center">
                            <Fieldset v-if="visibleAllow(18,2)" legend="Extra Props" :pt="{ root: {class: 'border p-2'},legend:{class: 'p-0 m-0'}, togglerIcon:{}}">
                                <template #legend>
                                    <div class="flex align-items-center pl-2">
                                        <span class="font-bold">Web Settings Information</span>
                                    </div>
                                </template>
                                <div  class="flex w-full py-1 justify-center">
                                    <div class="max-w-full mr-2">
                                        <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname"> Field Name <Icon name="clarity:info-solid"></Icon></label>
                                        <input type="text" @keyup="((e) => nameFieldFunc(e))" name="field_name" v-model="extraProps.field_name" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                    </div>
                                    <div class="max-w-full mr-2">
                                        <label for="dd-citye" class="text-sm w-full" title="Use value like: number, base64, url, email etc"> Field Value<Icon name="clarity:info-solid"></Icon></label>
                                        <input type="text" @keyup="((e) => nameFieldFunc(e))" name="value" v-model="extraProps.value" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                        <a target="_blank" class="text-xs text-red-500" href="https://www.base64-image.de/">Convert Image into base64</a>
                                    </div>
                                    <div class="max-w-full mr-2">
                                        <label for="dd-citye" class="text-sm w-full" title="Use group like: number, string"> Field Group <Icon name="clarity:info-solid"></Icon></label>
                                        <input type="text" @keyup="((e) => nameFieldFunc(e))" name="group" v-model="extraProps.group" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Group"/>
                                    </div>
                                    <div class="max-w-full mt-1">
                                        <button class="bg-green-500 font-semibold text-sm text-white py-1 rounded-md px-4 mt-5" type="submit" @click="dataSubmit">Add <Icon name="fa-solid:paper-plane"></Icon></button>
                                    </div>
                                </div>
                            </Fieldset>
                        </div>

                        <!-- Table Content -->
                        <div class="w-full mt-8 h-[calc(100vh-22.8rem)] overflow-y-auto">
                            <table class="w-full table-auto">
                                <thead>
                                    <tr class="w-full bg-gray-300 text-sm">
                                        <th class="p-1 text-left text-sm pl-5">Field Name</th>
                                        <th class="p-1 text-left text-sm">Field Value</th>
                                        <th class="p-1 text-left text-sm">Field Group</th>
                                        <th class="p-1 text-center text-sm w-0">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-white odd:bg-gray-100" v-for="(data, index) in web_settings.data" :key="index">
                                        <td class="p-1 text-left text-xs pl-5">{{ data.field_name }}</td>
                                        <td class="p-1 text-left text-xs">{{ data.value.length > 25 ? data.value.substring(0, 25) + '...' : data.value }}</td>
                                        <td class="p-1 text-left text-xs">{{ data.group }}</td>                       
                                        <td class="p-1 text-xs grid text-center justify-items-center w-24">
                                            <div class="flex justify-center space-x-1">
                                                <Button v-if="visibleAllow(18,3)" class="bg-yellow-500 p-1 text-white rounded" @click="editField(data.id)">
                                                    <Icon name="subway:pencil" width="1.4em" height="1.4em"/> 
                                                </Button>
                                                <Button v-if="visibleAllow(18,4)" class="p-1 text-white rounded bg-red-500" @click="deleteData(data.id)">
                                                    <Icon name="material-symbols:delete" width="1.4em" height="1.4em"/>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination Content -->
                        <div class="text-sm flex justify-between mb-4 w-full bg-white p-2 border-t">
                            <div class="mt-[2px] ml-3">
                                <InputGroup>
                                    <input type="number" v-model="pageNumber" class="border border-r-0 p-1 focus:outline-none" placeholder="Page Number"/>
                                    <Icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer" @click="paginate(pageNumber)" name="nonicons:go-16" color="#000"/>
                                </InputGroup>
                            </div>
                            <div class="flex">
                                <a v-for="(page, index) in web_settings?.links" :key="index" @click="paginate(page.label)" v-html="page.label" :class="{'border-t-4 px-2 border-red-500 text-red-500': page.active}" class="px-2 pt-2 mt-1 block text-black" href="#"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>