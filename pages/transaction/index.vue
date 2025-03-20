<script setup>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Sidebar from 'primevue/sidebar';

const { dateMonthFunction, dateFunction } = useDataDate();
const visibleRight = ref(false);

const transaction = ref(null)
const pageNumber = ref(1)
const coreTranstion = ref(null)

const universalQuery = ref("")
const trasactionQuery = ref("");
const orderIDQuery = ref("");
const fromDateQuery = ref("")
const toDateQuery = ref("")

const loading = ref('not')

const test = ref()
// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;

const headers = ref({
"Accept": "application/json",
"Authorization": `Bearer ${app_token}`,
"App-Master-Key": `${MasterKey}`
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

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
})

onMounted( async () => {
    loading.value = "not";
    try {

        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/transaction?orderBy=desc&page=1`, {
        method: 'get',
        headers: headers.value,
        });
        coreTranstion.value = response.trasactions.links
        transaction.value = response.trasactions
        
        console.log("response.trasactions:",response.trasactions)

    } catch (error) {
        console.log(error);
    }
    loading.value = "success";

}

)

const paginate = async (page) => {
    loading.value = "not";

    

    if(page === "&laquo; Previous"){
        pageNumber.value  = ((transaction.value.current_page-1));

    }else if(page === "Next &raquo;"){

        pageNumber.value  = ((transaction.value.current_page+1));
        
    }else{
        pageNumber.value = page;
    }
    // console.log("Page Number:", pageNumber.value)

    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/transaction?page=${pageNumber.value}`, {
            method: 'get',
            headers: headers.value,
        });
        test.value = response.trasactions
        transaction.value = response.trasactions;
        coreTranstion.value = response.trasactions.links
        
    } catch (error) {
        console.log(error);
    }

    loading.value = "success";
}



const fetchFilteredTransaction = async () => {
    loading.value = "not"

    try {
        // console.log(dateFunction(fromDateQuery.value))
        console.log(toDateQuery.value)

        const fromDateParams = fromDateQuery.value ? fromDateQuery.value.toISOString().split('T')[0] : '';
        const toDateParams = toDateQuery.value ? toDateQuery.value.toISOString().split('T')[0] : '';
        const dateRange = fromDateParams && toDateParams ? `${fromDateParams},${toDateParams}` : undefined;

        const params = {
            name: universalQuery.value,
            and_transaction_id: trasactionQuery.value || undefined,
            and_order_id: orderIDQuery.value || undefined,
            and_between_transaction_date: dateRange
        }

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        );

        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/transaction?`,{
            method: "GET",
            headers: headers.value,
            params: filteredParams
        })
        console.log(response)

        transaction.value = response.trasactions;

        loading.value = "success";
    } catch (error) {
        console.log(error)
    }
}

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
                        
                        <div class="font-semibold mt-1 ml-3">Transaction</div>
                        <div class="font-semibold ml-1 flex">

                            <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                                <Icon name="gg:arrow-left-o"></Icon>
                                Back
                            </button>

                            <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform  hover:text-black px-4 py-1 text-sm px-4 py-2" @click="visibleRight = true">
                                <Icon name="iconoir:filter-solid"></Icon>
                                Filter
                            </button>
                            
                        </div>
                        
                    </div>

                    <!-- Table list goes here -->
                    <div class=" h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
                        <table class=" w-full table-auto">
                            <thead>
                                <tr class="w-full bg-gray-300 text-sm" >
                                    <th class="p-1 text-left text-sm w-8">SL</th>
                                    <th class="p-1 text-left text-sm">Order Id</th>
                                    <th class="p-1 text-left text-sm">Transaction Id</th>
                                    <th class="p-1 text-left text-sm">Payment Method</th>
                                    <th class="p-1 text-left text-sm">Debit</th>
                                    <th class="p-1 text-left text-sm">Credit</th>
                                    <th class="p-1 text-left text-sm">Total</th>
                                    <th class="p-1 text-center text-sm">Date</th>
                                    <th class="p-1 text-center w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="transac in transaction?.data" class="bg-white odd:bg-gray-100" :key="transac.id">
                                    <td class="p-1 text-center text-xs">{{ transac.id }}</td>
                                    <td class="p-1 text-left text-xs">{{ transac.order_id }}</td>
                                    <td class="p-1 text-left text-xs">{{ transac.transaction_id }}</td>
                                    <td class="p-1 text-left text-xs">{{ transac.payment_method }}</td>
                                    <td class="p-1 text-left text-xs">{{ transac.debit }}</td>
                                    <td class="p-1 text-left text-xs">{{ transac.credit }}</td>
                                    <td class="p-1 text-left text-xs">{{ transac.total_amount }}</td>
                                    <td class="p-1 text-center text-xs">{{dateMonthFunction(transac.updated_at)}}</td>
                                    <td class="p-1 text-xs  text-center">
                                        <NuxtLink v-if="visibleAllow(15, 1)" class="text-right" :to="`/transaction/details/${transac.user_id}`">
                                            <Icon name="mdi:eye" width="1.4em" height="1.4em"/>
                                        </NuxtLink>
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
                            <a v-for="(page, index) in coreTranstion" :key="index" @click="paginate(page.label)" v-html="page.label" :class="{'border-t-4 px-2 border-red-500 text-red-500': page.active}" class="px-2 pt-2 mt-1 block text-black" href="#" />
                        </div>

                    </div>
                </div>

                <Sidebar v-model:visible="visibleRight" header="Transaction Filter" position="right">
                    
                    <div class="w-full">
                        <label for="dd-city" class="text-sm w-full">All</label>
                        <input type="text" v-model="universalQuery" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="All"/>
                    </div>

                    <div class="w-full">
                        <label for="dd-city" class="text-sm w-full">Transaction Id</label>
                        <input type="text" v-model="trasactionQuery" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Transaction Id"/>
                    </div>

                    <div class="w-full">
                        <label for="dd-city" class="text-sm w-full">Order Id</label>
                        <input type="text" v-model="orderIDQuery" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Order Id"/>
                    </div>

                    <div class="w-full mt-2">
                        <label for="dd-city" class="text-sm w-full">Date Range</label>
                        <div>
                            <Calendar :pt="{input: {class: 'px-4 py-1 border',},}" class="w-[48%] mr-1 text-sm outline-none focus:border-red-200 rounded-md" v-model="fromDateQuery" placeholder="Start Date"/>
                            <Calendar :pt="{input: { class: 'px-4 py-1 border',},}" class="w-1/2 text-sm outline-none focus:border-red-200 rounded-md" v-model="toDateQuery" placeholder="End Date"/>
                        </div>
                    </div>


                    <div class="font-semibold flex mt-2 place-content-end">
                        

                        <button class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform  hover:text-black px-4 py-1 text-sm rounded-md" @click="fetchFilteredTransaction">
                            <Icon name="fluent:search-12-filled"></Icon>
                            Search
                        </button>
                        
                    </div>



                </Sidebar>
            </div>
        </NuxtLayout>
</template>