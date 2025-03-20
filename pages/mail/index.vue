<script setup>
import { onMounted, reactive, ref } from "vue";

//Get Toast
const toast = useToast();
//loading
const isLoading = ref(false);


const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;

const getMailData = ref();
const popUp = ref('');
const singleId = ref();

definePageMeta({
    layout: "dashboard",
    middleware: ["auth"],
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

// working Noor
const fromData = ref({
    smtp_name: "",
    smtp_username: "",
    from_address: "",
    smtp_password: "",
    from_name: "",
    smtp_port: "",
    smtp_encryption: "TLS",
    // status: 1,
});

// Working From Error 
const fromError = ref({
    smtp_name: "",
    smtp_username: "",
    from_address: "",
    smtp_password: "",
    from_name: "",
    smtp_port: "",
    smtp_encryption:""

})



// Data submit  for add data or edit data
const dataSubmit = async () => {

    try {
        let url;
        // if find the single id the working for update url ,else working add url
        if(singleId.value != null){
            url = `mail_configuration/${singleId.value}`;
        }else{
            url = "mail_configuration"
        }


         const res= await $fetch(`${EndPoint}/admin/${MasterKey}/${url}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${app_token}`,
            },

            // body: JSON.stringify({
            //     smtp_username: fromData.value.smtp_username,
            //     smtp_name: fromData.value.smtp_name,
            //     smtp_port: fromData.value.smtp_port,
            //     smtp_password: fromData.value.smtp_password,
            //     smtp_encryption: fromData.value.smtp_encryption,
            //     from_address: fromData.value.from_address,
            //     from_name: fromData.value.from_name,

                
            // }),
            body:JSON.stringify(fromData.value)
        });


        if ( res?.status === "Success") {

            toast.add({
                severity: "success",
                summary: "Mail Configuration",
                detail: "Mail Configuration updated successfully.",
                life: 2000,
            });
            getData();

             fromData.value = {
                smtp_name: "",
                smtp_username: "",
                from_address: "",
                smtp_password: "",
                from_name: "",
                smtp_port: "",
                smtp_encryption: "TLS",
                // status: 1,
            };

        }else if (res ==='update' ) {
            toast.add({
                severity: "success",
                summary: "Mail Configuration",
                detail: "Mail Configuration updated successfully.",
                life: 2000,
            });
            getData();

             fromData.value = {
                smtp_name: "",
                smtp_username: "",
                from_address: "",
                smtp_password: "",
                from_name: "",
                smtp_port: "",
                smtp_encryption: "TLS",
                // status: 1,
            };
           
        }else{

            toast.add({
                severity: "error",
                summary: "Error",
                detail: res.error != undefined ? res.error : "Please check the all fields and try again!" ,
                life: 2000,
            });
            
            
        }

        

    } catch (error) {
        // console.log('xhr',xhr);
        // return { success: false, message: 'An error occurred during Request' };
        console.log(error.response);

        fromError.value = {
            smtp_name: error.response?._data?.smtp_name != undefined ?  error.response?._data.smtp_name[0] : '',
            smtp_username: error.response?._data?.smtp_username != undefined ?  error.response?._data.smtp_username[0] : '',
            from_address: error.response?._data?.from_address != undefined ?  error.response?._data.from_address[0] : '',
            smtp_password: error.response?._data?.smtp_password != undefined ?  error.response?._data.smtp_password[0] : '',
            from_name: error.response?._data?.from_name != undefined ?  error.response?._data.from_name[0] : '',
            smtp_port: error.response?._data?.smtp_port != undefined ?  error.response?._data.smtp_port[0] : '',
            
            // from_address: error.response?._data.from_address[0],
            // smtp_password: error.response?._data.smtp_password[0],
            // from_name: error.response?._data.from_name[0],
            // smtp_port: error.response?._data.smtp_port[0],
            
        }
    }

    console.log(fromError.value)


}

// Data fetching 
onMounted(async () => {

    getData();

});


const getData = async () => {
    try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/mail_configuration`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${app_token}`,
            },

        });

        getMailData.value = await res.json();
        



    } catch (error) {
      console.log(error);
    }
}

// working modal

const showPopUP = async (id) => {

popUp.value = id;

}
const cencelPopUP = async () => {

popUp.value = null;

}


// delete method 

const deleteHandler = async(id) => {

    const res = await fetch(`${EndPoint}/admin/${MasterKey}/mail_configuration/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${app_token}`,
            },

        });

        getData();

    
}


// status method 

