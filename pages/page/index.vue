<script setup>
import InputGroup from "primevue/inputgroup";
import Sidebar from 'primevue/sidebar';
import Dialog from 'primevue/dialog';
import Dropdown from "primevue/dropdown";
import { ref } from "vue";

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;

const loading = ref('not')
const pages = ref([])
const pageNumber = ref(1)
const visibleRight = ref(false);
const searchQuery = ref('');
const fieldName = ref('');
const fieldValue = ref('');
const status = ref([]); // Holds the dropdown options for status
const layouts = ref([]); // Holds the dropdown options for layout
const selectedStatus = ref(null); // Holds the selected staus ID
const selectedLayout = ref(null); // Holds the selected layout ID
const deleteModalVisible = ref(false);
const deleteLoading = ref(false);
const selectedPageId = ref(null);
const filteredDataCount = ref(0);

const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
});

onMounted(async () => {

   getAllData();
   getAllStatus()
   getAllLayouts()

})

// get all value 
const getAllData = async()=>{
    loading.value = "not";
    try {
        pages.value = await $fetch(`${EndPoint}/admin/${MasterKey}/page?orderBy=desc&page=${pageNumber.value}&limit_per_page=10`,
            {
                method: 'get',
                headers: headers.value,
            }
        )

        loading.value = "success";
        console.log(pages.value);


    } catch (err) {
        console.log(err)
    }
    loading.value = "success";
}


