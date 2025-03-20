<script setup>
    import FileUpload from 'primevue/fileupload';
    import Fieldset from 'primevue/fieldset';

//Define Page Meta
    definePageMeta({
        layout: "dashboard",
        middleware: "auth",
    })

//Initialize Store
const VendorStore = useVendorStore();
const Vendor = ref({});
// Initialize router and route
const router = useRouter();
// Extra fields
const extraProps = ref([]);
const extraFields = ref([]);
//Loading And Toast
const loading = ref('Stop');
const toast = useToast();
// Assume you have a dynamic route with the slide ID
const Id = router.currentRoute.value.params.id;
//File Data
const VendorIcon = ref('');
const VendorBanner = ref('');

// Add extra field function goes here
const addMoreField = () => {
    extraFields.value = [
        ...extraFields.value, {
            fieldName: "",
            fieldValue: "",
        }
    ];
}

// Remove extra field
const removeMoreField = (index) => {
    extraFields.value.splice(index, 1);
}
//Handle File Upload
const handleFileUpload = (event, type) => {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'icon') CouponIcon.value = reader.result;
      if (type === 'banner') CouponBanner.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

// Fetch the Vendor data when the component is mounted
onMounted(async () => {
    loading.value = 'Success';
    try {
        const data = await VendorStore.getSingleVendor(Id);
        Vendor.value = data.data;
        console.log(Vendor.value);
       // Populate extraFields with the existing extend_props
       if (data.data.extend_props) {
            extraFields.value = Object.entries(data.data.extend_props).map(([key, value]) => ({
                fieldName: key,
                fieldValue: value,
            }));
        }
    } catch (error) {
        console.error(error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: data.message ||'Failed to load Coupon data.',
            life: 2000,
        });
    } finally {
        loading.value = 'Stop';
    }
});


const dataSubmit = async() => {
    try {
        extraFields.value.forEach((item, index) => {
        extraProps.value = {...extraProps.value, [item.fieldName] : item.fieldValue};
    });
    const vendorData = {
        name: Vendor.value.name,
        icon: VendorIcon.value,
        banner: VendorBanner.value,
        description: Vendor.value.description,
        status: Vendor.value.status,
        extend_props: extraProps.value,
    };
    loading.value = 'Success';
    const result = await VendorStore.updateVendor(vendorData, Id);
    if (result) {
    toast.add({
        severity: 'success',
        summary: 'Vendor Updated',
        detail: 'Vendor updated successfully.',
        life: 3000,
    });
    // router.push('/vendor');
    } else {
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message || 'Failed to update slide.',
        life: 3000,
        });
    }
    } catch (error) {
        console.log(error);
        toast.add({
    severity: 'error',
    summary: 'Error',
    detail: 'An unexpected error occurred.',
    life: 3000,
});
    } finally {
        loading.value = 'Stop';
    }

}

</script>
<template>
    <NuxtLayout :name="layout">
        <Toast />
        <Spiner v-if="loading === 'Success'" />
        <div class="w-full px-3 mt-1">

<div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
    <div class="flex w-full justify-between  bg-gray-400 text-white">
        
        <div class="font-semibold mt-1 ml-3">Edit Vendor</div>
        <div class="font-semibold ml-1 flex">
            <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-tr-sm">
                <Icon name="gg:arrow-left-o"></Icon>
                Back
            </button>
        </div>
        
    </div>
    <!-- Body Content goes here -->
    <div class=" h-[calc(100vh-8rem)] overflow-y-auto border-b px-3 pt-2">
        <div class="flex w-full justify-center">
            <div class="w-1/2">
                <form  @submit.prevent="dataSubmit">
                    <div class="grid grid-cols-2 gap-2">
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Vendor Name</label>
                            <input type="text" v-model="Vendor.name" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Vendor Name"/>
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Status</label>
                            <select v-model="Vendor.status" name="status" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                <option value="1"> Active</option>
                                <option value="0"> Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Vendor Icon</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }" mode="basic" @select="(event) => handleFileUpload(event, 'icon')" name="icon" accept="image/*"/>
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Vendor Banner</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }" mode="basic" @select="(event) => handleFileUpload(event, 'banner')" name="banner" accept="image/*" />
                        </div>
                    </div>
                    <!-- dynamic field -->
                    <div class="grid grid-col gap-2 mt-2">
                        <Fieldset legend="Extra Props" :pt="{
                            root: {
                                class: 'border p-2'
                            },
                            legend:{
                                class: 'p-0 m-0'
                            },
                            togglerIcon:{

                            }
                        }">
                        <template #legend>
                            <div class="flex align-items-center pl-2">
                                <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer" @click="addMoreField">Add More <Icon name="mdi:table-add" width="1.4em" height="1.4em"></Icon></div>
                                <span class="font-bold">Extra Props</span>
                            </div>
                        </template>
                            
                            <div class="flex w-full px-2 py-1" v-for="(extra, index) in extraFields" :key="index">
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname"> Field Name <Icon name="clarity:info-solid"></Icon></label>
                                    <input type="text" v-model="extra.fieldName"  class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                </div>
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                    <input type="text" v-model="extra.fieldValue" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                </div>
                                <div class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreField(index)"><Icon class="text-white" name="humbleicons:times"></Icon></div>
                                
                            </div>


                        </Fieldset>
                        
                    </div>


                    <div class="w-full mt-1">
                        <label for="dd-city" class="text-sm w-full">Description</label>
                        <textarea v-model="Vendor.description" class="w-full border rounded-md"></textarea>
                    </div>

                    <div class="place-content-end flex w-full">
                        <button class="bg-green-500 mt-1 font-semibold text-white py-1 rounded-md px-4 mb-4" type="submit">Update <Icon name="fa-solid:paper-plane"></Icon></button>
                    </div>

                    
                </form>
            </div>

        </div>
        

    </div>
    
</div>

</div>
    </NuxtLayout>
</template>