<script setup>
    import Card from 'primevue/card';

    const products = ref([]);
    const loading = ref('not');
    // replace with actual API endpoint and master key
    const config = useRuntimeConfig();
    const EndPoint = config.public.baseURl;
    const MasterKey = config.public.masterToken;
    const app_token = useTokenStore().getToken;

    const headers = ref({
        "Accept": "application/json",
        "Authorization": `Bearer ${app_token}`,
        "App-Master-Key": `${MasterKey}`
    })

    

    const router = useRoute();

    definePageMeta({
        layout: "dashboard",
        middleware: "auth",
    });

    // console.log(router.currentRoute.value.params);

    onMounted(async () => {

        try {
            products.value = await $fetch(`${EndPoint}/admin/${MasterKey}/additional/${router.params.id}`,
                {
                    method: 'get',
                    headers: headers.value,
                }
            )

            loading.value = "success";


        } catch (err) {
            console.log(err)
        }

    })


    const getUpdate = async (product) => {

        console.log("hello");

        loading.value = "not";
        try {
            let response = await $fetch(`${EndPoint}/admin/${MasterKey}/additional/${product.additional_key}`,
                {
                    method: 'post',
                    headers: headers.value,

                    body: {
                        regular_price   : product.regular_price,
                        current_price   : product.current_price,
                        discount        : product.discount,
                        discount_type   : parseInt(product.discount_type),
                        status          : product.status,
                        stock           : product.stock,
                        stock_status    : product.stock_status
                    }
                }
            )

            loading.value = "success";


        } catch (err) {
            console.log(err)
        }
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
                    <div class="font-semibold mt-1 ml-3">Additional Products</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>
                    
                </div>
                <div class="h-[calc(100vh-8.2rem)] overflow-y-auto">
                    <div class="grid grid-cols-4 w-full gap-2 p-3">
                        <ProductCard class="w-full rounded-md" @update="getUpdate" v-for="(product, index) in products" :addionalData="product" :key="index"/>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>