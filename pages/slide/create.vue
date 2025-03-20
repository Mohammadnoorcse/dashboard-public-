<script setup>
import { useToast } from 'primevue/usetoast';
const router = useRouter();

//Define Page Meta
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});
//Toast
const toast = useToast();
//Extra Props
const extraProps = ref([]);
const extraFields = ref([]);
//Reactive Varrialbes
const slideName = ref('');
const status = ref('1');
const description = ref('');
const slideIcon = ref('');
const slideBanner = ref('');
const slideThumbnail = ref('');
const store = useSlideStore();
const isLoading = ref(false);
//Add More Field
const addMoreField = () => {
  extraFields.value.push({ fieldName: '', fieldValue: '' });
};
//Remove More Field
const removeMoreField = (index) => {
  extraFields.value.splice(index, 1);
};
//File Upload
const handleFileUpload = (event, type) => {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'icon') slideIcon.value = reader.result;
      if (type === 'banner') slideBanner.value = reader.result;
      if (type === 'thumbnail') slideThumbnail.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};
//Data Submit
const dataSubmit = async () => {
  extraProps.value = extraFields.value.reduce((props, item) => {
    props[item.fieldName] = item.fieldValue;
    return props;
  }, {});
  isLoading.value = true;
  try {
    const slideData = reactive({
      name: slideName.value,
      status: status.value,
      description: description.value,
      icon: slideIcon.value,
      banner: slideBanner.value,
      thumbnails: slideThumbnail.value,
      extend_props: extraProps.value
    });

    const result = await store.addSlide(slideData);
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Slide Created',
        detail: result.message || 'Slide was created successfully.',
        life: 2000,
      });
      //Redirect to Slide Page
      setTimeout(() => {
        router.push('/slide')
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
};
</script>


<template>
<NuxtLayout :name="layout">
    <Toast/>
    <Spiner :loading="isLoading ? 'loading' : 'success'"/>
    <div class="w-full px-3 mt-1">
        <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
        <!--Page header-->
            <div class="flex w-full justify-between bg-gray-400 text-white">
                <div class="font-semibold mt-1 ml-3">Create Slide</div>
                <div class="font-semibold ml-1 flex">
                    <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm rounded-tr-sm">
                        <Icon name="gg:arrow-left-o"></Icon> Back
                    </button>
                </div>
            </div>
            <!--Form Ipnput-->
            <div class="h-[calc(100vh-8rem)] overflow-y-auto border-b px-3 pt-2">
                <div class="flex w-full justify-center">
                    <div class="w-1/2">
                        <form @submit.prevent="dataSubmit">
                            <!--Name And Status-->
                            <div class="grid grid-cols-2 gap-2">
                                <div class="w-full">
                                    <label for="slide-name" class="text-sm w-full">Slide Name</label>
                                    <input type="text" v-model="slideName" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Slide Name"/>
                                </div>
                                <div class="w-full">
                                    <label for="status" class="text-sm w-full">Status</label>
                                    <select v-model="status" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <!--File Upload-->
                            <div class="grid grid-cols-3 gap-2 mt-2">
                                <div class="w-full">
                                    <label for="slide-icon" class="text-sm w-full">Slide Icon</label>
                                    <FileUpload :pt="{
                                        chooseButton: {
                                            class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                        }
                                    }" mode="basic" name="icon" accept="image/*" @select="(event) => handleFileUpload(event, 'icon')"/>
                                </div>
                                <div class="w-full">
                                    <label for="slide-banner" class="text-sm w-full">Slide Banner</label>
                                    <FileUpload :pt="{
                                        chooseButton: {
                                            class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                        }
                                    }" mode="basic" name="banner" accept="image/*" @select="(event) => handleFileUpload(event, 'banner')"/>
                                </div>
                                <div class="w-full">
                                    <label for="slide-thumbnail" class="text-sm w-full">Slide Thumbnail</label>
                                    <FileUpload :pt="{
                                        chooseButton: {
                                            class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                                        }
                                    }" mode="basic" name="thumbnail" accept="image/*" @select="(event) => handleFileUpload(event, 'thumbnail')"/>
                                </div>
                            </div>
                            <!--Description-->
                            <div class="grid grid-cols-1 gap-2 mt-2">
                                <div class="w-full">
                                    <label for="description" class="text-sm w-full">Description</label>
                                    <textarea v-model="description" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Description"></textarea>
                                </div>
                            </div>
                            <!--Extra Props-->
                            <div class="grid grid-col gap-2 mt-2">
                                <Fieldset legend="Extra Props" :pt="{
                                    root: { class: 'border p-2' },
                                    legend: { class: 'p-0 m-0' },
                                    togglerIcon: {}
                                }">
                                    <template #legend>
                                        <div class="flex align-items-center pl-2">
                                            <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer" @click="addMoreField">
                                                Add More <Icon name="mdi:table-add" width="1.4em" height="1.4em"></Icon>
                                            </div>
                                            <span class="font-bold">Extra Props</span>
                                        </div>
                                    </template>
                                    <div v-for="(extra, index) in extraFields" :key="index" class="flex w-full px-2 py-1">
                                        <div class="w-full mr-2">
                                            <label class="text-sm w-full" title="Use field name like: fieldName, field_name or fieldname">Field Name <Icon name="clarity:info-solid"></Icon></label>
                                            <input type="text" v-model="extra.fieldName" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                        </div>
                                        <div class="w-full mr-2">
                                            <label class="text-sm w-full">Field Value</label>
                                            <input type="text" v-model="extra.fieldValue" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                        </div>
                                        <div class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreField(index)">
                                            <Icon class="text-white" name="humbleicons:times"></Icon>
                                        </div>
                                    </div>
                                </Fieldset>
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
