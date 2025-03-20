<script setup>
    import Image from 'primevue/image';
    import Fieldset from 'primevue/fieldset';
    import InputGroup from "primevue/inputgroup";
    import InputGroupAddon from "primevue/inputgroupaddon";
    import Sidebar from "primevue/sidebar";
    import TabMenu from "primevue/tabmenu";
    import Calendar from "primevue/calendar";

    import Dropdown from "primevue/dropdown";


    
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

    const props = defineProps(['additional']);
    const { additional } = props;

    const icon = ref('');
    const feature = ref('');
    const gallery = ref([]);
    const mediaId = ref("");

    const visibleRight = ref(false);
    const loading = ref("not");

    const fieldestStyle = (
        { 
            root: { 
                class: 'border px-2'
            },
            legend:{
                class: 'p-0 m-0'
            }
        }
    )

    const imageStyle = (
        {
            icon: {
                class: "text-white"
            },
            toolbar: {
                class: "text-white"
            }

        }
    )

    // Feature Image function goes here
    const  getFeatureIcon = (e) => {
        const file = e.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {                
                icon.value = reader.result
            };
            reader.readAsDataURL(file);
        }
    }

    // Feature Image function goes here
    const  getFeature = (e) => {
        const file = e.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {                
                feature.value = reader.result
            };
            reader.readAsDataURL(file);
        }
    }

    // Product Galleries function goes here
    const  selectMultiple = (e) => {
        const files = e.files;

        for( let i = 0; i < files.length; i++ ){

            const reader = new FileReader();
            if (files[i]) {
                reader.onload = () => {
                    gallery.value = {
                        ...gallery.value,
                        [i] : reader.result
                    }
                }

                reader.readAsDataURL(files[i])

            }
        }
    }


    onMounted( async () => {
        loading.value = "success";
    })


    const openWindow = (data) => {
        visibleRight.value = true;
        mediaId.value = data;
    }



    const submitData = async () => {

        loading.value = "not";
        let id = mediaId.value;

        let data = {
            icon : icon.value,
            feature : feature.value,
            gallery : gallery.value,
            id : id,
            
        }

        const resp = await $fetch(`${EndPoint}/admin/${MasterKey}/additional/media/${id}`,
            {
                method: 'POST',
                headers:headers.value,
                body: data
            }
        )
        // router.push('/product');
        loading.value = "success";

        console.log(resp);

    }



</script>

<template>
    <div>
        <div v-if="loading !== 'success' " class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
            <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
        </div>

        <Fieldset legend="Extra Props" :pt="fieldestStyle">
            <template #legend>
                <div class="flex align-items-center pl-2 border-t">
                    <span class="font-bold">{{ additional.slug }}  
                        <button
                            class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform rounded-sm hover:text-black px-2 py-1 text-sm"
                            @click="openWindow(additional.id)">
                            <Icon name="iconoir:filter-solid"></Icon>
                            Edit
                        </button></span>
                </div>
            </template>
            <div class="w-full grid grid-cols-3 gap-2">

                <div class="card justify-content-center"  :key="additional.color_icon">
                    <Image :pt="imageStyle" :src="additional.color_icon" alt="Image" preview />
                </div>

                <div class="card justify-content-center" :key="additional.color_thumbnails">
                    <Image :pt="imageStyle" :src="additional.color_thumbnails" alt="Image" preview />
                </div>
                
                <div class="card justify-content-center" v-for="(gallery, key) in additional.color_galleries" :key="key">
                    <Image :pt="imageStyle" :src="gallery" alt="Image" preview />
                </div>
                
                
            </div>
        </Fieldset>

        <Sidebar v-model:visible="visibleRight" header="Feature Gallery" position="right">
               
            <div class="w-full px-2 py-1">
                <div class="w-full mr-2">
                    <label for="dd-citwy" class="text-sm w-full"> Feature Icon </label>
                    <FileUpload :pt="{
                            chooseButton: {
                                class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                            },
                            
                        }" mode="basic" type="file" @select="getFeatureIcon" name="icon" accept="image/*" />
                </div>
                <div class="w-full mr-2">
                    <label for="dd-citye" class="text-sm w-full"> Thumbnails</label>
                    <FileUpload :pt="{
                            chooseButton: {
                                class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                            },
                        }" mode="basic" type="file" @select="getFeature" name="feature"  accept="image/*" />
                </div>
                <div class="w-full mr-2">
                    <label for="dd-citye" class="text-sm w-full"> Galleries</label>
                    <FileUpload :pt="{
                            chooseButton: {
                                class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                            },
                        }" mode="basic" @select="selectMultiple" name="gallery" multiple accept="image/*" />
                </div>
            </div>

            <!-- Search Icon -->
            <div class="font-semibold flex mt-2 place-content-end">
                <button class="bg-yellow-600 hover:bg-yellow-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm rounded-md" @click="submitData"> 
                    <Icon name="fluent:search-12-filled"></Icon> Update
                </button>
            </div>
        </Sidebar>
    </div>
</template>