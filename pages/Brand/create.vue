<script setup>
    import FileUpload from 'primevue/fileupload';
    import Fieldset from 'primevue/fieldset';
    import { useToast } from 'primevue/usetoast';
    import { useBrandStore } from '~/stores/brand';

//Get Router From useRouter
const router = useRouter();
//Get Toast
const toast = useToast();
//Define Page Meta
definePageMeta({
    layout: "dashboard",
    middleware: ['auth'],
})
//Loading State
const isLoading = ref(false);
//Get Brand Store
const brandStore = useBrandStore();
//Get Reactive Data
const BrandName = ref('');
const Commission = ref('');
const CommissionType = ref("fixed");
const Status = ref(1);
const Description = ref('');
const BrandIcon = ref('');
const BrandBanner = ref('');
const BrandThumbnail = ref('');
const extraProps = ref([]);
const extraFields = ref([]);

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

// File Upload
const handleFileUpload = (event, type) => {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            if (type === 'icon') BrandIcon.value = reader.result;
            if (type === 'banner') BrandBanner.value = reader.result;
            if (type === 'thumbnail') BrandThumbnail.value = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

const dataSubmit = async () => {

    extraFields.value.forEach((item, index) => {

        extraProps.value = {...extraProps.value, [item.fieldName] : item.fieldValue};
        console.log(item)
    })

    isLoading.value = true;
    try {
        const data = {
            name: BrandName.value,
            icon: BrandIcon.value,
            banner: BrandBanner.value,
            thumbnail: BrandThumbnail.value,
            description: Description.value,
            commission: Commission.value,
            commission_type: CommissionType.value,
            status: Status.value,
            extend_props: extraProps.value
        }
        console.log(data);
        const result = await brandStore.addBrand(data);
        console.log(result);
        if (result.success) {
            toast.add({
                severity: 'success',
                summary: 'Brand Created',
                detail: result.message || 'Brand was created successfully.',
                life: 3000,
            });

            setTimeout(() => {
                router.push('/Brand');
            }, 2000);

        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: result.message || 'An error occurred.',
                life: 3000,
            });
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An unexpected error occurred.',
            life: 3000,
        });
        console.error(error);
    } finally{
    isLoading.value = false;
  }

}

</script>
<template>
    <NuxtLayout :name="layout">
        <Toast />
        <spiner v-if="isLoading" />
        <div class="w-full px-3 mt-1">

<div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
    <div class="flex w-full justify-between  bg-gray-400 text-white">
        
        <div class="font-semibold mt-1 ml-3">Create Brand</div>
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
                    <!--Name And Status-->
                    <div class="grid grid-cols-2 gap-2">
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Name</label>
                            <input type="text" v-model="BrandName" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Brand Name"/>
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Status</label>
                            <select v-model="Status" name="status" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                <option value="1"> Active</option>
                                <option value="0"> Inactive</option>
                            </select>
                        </div>
                    </div>
                    <!--File Upload-->
                    <div class="grid grid-cols-3 gap-2 mt-2">
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Icon</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }" mode="basic"  @select="(event) => handleFileUpload(event, 'icon')"  name="icon" accept="image/*"/>
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Banner</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }" mode="basic"  @select="(event) => handleFileUpload(event, 'banner')" name="banner" accept="image/*" />
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Thumbnail</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }" mode="basic"  @select="(event) => handleFileUpload(event, 'thumbnail')" name="thumbnail" accept="image/*"/>
                        </div>
                    </div>
                    <!-- comission tab -->
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Commission</label>
                            <input type="number" v-model="Commission" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Commission"/>
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Commission Type</label>
                            <select v-model="CommissionType" name="commission_type" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                <option value="fixed"> Fixed</option>
                                <option value="parcentage"> Parcentage</option>
                            </select>
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
                    <!--Description-->
                    <div class="w-full mt-1">
                        <label for="dd-city" class="text-sm w-full">Description</label>
                        <textarea v-model="Description" class="w-full border rounded-md"></textarea>
                    </div>
                    <!--Submit Button-->
                    <div class="place-content-end flex w-full">
                        <button :disabled="isLoading === true" class="bg-green-500 mt-1 font-semibold text-white py-1 rounded-md px-4 mb-4" type="submit">
                                    <div v-if="isLoading === false">
                                        Add <Icon name="fa-solid:paper-plane"></Icon>
                                    </div>
                                    <div v-else>
                                        Loading... <Icon name="fa-solid:paper-plane"></Icon>
                                    </div>
                                </button>
                    </div>
                </form>
            </div>

        </div>
        

    </div>
    
</div>

</div>
    </NuxtLayout>
</template>