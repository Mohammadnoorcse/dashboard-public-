<script setup>
import Dropdown from 'primevue/dropdown';
import { ref } from 'vue';
    
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

const router = useRouter();
//Get Toast
const toast = useToast();

const opened = ref(false);
const checkboxSelected = ref(false);
const updatePermissions = ref([]);
const checkExitPermissions = ref([]);
const loading = ref("not");
const exits = ref(true);
const roles = ref([]);
const roleId = ref();
const roleAccess = ref([]);
const nodes = ref({});



onMounted(async () => {

    loading.value = "not";

    try {
        
        const roleAccess = await $fetch(`${EndPoint}/admin/${MasterKey}/roleAccess`,
            {
                method: 'get',
                headers: headers.value,
            }
        )

        loading.value = "success";
        nodes.value = roleAccess

        

    } catch (err) {
        console.log(err)
    }


    

})

// toggle function goes here for sub menu open
const toggle = (itemIndex) => {

    nodes.value.access[itemIndex] = {
        ...nodes.value.access[itemIndex],
        "opened" : !nodes.value.access[itemIndex].opened
    }

}


// Multiple checkbox function goes here for sub menu open
const multipleCheck = (itemId) => {

    let findData = nodes.value.access.findIndex((element) => element.id == itemId);

    nodes.value.access[findData].children.forEach((item, index) => {
        nodes.value.access[findData].children[index] = {
            ...nodes.value.access[findData].children[index],
            "checked" : !nodes.value.access[findData].children[index].checked
        }

    })

    

}



// Multiple checkbox function goes here for sub menu open
const singleCheck = (itemIndex, childeIndex, $event) => {


    nodes.value.access[itemIndex].children[childeIndex] = {
        ...nodes.value.access[itemIndex].children[childeIndex],
        "checked" : !nodes.value.access[itemIndex].children[childeIndex].checked
    }


    for (let i = 0; i < nodes.value.access[itemIndex].children.length; i++) {

        if(nodes.value.access[itemIndex].children[i].checked == false ){
            nodes.value.access[itemIndex] = {
                ...nodes.value.access[itemIndex],
                "indeterminate" : true
            }

            break;
        }else{
            nodes.value.access[itemIndex] = {
                ...nodes.value.access[itemIndex],
                "indeterminate" : false
            }

        }
    }

}



const checkRoles = async (e) => {

    loading.value = "not";

    const result = await $fetch(`${EndPoint}/admin/${MasterKey}/roleAccess/${e.value}`,
        {
            method: 'get',
            headers: headers.value, 
        }
    )
        
    checkExitPermissions.value = result.access

    console.table(checkExitPermissions.value);
    console.table(nodes.value.access);


    if(checkExitPermissions.value == ""){

        nodes.value.access.map((data, index) => {

            data.children.map((childData, childeIndex) => {
                    nodes.value.access[index].children[childeIndex].menu_id = {
                    ...nodes.value.access[index].children[childeIndex],
                    "checked" : false
                }

                
                    nodes.value.access[index] = {
                        ...nodes.value.access[index],
                        "indeterminate" : true
                    }
                
            })

        })

    }else{

        checkExitPermissions.value.map((data, index) => {

            let findData = nodes.value.access.findIndex((element) => element.id == data.menu_id);

            nodes.value.access[findData].children.forEach((item, index) => {
                nodes.value.access[findData].children[index] = {
                    ...nodes.value.access[findData].children[index],
                    "checked" : !nodes.value.access[findData].children[index].checked
                }

            })
        })
        
       
    }

    
    loading.value = "success";
}




// Update Function goes here