const paginate = async (page) => {
    loading.value = "not";
    pageNumber.value = page;

    if (page == "&laquo; Previous") {

        pageNumber.value = ((pages.value.current_page - 1) == 0 ? 1 : (pages.value.current_page - 1));

    } else if (page == 'Next &raquo;') {

        pageNumber.value = ((pages.value.current_page + 1) == pages.value.last_page ? pages.value.last_page : (pages.value.current_page + 1));

    }

    try {

        pages.value = await $fetch(`${EndPoint}/admin/${MasterKey}/page?orderBy=desc&limit_per_page=10&page=${pageNumber.value}`,
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

const getAllStatus = async () => {
    try {
        status.value = [
            { id: "", name: 'All' },
            { id: "1", name: 'Active' },
            { id: "0", name: 'Inactive' }
        ];
    } catch (error) {
        console.error('Error fetching Status:', error);
    }
}
// Utility function to get the name of the selected status
const getStatusName = (id) => {
    const selected = status.value.find((item) => item.id == id);
    return selected ? selected.name : '';
};

const getAllLayouts = async () => {
    try {
        layouts.value = [
            { id: "", name: 'All' },
            { id: "1", name: 'Layout' },
            { id: "0", name: 'None' }
        ];
    } catch (error) {
        console.error('Error fetching Status:', error);
    }
}
const getLayoutsName = (id) => {
    const selected = layouts.value.find((item) => item.id == id);
    return selected ? selected.name : '';
};


const applyFilter = async () => {
    loading.value = "not";
    try {
        const params = {
            name: searchQuery.value || undefined,
            field_name: fieldName.value || undefined,
            value: fieldValue.value || undefined,
            status: selectedStatus.value || undefined,
            layout: selectedLayout.value || undefined,
        }
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        )
        pages.value = await $fetch(`${EndPoint}/admin/${MasterKey}/page?orderBy=desc&limit_per_page=10&page=${pageNumber.value}`,
            {
                method: 'get',
                headers: headers.value,
                params: filteredParams,
            }
        );
        filteredDataCount.value = pages.value.total;
    }

    catch (error) {
        console.log(error);
    }

    loading.value = "success";
}



//Delete Handler
const deleteHandler = async () => {
    loading.value = "not";
    deleteLoading.value = true;
    try {
        const res = await $fetch(`${EndPoint}/admin/${MasterKey}/page/${selectedPageId.value}`, {
            method: 'DELETE',
            headers: headers.value,

        })
        deleteLoading.value = false;
        deleteModalVisible.value = false;

        if(res){
            getAllData();
        }

    } catch (err) {
        console.log(err)
    }
    loading.value = "success";
}

// Open the delete modal for the specific page
const openDeleteModal = (pageId) => {
  selectedPageId.value = pageId;
  deleteModalVisible.value = true;
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
                    <div class="font-semibold mt-1 ml-3">Page List</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()"
                            class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>

                        <button
                            class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm"
                            @click="visibleRight = true">
                            <Icon name="iconoir:filter-solid"></Icon>
                            Filter
                        </button>
                        <NuxtLink to="page/create"
                            class="bg-cyan-600 hover:bg-cyan-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-rt-sm">
                            <Icon name="zondicons:add-outline"></Icon>
                            Add
                        </NuxtLink>
                    </div>
                </div>

                <!-- Table list goes here -->
                <div class="h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
                    <table class="w-full table-auto">
                        <thead>
                            <tr class="w-full bg-gray-300 text-sm">
                                <th class="p-1 text-center text-sm">SL</th>
                                <th class="p-1 text-left text-sm">Name</th>
                                <th class="p-1 text-left text-sm">Slug</th>
                                <th class="p-1 text-left text-sm">Field_Name</th>
                                <th class="p-1 text-left text-sm">Field_Value</th>
                                <th class="p-1 text-left text-sm">Layout</th>
                                <th class="p-1 text-left">Status</th>
                                <th class="p-1 text-center w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(page, index) in pages?.data" class="bg-white odd:bg-gray-100" :key="page.id">
                                <td class="p-1 text-center text-xs">{{ page.id }}</td>
                                <td class="p-1 text-left text-xs">{{ page.name }}</td>
                                <td class="p-1 text-left text-xs">{{ page.slug }}</td>

                                <td class="p-1 text-left text-xs">
                                    <div v-if="page?.extend_props?.length">
                                        <div v-for="(item, index) in page?.extend_props" :key="index" class="flex gap-2">
                                            <span>{{ item?.field_name }}</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <span class="text-gray-500">---</span>
                                    </div>
                                </td>

                                <td class="p-1 text-left text-xs">
                                    <div v-if="page?.extend_props?.length">
                                        <div v-for="(item, index) in page?.extend_props" :key="index" class="flex gap-2">
                                            <span>{{ item?.value }}</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <span class="text-gray-500">---</span>
                                    </div>
                                </td>

                                <td class="p-1 text-xs">{{ page.layout === 1 ? 'Default' : 'None'  }}</td>
                                <td class="p-1 text-xs">{{ page.status === 1 ? 'Active' : 'Inactive' }}</td>

                                <td class="p-1 text-center text-xs flex justify-center">
                                    <NuxtLink :to="`/page/${page.id}`" class="bg-yellow-500 px-2 py-1 m-1 text-white" title="Edit">
                                        <Icon name="subway:pencil" width="1em" height="1em" />
                                    </NuxtLink>
                                    <div @click="openDeleteModal(page.id)" class="rounded-s-sm bg-red-600 px-2 py-1 m-1 text-white cursor-pointer hover:text-[#553838]">
                                        <Icon name="streamline:recycle-bin-2" width="1em" height="1em" />
                                    </div>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="order_title text-sm flex justify-between h-full">
                    <div class="mt-[2px] ml-3">
                        <InputGroup>
                            <input type="number" v-model="pageNumber" class="border border-r-0 p-1 focus:outline-none"
                                placeholder="Pagen Number" />
                            <icon class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer"
                                @click="paginate(pageNumber)" name="nonicons:go-16" color="#000" />
                        </InputGroup>
                    </div>
                    <div class="flex -mt-1 h-dvh">
                        <a v-for="(page, index) in pages?.links" :key="index" @click="paginate(page.label)" v-html="page.label" :class="{ 'border-t-4 px-2 border-red-500 text-red-500': page.active }" class="px-2 pt-2 mt-1 block text-black" href="#" />
                    </div>
                </div>
                <Sidebar v-model:visible="visibleRight" header="Slide Filter" position="right">
                    <div class="w-full">
                        <label for="searchQuery" class="text-sm w-full">Page Name</label>
                        <input type="text" v-model="searchQuery"
                        class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                        placeholder="Page Name" />
                    </div>
                    <!-- Status-->
                    <div class="w-full grid grid-cols-1 gap-2 mt-2">
                        <div>
                            <label for="dd-city" class="text-sm w-full">Status</label>
                            <Dropdown v-model="selectedStatus" :options="status" optionLabel="name" optionValue="id" filter placeholder="Select a Status" class="w-full md:w-14rem">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex align-items-center">
                                        <div>{{ getStatusName(slotProps.value) }}</div>
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
                        <button
                        class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm rounded-md"
                        @click="applyFilter">
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
            </div>

            <!-- Delete Modal -->
            <Dialog v-model:visible="deleteModalVisible" modal header="Delete Slide" :style="{ width: '25rem' }">
            <span class="p-text-secondary flex items-center justify-center flex-col mb-5">
                <Icon name="material-symbols:delete-sweep-rounded" width="120px" height="120px" class="mr-2 text-red-500" />
                Are you sure you want to delete this slide?
            </span>
            <div class="flex justify-around">
                <Button class="bg-yellow-600 text-red-100 px-4 py-2" type="button" label="Cancel" severity="secondary"
                @click="deleteModalVisible = false"></Button>
                <Button class="bg-red-600 text-red-100 px-4 py-2" type="button" label="Delete" @click="deleteHandler"
                :loading="deleteLoading"></Button>
            </div>
            </Dialog>

        </div>
    </NuxtLayout>
</template>

<style scoped>
span.p-dropdown-label.p-inputtext.p-placeholder {
    padding: 2px;
}
</style>