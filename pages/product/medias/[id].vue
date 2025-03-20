<script setup>


    const route = useRoute()

    const loading = ref('not')
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

    const medias =  ref({})
    const product =  ref({})

    onMounted( async () => {
        loading.value = "not";
        try {

            product.value = await $fetch(`${EndPoint}/admin/${MasterKey}/product/${route.params.id}`,
                {
                    method: 'get',
                    headers: headers.value,
                }
            )

            medias.value = product.value.data.additional_media,
                

            loading.value = "success";

        } catch (err) {
            console.log(err)
        }
    })


    definePageMeta({
        layout: "dashboard",
        middleware: "auth",
    })

</script>

<template>

<NuxtLayout :name="layout">
        <div class="w-full px-3 mt-1">
            <div v-if="loading !== 'success' " class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
            </div>


            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between bg-gray-400 text-white">
                    <div class="font-semibold mt-1 ml-3">Product Feature Image</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>                    
                </div>


                <div class="h-full overflow-y-auto p-4 w-full max-h-[calc(100vh-8.2rem)] flex flex-col bg-gray-100">
                    
                    <div class="grid grid-cols-4 gap-2">
                        <div v-for="(additional, key, indexKey) in medias" :key="indexKey">
                            <ProductEditGallery :additional="additional"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>

</template>