<script setup>
    import InputGroup from 'primevue/inputgroup';
    import InputGroupAddon from 'primevue/inputgroupaddon';
    import Sidebar from 'primevue/sidebar';
    import { useDataDate } from '~/composables/useDataDate';

    const { dateMonthFunction } = useDataDate();
    const router = useRouter();
    definePageMeta({
        layout: "dashboard",
        middleware: "auth",
    })

    // replace with actual API endpoint and master key
    const config = useRuntimeConfig();
    const EndPoint = config.public.baseURl;
    const MasterKey = config.public.masterToken;
    const app_token = useTokenStore().getToken;

    const headers = ref({
        "Accept": "application/json",
        "Authorization": `Bearer ${app_token}`,
        "App-Master-Key" : `${MasterKey}`
    })

    const roles = ref({});
    const loading = ref('success');
    const pageNumber = ref(1)


    onMounted(async () => {

        loading.value = "not";

        try {
            const resp = await $fetch(`${EndPoint}/admin/${MasterKey}/role?orderBy=ASC&limit_per_page=10`,
                {
                    method: 'get',
                    headers: headers.value,
                }
            )

            loading.value = "success";
            roles.value = resp

        } catch (err) {
            console.log(err)
        }

    })



    const paginate = async (page) => {
        loading.value = "not";
        

        pageNumber.value = page;

        if(page == "&laquo; Previous"){

            pageNumber.value  = ((roles.value.current_page-1) == 0 ? 1 : (roles.value.current_page-1));

        }else if( page == 'Next &raquo;'){

            pageNumber.value  = ((roles.value.current_page+1) >= roles.value.last_page ? roles.value.last_page : (roles.value.current_page+1));
            
        }
            
        try {
                
            roles.value = await $fetch(`${EndPoint}/admin/${MasterKey}/role?orderBy=ASC&limit_per_page=10&page=${pageNumber.value}`,
                    {
                        method: 'get',
                        headers: headers.value,
                    }
                );
            }

    

        catch (error) {
            console.log(error);
        }

        loading.value = "success";
    }


</script>
<template>
        <NuxtLayout :name="layout">
            <div class="w-full px-3 mt-1">
                <div v-if="loading !== 'success'" class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                    <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
                </div>

                <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                    <div class="flex w-full justify-between bg-gray-400 text-white">
                        
                        <div class="font-semibold mt-1 ml-3">Roles</div>
                        <div class="font-semibold ml-1 flex">
                            <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                                <Icon name="gg:arrow-left-o"></Icon>
                                Back
                            </button>
                            <NuxtLink to="permission/create" class="bg-cyan-600 hover:bg-cyan-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-rt-sm">
                                <Icon name="zondicons:add-outline"></Icon>
                                Add
                            </NuxtLink>
                        </div>
                        
                    </div>

                    <!-- Table list goes here -->
                    <div class=" h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
                        <table class="table-fixed w-full">
                            <thead>
                                <tr class="w-full bg-gray-300 text-sm">
                                    <th class="p-1 text-left text-sm w-8">SL</th>
                                    <th class="p-1 text-left text-sm">Name</th>
                                    <th class="p-1 text-left">Status</th>
                                    <th class="p-1 text-left">Created Date</th>
                                    <th class="p-1 text-left">Updated Date</th>
                                    <th class="p-1 text-center w-24">...</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-white odd:bg-gray-100" v-for="(role, index) in roles.data" :key="index">
                                    <td class="p-1 text-center text-xs">
                                        {{ roles.current_page > 1 ? (((roles.total) - ((roles.current_page-1)*roles.per_page))-index) : ((roles.total) - index) }}
                                    </td>
                                    <td class="p-1 text-left text-xs">{{ role.name }}</td>
                                    <td class="p-1 text-left text-xs">
                                        <template v-if="role.status == 1">
                                            Active
                                        </template>
                                        <template v-else-if="role.status == 2">
                                            ---
                                        </template>
                                        <template v-else>
                                            Inactive
                                        </template>
                                    </td>
                                    <td class="p-1 text-left text-xs">{{ dateMonthFunction(role.created_at) }}</td>
                                    <td class="p-1 text-left text-xs">{{ dateMonthFunction(role.updated_at) }}</td>
                                    <td class="p-1 text-center text-xs flex">
                                        <NuxtLink :to="`/permission/${role.id}/edit`" class="rounded-md mx-1 bg-yellow-500 p-1 text-white" title="Edit">
                                            <Icon name="subway:pencil" width="1.4em" height="1.4em" />
                                        </NuxtLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="order_title text-sm flex justify-between h-full ">
                        <div class="mt-[2px] ml-3 ">
                            <InputGroup>
                                <input type="number" v-model="pageNumber" class="border border-r-0 p-1 focus:outline-none" placeholder="Pagen Number" />
                                <icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer" @click="paginate(pageNumber)" name="nonicons:go-16" color="#000" />
                            </InputGroup>
                        </div>
                        <div class="flex -mt-1 h-dvh">
                            <a v-for="(role, index) in  roles?.links" :key="index" @click="paginate(role.label)" v-html="role.label" :class="{'border-t-4 px-2 border-red-500 text-red-500':role.active }" class="px-2 pt-2 mt-1 block text-black"  href="#"/>
                        </div>
                    </div>
                </div>

                
            </div>
        </NuxtLayout>

</template>