const updateRoles = async (e) => {

    loading.value = "not";

    let menus = [];
    for (let i = 0; i < nodes.value.access.length; i++) {

        for (let j = 0; j < nodes.value.access[i].children.length; j++) {

            if(nodes.value.access[i].children[j].checked) {
                let childId = nodes.value.access[i].children[j].action_id;

                menus[nodes.value.access[i].id] = {  ...menus[nodes.value.access[i].id], [childId] : childId }

            }

        }
    }

    updatePermissions.value = menus;

    const result = await $fetch(`${EndPoint}/admin/${MasterKey}/roleAccess/${roleId.value}`,
            {
                method: 'post',
                headers: headers.value,
                body: {
                    roles:updatePermissions.value,
                    exits : exits.value
                }
            }
           
        )


        if (result == "Success") {
            toast.add({
                severity: 'success',
                summary: 'Role Permission Update',
                detail: result.message || 'Role Permission Update successfully.',
                life: 2000,
            });


        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: result.message || 'An error occurred.',
                life: 2000,
            });
        }
        
        loading.value = "success";

}


</script>

<template>
    <NuxtLayout :name="layout">
            <div v-if="loading !== 'success' " class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
            </div>

            <form class="w-full px-3 mt-1" @submit.prevent="updateRoles">

                <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                    <div class="flex w-full justify-between bg-gray-400 text-white">
                        
                        <div class="font-semibold mt-1 ml-3">User Permission</div>
                        <div class="font-semibold ml-1 flex">
                            <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                                <Icon name="gg:arrow-left-o"></Icon>
                                Back
                            </button>
                        </div>
                        
                    </div>

                    <!-- Table list goes here -->
                    <div class=" h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">

                        <Dropdown :pt="{
                            root: {
                                class: 'md:ml-4'
                            }
                        }" v-model="roleId" editable :options="nodes.roles" optionValue="id" optionLabel="name" @change="checkRoles" placeholder="Select Roles" class="w-full md:w-1/3" />



                        <ul  class="w-full pl-4 ">

                            <li v-for="(item, index) in nodes.access" :key="index">
                                
                                <div class="p-1 cursor-pointer flex ">
                                    <div @click="toggle(index)" class="w-6 h-8 text-center ease-in duration-300">
                                        <Icon name="iconamoon:arrow-right-2" :class="`${item.opened ? 'rotate-90' : ''}`" class="ease-in duration-300 text-2xl"></Icon>
                                    </div>
                                    <div class="-mt-[2px] flex">
                                        <input class="mr-2" v-bind="item.id" :checked="item.indeterminate != false ? false : true" :indeterminate="item.indeterminate" type="checkbox" @click="multipleCheck(item.id)"  :id="item.id">
                                        <label :for="item.id" class="text-md mt-1">{{ item.name }}</label>
                                    </div>
                                </div>

                                <ul class="ml-12 border-l pl-2 w-fit ease-in duration-300 overflow-hidden transition-all" :class="`${item.opened ? 'h-full' : 'h-[0px]'}`" v-if="item.children">
                                    <li v-for="(child, childKey) in item.children" :key="childKey">
                                        <div class="mt-1 flex">
                                            <input class="mr-2" name="actions[]" :value="child.id" @click="singleCheck(index, childKey, $event)" :checked="child.checked" type="checkbox" :id="item.id">
                                            <label :for="item.id" class="text-md -mt-[2px]">{{ child.action.name }}</label>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        
                    </div>
                    <div class="flex">
                        <div class="" >
                            <button type="submit" class="bg-yellow-500 px-4 py-2 text-white items-center">Update</button>
                        </div>
                        <div class="flex ml-4">

                            <input id="exit" v-model="exits" type="checkbox" />
                            <label class="ml-2 mt-1" for="exit">This will effect on existing users</label>
                        </div>
                    </div>
                </div>
                
            </form>
        </NuxtLayout>
</template>

<style>
    ul li ul li{
        padding: 0 !important;
    }
    .p-tree .p-tree-container .p-treenode {
        margin: 1px;
        padding: 0;
    }


    .p-checkbox .p-checkbox-box {
        width: 20px;
        height: 20px;
        color: #323130;
        border-radius: 2px;
        /* transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s; */
    }

    .p-tree .p-tree-container .p-treenode .p-treenode-content {
        border-radius: 2px;
        transition: box-shadow 0.2s;
        padding: 0 !important;
    }
    .p-treenode-children {
        padding-left: 26px
    }
</style>