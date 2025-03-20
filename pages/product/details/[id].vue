<script setup>
    import { ref } from "vue";
    import Card from 'primevue/card';

    import TabView from 'primevue/tabview';
    import TabPanel from 'primevue/tabpanel';
    
    import Rating from 'primevue/rating';

    const route = useRoute()

    const data = ref([])
    const rattingsValue = ref(4)
    const product = ref([])
    const customTabStyle = ref(
        {
            headerTitle: {
                class: 'text-red-500'
            },

            headerAction:{
                class: "text-black"
            }

        }
    )

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

    

    const additionals =  ref({})
    const medias =  ref({})
    const attributes =  ref('')
    const vendor =  ref({})
    const categories =  ref({})
    const brand =  ref({})
    const country =  ref({})
    const district =  ref({})
    const police_station =  ref({})

    onMounted( async () => {
        try {

            product.value = await $fetch(`${EndPoint}/admin/${MasterKey}/product/${route.params.id}`,
                {
                    method: 'get',
                    headers: headers.value,
                }
            )

            additionals.value = product.value.data.additional;
            attributes.value = product.value.data.attributes.colors;
            medias.value = [
                ...product.value.data.additional_media,
                {
                    color_galleries : product.value.data.gallery,
                    color_thumbnails : product.value.data.feature,
                    color_icon : product.value.data.icon,
                    slug : product.value.data.id+'_General',
                }

            ];
            vendor.value = product.value.data.vendor;
            categories.value = product.value.data.categories;
            brand.value = product.value.data.brand;
            country.value = product.value.data.country;
            district.value = product.value.data.district;
            police_station.value = product.value.data.police_station;
            data.value = product.value.data.description;

            console.log("Single Product>>>>",product.value.data);

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
            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between bg-gray-400 text-white">
                    <div class="font-semibold mt-1 ml-3">Product Details</div>
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
                            <ProductGallery :additional="additional"/>
                        </div>
                    </div>

                    <div class="w-full mt-3">
                        <div class="w-full" :key="indexKey">
                            <ProductSizes :additionals="additionals" :color="color" :key="indexKey"/>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-2 mt-3 ">
                        <div class="w-full border rounded-md p-2 bg-white">
                            <div class="w-full text-sm"><b>Vendor:</b> {{ vendor?.name }}</div>
                            <div class="w-full text-sm"><b>Total Sale:</b> 11</div>
                            <div class="w-full text-sm"><b>Total Return:</b> 1</div>
                            <div class="w-full text-sm"><b>Ratting:</b> 4.1 <Icon name="noto:star"/></div>
                        </div>
                        <div class="w-full border rounded-md p-2">
                            <div class="w-full text-sm"><b>Categories: </b>
                                <span v-for="(category, index) in categories" :key="index"> {{ category.name }}<small v-if="categories.length > index+1">, </small> </span>
                            </div>
                        </div>
                        <div class="w-full border rounded-md p-2">
                            <div class="w-full text-sm"><b>Brand:</b> {{ brand?.name }}</div>
                        </div>
                        <div class="w-full border rounded-md p-2">
                            <div class="w-full text-sm"><b>Countries:</b> {{ country?.name }}</div>
                            <div class="w-full text-sm"><b>District:</b> {{ district?.name }}</div>
                            <div class="w-full text-sm"><b>Thana/Police:</b> {{ police_station?.name }}</div>
                        </div>
                    </div>

                    <!-- Tab start -->
                    <div class="w-full mt-4">
                        <div class="card">
                            <TabView >
                                <TabPanel header="Details" :pt="customTabStyle">

                                    <div class="w-full" v-for="(item, label, indexKey) in data.blocks" :key="indexKey">
                                        <div v-if="item.type == 'header' && item.data.level == '1'">
                                            <h1 class="font-bold text-xl">{{ item.data.text }} </h1>
                                        </div>
                                        <div v-else-if="item.type == 'header' && item.data.level == '2'">
                                            <h2 class="font-bold text-lg">{{ item.data.text }} </h2>
                                        </div>
                                        <div v-else-if="item.type == 'header' && item.data.level == '3'">
                                            <h3 class="font-bold text-md">{{ item.data.text }} </h3>
                                        </div>
                                        <div v-else-if="item.type == 'header' && item.data.level == '4'">
                                            <h4 class="font-bold text-sm">{{ item.data.text }} </h4>
                                        </div>
                                        <div v-else-if="item.type == 'header' && item.data.level == '5'">
                                            <h5 class="font-bold text-xs">{{ item.data.text }} </h5>
                                        </div>
                                        <div v-else-if="item.type == 'header' && item.data.level == '6'">
                                            <h6 class="font-semibold text-xs">{{ item.data.text }} </h6>
                                        </div>

                                        <p class="mb-3" v-else-if="item.type == 'paragraph'" v-html="item.data.text"></p>

                                        <ol class="mb-3 list-decimal pl-6" v-else-if="item.type == 'ordered' && item.data.style == 'ordered'">
                                            <li class="mb-1" v-for="(list, index) in item.data.items" :key="index">
                                                {{ list.content }}
                                            </li>
                                        </ol>

                                        <ul class="mb-3 list-disc pl-6" v-else-if="item.type == 'list' && item.data.style == 'unordered'">
                                            <li class="mb-1" v-for="(list, index) in item.data.items" :key="index">
                                                {{ list.content }}
                                            </li>
                                        </ul>

                                        <table class="mb-3 list-disc pl-6 table w-full table-auto border-collapse border border-slate-400" v-else-if="item.type == 'table'">
                                            <tr class="mb-1" v-for="(contents, index) in item.data.content" :key="index">
                                                <td class="border border-slate-300 py-1 px-3" v-for="(content, index) in contents" :key="index" v-html="content"></td>
                                            </tr>
                                        </table>

                                        <div v-else-if="item.type == 'CodeTool'" >
                                            {{ item.data.code }}
                                        </div>

                                        <div v-else-if="item.type == 'RawTool'" >
                                            {{ item.data.html }}
                                        </div>

                                        
                                        
                                        <iframe v-if="item.type == 'Embed'" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" frameborder="0" :width="item.data.width" :height="item.data.height" :src="item.data.embed"></iframe>
                                       
                                    </div>
                                    
                                </TabPanel>
                                <TabPanel header="Feedback" :pt="customTabStyle">
                                    
                                    <div class="card border w-full p-3 rounded-md mb-3">
                                        <div class="flex flex-col gap-1">
                                                <div class="flex">
                                                    <Avatar icon="pi pi-user" class="mr-2" size="large" />
                                                    <div class="w-full">
                                                        <h2 class="font-bold text-lg">Md Majadul Islam</h2>
                                                        <Rating v-model="rattingsValue" :pt="{
                                                            onIcon: {
                                                                class: 'text-yellow-400'
                                                            }
                                                        }" readonly :cancel="false" />
                                                        
                                                    </div>
                                                </div>
                                                <div class="w-full flex">
                                                    <p class="text-sm text-black text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor autem aliquam quas explicabo quis ipsum, pariatur numquam sequi nemo. Eligendi obcaecati consectetur assumenda illum, possimus nostrum nulla in commodi alias itaque quam error voluptatum mollitia dignissimos et numquam, molestias culpa quod labore neque atque doloremque dolore. Laudantium inventore soluta accusamus modi alias quis, aliquam est voluptate sed reprehenderit obcaecati neque! Sint voluptas natus, non error enim et vel alias  -> <i class="text-xs text-gray-400">on December 2023</i></p> 
                                                </div>
                                        </div>
                                    </div>

                                    <div class="card border w-full p-3 rounded-md ">
                                        <div class="flex flex-col gap-1">
                                                <div class="flex">
                                                    <Avatar icon="pi pi-user" class="mr-2" size="large" />
                                                    <div class="w-full">
                                                        <h2 class="font-bold text-lg">Md Majadul Islam</h2>
                                                        <Rating v-model="rattingsValue" :pt="{
                                                            onIcon: {
                                                                class: 'text-yellow-400'
                                                            }
                                                        }" readonly :cancel="false" />
                                                        
                                                    </div>
                                                </div>
                                                <div class="w-full flex">
                                                    <p class="text-sm text-black text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor autem aliquam quas explicabo quis ipsum, pariatur numquam sequi nemo. Eligendi obcaecati consectetur assumenda illum, possimus nostrum nulla in commodi alias itaque quam error voluptatum mollitia dignissimos et numquam, molestias culpa quod labore neque atque doloremque dolore. Laudantium inventore soluta accusamus modi alias quis, aliquam est voluptate sed reprehenderit obcaecati neque! Sint voluptas natus, non error enim et vel alias  -> <i class="text-xs text-gray-400">on December 2023</i></p> 
                                                </div>
                                        </div>
                                    </div>

                                </TabPanel>
                                
                            </TabView>
                        </div>
                    </div>

                </div>


                

            </div>
        </div>
    </NuxtLayout>
</template>