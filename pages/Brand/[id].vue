<script setup>
import FileUpload from 'primevue/fileupload';
import Fieldset from 'primevue/fieldset';
import { useBrandStore } from '~/stores/brand';
//Define Page Meta
definePageMeta({
    layout: "dashboard",
    middleware: ['auth'],
})
// Initialize router and route
const router = useRouter();
//Initialize Store
const BrandStore = useBrandStore();
const Brand = ref({});
// Extra fields
const extraProps = ref([]);
const extraFields = ref([]);
//Loading And Toast
const loading = ref('Stop');
const toast = useToast();
//File Data
const brandIcon = ref('');
const brandBanner = ref('');
const brandThumbnail = ref('');
// Assume you have a dynamic route with the slide ID
const Id = router.currentRoute.value.params.id;

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

// Fetch the slide data when the component is mounted
onMounted(async () => {
    loading.value = 'Success';
    try {
        const data = await BrandStore.getSingleBrand(Id);
        Brand.value = data.data;
        console.log(Brand.value);
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
            detail: 'Failed to load Brand data.',
            life: 3000,
        });
    } finally {
        loading.value = 'Stop';
    }
});

//Handle File Upload
const handleFileUpload = (event, type) => {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'icon') brandIcon.value = reader.result;
      if (type === 'banner') brandBanner.value = reader.result;
      if (type === 'thumbnail') brandThumbnail.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};
//Handle Data Submit
const dataSubmit = async () => {

try {
    extraFields.value.forEach((item, index) => {
        extraProps.value = {...extraProps.value, [item.fieldName] : item.fieldValue};
        console.log(item)
    });
    // Form data
    const BrandData = reactive({
        name: Brand.value.name,
        status: Brand.value.status,
        description: Brand.value.description,
        commission: Brand.value.commission,
        commission_type: Brand.value.commission_type,
        icon: brandIcon.value,
        banner: brandBanner.value,
        thumbnails: brandThumbnail.value,
        extend_props: extraProps.value,
    });
    loading.value = 'Success';
    const result = await BrandStore.updateBrand(BrandData, Id);
    console.log(result);
    if (result) {
        toast.add({
            severity: 'success',
            summary: 'Brand Updated',
            detail: result.message || 'Brand updated successfully.',
            life: 2000,
        });
        setTimeout(() => {
            router.push('/brand');
        }, 2000);
    }else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: result.message || 'Failed to update Brand.',
            life: 2000,
        });
    }
} catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred.',
      life: 2000,
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
    <!--Header-->
    <div class="flex w-full justify-between  bg-gray-400 text-white">
        <div class="font-semibold mt-1 ml-3">Edit Brand</div>
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
                    <!--Name & Status-->
                    <div class="grid grid-cols-2 gap-2">
                        <!--Name-->
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Name</label>
                            <input type="text" v-model="Brand.name" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Brand Name"/>
                        </div>
                        <!--Status-->
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Status</label>
                            <select name="status" v-model="Brand.status" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                <option value="1"> Active</option>
                                <option value="0"> Inactive</option>
                            </select>
                        </div>
                    </div>
                    <!--Icon, Banner & Thumbnail-->
                    <div class="grid grid-cols-3 gap-2 mt-2">
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Icon</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }" @select="(event) => handleFileUpload(event, 'icon')"  mode="basic" name="icon" accept="image/*"/>
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Banner</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }"  @select="(event) => handleFileUpload(event, 'banner')"  mode="basic" name="banner" accept="image/*" />
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Brand Thumbnail</label>
                            <FileUpload :pt="{
                                chooseButton: {
                                    class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                },
                                
                                
                            }"  @select="(event) => handleFileUpload(event, 'thumbnail')"  mode="basic" name="thumbnail" accept="image/*"/>
                        </div>
                    </div>

                    <!-- Comission tab -->
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Commission</label>
                            <input type="number" v-model="Brand.commission" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Commission"/>
                        </div>
                        <div class="w-full">
                            <label for="dd-city" class="text-sm w-full">Commission Type</label>
                            <select name="commission_type" v-model="Brand.commission_type" id="commission_type" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                <option value="fixed"> Fixed</option>
                                <option value="parcentage"> Parcentage</option>
                            </select>
                        </div>
                    </div>

                    <!-- Dynamic field -->
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
                        <textarea v-model="Brand.description" class="w-full border rounded-md"></textarea>
                    </div>

                    <div class="place-content-end flex w-full">
                        <button class="bg-green-500 mt-1 font-semibold text-white py-1 rounded-md px-4 mb-4" type="submit">Update<Icon name="fa-solid:paper-plane"></Icon></button>
                    </div>

                    
                </form>
            </div>

        </div>
        

    </div>
    
</div>

</div>
    </NuxtLayout>
</template>