const statusMethod = async(id)=>{

    const res = await fetch(`${EndPoint}/admin/${MasterKey}/mail_configuration/${id}/status`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${app_token}`,
            },

        });
        console.log('status',res);
        if (res?.ok) {
            toast.add({
                severity: "success",
                summary: "Mail Configuration status",
                detail: "Mail Configuration status updated successfully.",
                life: 2000,
            });
            getData();
        } else {
            toast.add({
                severity: "error",
                summary: "Error",
                detail: "An error occurred.",
                life: 2000,
            });
        }
    
}


// single data fetching for edit 

const editHandler = async(id)=>{

    try {
        const res = await fetch(`${EndPoint}/admin/${MasterKey}/mail_configuration/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${app_token}`,
            },

        });

        const getItem = await res.json();
      

        if (res?.ok && Array.isArray(getItem.data) && getItem.data.length > 0) {
            const item = getItem.data[0];  
            singleId.value = id;
           
            fromData.value = {
                smtp_name: item.smtp_name ,
                smtp_username: item.smtp_username,
                from_address: item.from_address,
                smtp_password: item.smtp_password,
                from_name: item.from_name,
                smtp_port: item.smtp_port,
                smtp_encryption: item.smtp_encryption,
                
            };
        }
        
        

    } catch (error) {
      console.log(error);
    }
   
}



</script>
<template>
    <NuxtLayout :name="layout">
        <Toast />
        <spiner v-if="isLoading" />
        <div class="w-full px-3 mt-1">
            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between bg-gray-400 text-white">
                    <div class="font-semibold mt-1 ml-3">Mail Configuration</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()"
                            class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-tr-sm">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>
                </div>
                <!-- Body Content goes here -->
                <div  class="h-[calc(100vh-8rem)] overflow-y-auto border-b px-3 pt-2">

                    <div class="flex w-full justify-center">
                        <div v-if="visibleAllow(16, 2)" class="w-1/2">
                            <form @submit.prevent="dataSubmit">
                                <div class="grid grid-cols-2 gap-2">
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Smtp Name</label>
                                        <!-- <input type="text" v-model="fromData.smtp_name" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="example: smtp.mailtrap.io" /> -->
                                        <input type="text" v-model="fromData.smtp_name" :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.smtp_name?'border-[red]':'']" placeholder="example: smtp.mailtrap.io" />
                                        <span v-if="fromError.smtp_name" class="text-sm text-[red]">{{ fromError.smtp_name }}</span>
            
                                    </div>
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">User Name</label>
                                        <input type="text" v-model="fromData.smtp_username" :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.smtp_username?'border-[red]':'']" placeholder="example: Mohammad Noor" />
                                        <span v-if="fromError.smtp_username" class="text-sm text-[red]">{{ fromError.smtp_username }}</span>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-2 mt-2">
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">From Address</label>
                                        <input type="email" v-model="fromData.from_address" :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.from_address?'border-[red]':'']" placeholder="from address" />
                                        <span v-if="fromError.from_address" class="text-sm text-[red]">{{ fromError.from_address }}</span>
                                    </div>

                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Smtp Password</label>
                                        <input type="text" v-model="fromData.smtp_password" :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.smtp_password?'border-[red]':'']" placeholder="mail password" />
                                        <span v-if="fromError.smtp_password" class="text-sm text-[red]">{{ fromError.smtp_password }}</span>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-2 mt-2">
                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">From Name</label>
                                        <input type="text" v-model="fromData.from_name" :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.from_name?'border-[red]':'']" placeholder="example: Admin / Info" />
                                        <span v-if="fromError.from_name" class="text-sm text-[red]">{{ fromError.from_name }}</span>
                                    </div>

                                    <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Smtp Port</label>
                                        <input type="text" v-model="fromData.smtp_port" :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.smtp_port?'border-[red]':'']" placeholder="example: 995 / 25 / 587 / ect" />
                                        <span v-if="fromError.smtp_port" class="text-sm text-[red]">{{ fromError.smtp_port }}</span>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-2 mt-2 justify-center ">
                                    <!-- <div class="w-full">
                                        <label for="dd-city" class="text-sm w-full">Smtp Encryption</label>
                                        <input type="text" v-model="fromData.smtp_encryption"
                                            :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.smtp_name?'border-[red]':'']"
                                            placeholder="example: TLS / SSL" />
                                    </div> -->

                                    <div class="w-full">
                                        <label for="encryption_type" class="text-sm w-full">Smtp Encryption</label>
                                        <select name="encryption" v-model="fromData.smtp_encryption"
                                            id="encryption_type"
                                            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                            <option value="TLS">TLS</option>
                                            <option value="SSL">SSL</option>
                                        </select>
                                    </div>
                                    <!-- <div class="w-full">
                                        <label for="commission_type" class="text-sm w-full">Status</label>
                                        <select name="status" v-model="fromData.status" id="commission_type"
                                            :class="['w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md',fromError.smtp_name?'border-[red]':'']">
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div> -->
                                    <div class="w-full mt-4">
                                    <button class="bg-green-500 mt-1 font-semibold text-white py-1 rounded-md px-4 mb-4" type="submit">
                                        Add <Icon name="fa-solid:paper-plane"></Icon>
                                    </button>
                                    
                                </div>
                                </div>

                                
                            </form>
                        </div>
                    </div>
                    <!-- working Aminur -->
                    <div class="w-full flex justify-center mt-8">
                        <div class="w-1/2">

                            <table class=" w-full table-auto">
                                <thead>
                                    <tr class="w-full bg-gray-300 text-sm">
                                        <th class="py-3 px-1 text-left text-sm w-8">SL</th>
                                        <th class="py-3 px-1 text-left text-sm">Smtp Name</th>
                                        <th class="py-3 px-1 text-left text-sm">User Name</th>
                                        <th class="py-3 px-1 text-left text-sm">From Address</th>
                                        <th class="py-3 px-1 text-left text-sm">From Name</th>
                                        <th class="py-3 px-1 text-left text-sm">Smtp Port</th>
                                        <th class="py-3 px-1 text-left text-sm">Smtp Encryption</th>
                                        <th class="py-3 px-1 text-center text-sm">Status</th>
                                        <th class="py-3 px-1 text-center w-24">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-white odd:bg-gray-100 text-center"
                                        v-for="(item, index) in getMailData?.data" :key="index">
                                        <td class="py-3 px-1 text-center text-xs">{{ index }}</td>
                                        <td class="py-3 px-1 text-left text-xs">{{ item.smtp_name }}</td>
                                        <td class="py-3 px-1 text-left text-xs">{{ item.smtp_username }}</td>
                                        <td class="py-3 px-1 text-left text-xs">{{ item.from_address }}</td>
                                        <td class="py-3 px-1 text-left text-xs">{{ item.from_name }}</td>
                                        <td class="py-3 px-1 text-left text-xs">{{ item.smtp_port }}</td>
                                        <td class="py-3 px-1 text-left text-xs">{{ item.smtp_encryption }}</td>
                                        <td class="py-3 px-1 text-center text-xs" >
                                            <span class="text-green-700" v-if="item.status == 1">Active</span>
                                            <span class="text-red-700" v-else>Inactive</span>
                                        </td>

                                                
                                        <td class="py-3 px-1 text-xs  text-center">

                                            <div class="flex gap-2 text-center justify-center items-center">
                                                <span v-if="visibleAllow(16, 2)" class="cursor-pointer bg-yellow-500 p-1 text-white rounded" @click="editHandler(item.id)">
                                                    <Icon name="subway:pencil" width="1.4em" height="1.4em" />
                                                </span>
                                                <span v-if="visibleAllow(16, 4)" class="cursor-pointer p-1 text-white rounded bg-red-500" @click="showPopUP(item.id)">
                                                    <Icon name="material-symbols:delete" width="1.4em" height="1.4em" />
                                                </span>
                                                <span class="cursor-pointer bg-yellow-200 p-1 text-white rounded" @click="statusMethod(item.id)">
                                                    <Icon v-if="item.status == 1" name="uil:times-square" width="1.4em" height="1.4em" class="text-red-600"/>
                                                    <Icon v-else name="el:check" width="1.4em" height="1.4em" class="text-green-600"/>
                                                </span>
                                            </div>
                                        </td>
                                          
                                         <!-- modal pen -->
                                        <div v-if="popUp === item.id" class="relative z-10"
                                            aria-labelledby="modal-title" role="dialog" aria-modal="true">

                                            <div class="fixed inset-0  transition-opacity" aria-hidden="true"></div>

                                            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                                                <div
                                                    class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                                                    <div
                                                        class="relative transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                                        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                            <div class="sm:flex sm:items-start">
                                                                <div
                                                                    class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                                                    <svg class="size-6 text-red-600" fill="none"
                                                                        viewBox="0 0 24 24" stroke-width="1.5"
                                                                        stroke="currentColor" aria-hidden="true"
                                                                        data-slot="icon">
                                                                        <path stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                                                    </svg>
                                                                </div>
                                                                <div
                                                                    class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                                    <h3 class="text-base font-semibold text-gray-900"
                                                                        id="modal-title">Are you confirm!</h3>
                                                                    <div class="mt-2">
                                                                        <p class="text-sm text-gray-500">You never get back again this data?</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                            <button @click="deleteHandler(item.id)"
                                                                type="button"
                                                                class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Confirm</button>
                                                            <button @click="cencelPopUP()" type="button"
                                                                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    </NuxtLayout>
</template>
