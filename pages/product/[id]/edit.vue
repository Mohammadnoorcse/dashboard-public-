<script setup>
    import { ref } from "vue";
    import InputGroup from 'primevue/inputgroup';
    import InputGroupAddon from 'primevue/inputgroupaddon';
    import TabView from 'primevue/tabview';
    import TabPanel from 'primevue/tabpanel';
    import Table from '@editorjs/table'
    import Header from '@editorjs/header';
    import Quote from '@editorjs/quote';

    import NestedList from '@editorjs/nested-list';

    import Embed from '@editorjs/embed';
    import Delimiter from '@editorjs/delimiter';
    import Warning from '@editorjs/warning';
    import CodeTool from '@editorjs/code';
    import RawTool from '@editorjs/raw';
    // import ImageTool from '@editorjs/image';

    import Marker from '@editorjs/marker';
    import InlineCode from '@editorjs/inline-code';

    import IconField from 'primevue/iconfield';
    import Dropdown from 'primevue/dropdown';
    import FileUpload from 'primevue/fileupload';
    import Fieldset from 'primevue/fieldset';

    import Calendar from 'primevue/calendar';
    
    import RadioButton from 'primevue/radiobutton';


    import MultiSelect from 'primevue/multiselect';
    
    const uploadEditorJS = () => import('@editorjs/editorjs')
    const ImageTool = window.ImageTool;
    const loading = ref('not')
    const Editor = ref(null)
    const editorOldData = ref(null)


    const productName = ref('');
    const flat_rate = ref('');
    const regular_price = ref('');
    const current_price = ref('');
    const dicount = ref(0);
    const dicount_type = ref(1);
    const stock = ref('');
    const seoDescription = ref('');
    const seoTag = ref('');
    const selectedPayment = ref([]);
    const startDate = ref(null);
    const endDate = ref(null);
    const minimumNumber = ref(1);

    const editorUpdateData = ref(null);
    const selectedCategory = ref();
    const selectedBrand = ref();
    const selectedVendor = ref();
    const selectedCountry = ref();
    const selectedDistrict = ref();
    const selectedPolice = ref();
    const selectedStatus = ref();
    const colors = ref('');
    const sizes = ref('');

    const categories = ref([]);
    const brands = ref([]);
    const vendors = ref([]);
    const countries = ref([]);
    const icon = ref('');
    const feature = ref('');
    const gallery = ref([]);
    const districts = ref([]);
    const polices = ref([]);

    const product = ref([]);

    const status = ref([
        { name: 'Active', id: 1 },
        { name: 'Inactive', id: 0 }
    ]);


    const extraFields = ref([]);
    // Add extra field function goes here
    const addMoreField = () => {
        if (!Array.isArray(extraFields.value)) {
            extraFields.value = []; // Initialize as an empty array if it's not already an array
        }
        extraFields.value = [
            ...extraFields.value, 
            {
            field_name: "",
            value: "",
            }
        ];
    };


    // replace with actual API endpoint and master key
    const config = useRuntimeConfig();
    const EndPoint = config.public.baseURl;
    const MasterKey = config.public.masterToken;
    const app_token = useTokenStore().getToken;
    const route = useRoute()

    const headers = ref({
                    "Accept": "application/json",
                    "Authorization": `Bearer ${app_token}`,
                    "App-Master-Key" : `${MasterKey}`
                })

    onMounted( async () => {
        
        try {

            product.value = await $fetch(`${EndPoint}/admin/${MasterKey}/product/${route.params.id}/edit`,
                {
                    method: 'get',
                    headers: headers.value,
                }
            )

            productName.value = product.value.data.name;
            flat_rate.value = product.value.data.shipping_cost;
            regular_price.value = product.value.data.regular_price;
            current_price.value = product.value.data.current_price;
            dicount.value = product.value.data.discount;
            dicount_type.value = product.value.data.discount_type;
            stock.value = product.value.data.stock;
            seoDescription.value = product.value.data.seo_description;
            seoTag.value = product.value.data.seo_tag;
            selectedPayment.value = '';
            startDate.value = product.value.data.start_offer;
            endDate.value = product.value.data.end_offer;
            minimumNumber.value = product.value.data.minimum_order;
            editorOldData.value = product.value.data.description; //Replaced from editorUpdateData
            // gallery.value = product.value.data.gallery; // added gallery in get method
            selectedCategory.value = product.value.data.category;
            selectedBrand.value = product.value.data.brand_id;
            selectedVendor.value = product.value.data.vendor_id;
            selectedCountry.value = product.value.data.country_id;
            selectedDistrict.value = product.value.data.district_id;
            selectedPolice.value = product.value.data.police_station_id;
            selectedStatus.value = product.value.data.status;
            colors.value = product.value.data.attributes.colors;
            sizes.value = product.value.data.attributes.sizes;
            extraFields.value = product.value.data.extend_props


            categories.value = await $fetch(`${EndPoint}/admin/${MasterKey}/category?data=all`, {headers: headers.value});
            brands.value = await $fetch(`${EndPoint}/admin/${MasterKey}/brand?data=all`, {headers:headers.value});
            vendors.value = await $fetch(`${EndPoint}/admin/${MasterKey}/vendor?data=all`, {headers:headers.value});
            countries.value = await $fetch(`${EndPoint}/countries?data=all`, {headers:headers.value});
            getDistrict(selectedCountry);
            getThana(selectedDistrict);
            // console.log(countries);

            console.log("Extra Fields>>>>",extraFields.value)
            loading.value = "success";
        
            const editor = await uploadEditorJS()
            Editor.value = new editor.default({
                placeholder: "write samething here...",
                holder: 'editorjs',
                data: product.value.data.description,
                tools: {

                    
                    inlineCode: {
                        class: InlineCode,
                        shortcut: 'CMD+SHIFT+M',
                    },

                    embed: {
                    class: Embed,
                        config: {
                            services: {
                                youtube: true,
                                coub: true
                            },
                        }
                    },

                    CodeTool: CodeTool,
                    RawTool: RawTool,
                    Delimiter: Delimiter,

                    Marker: {
                        class: Marker,
                        shortcut: 'CMD+SHIFT+M',
                    },

                    warning: {
                        class: Warning,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+W',
                        config: {
                            titlePlaceholder: 'Title',
                            messagePlaceholder: 'Message',
                        },
                    },

                    list: {
                        class: NestedList,
                        inlineToolbar: true,
                        title: 'Bulleted',
                        config: {
                            defaultStyle: 'unordered'
                        },
                    },

                    ordered: {
                        class: NestedList,
                        inlineToolbar: true,
                        config: {
                            defaultStyle: 'ordered'
                        },
                    },

                    table: {
                        class: Table,
                        inlineToolbar: true,
                        Table
                    },
                    header: {
                        class: Header,
                        inlineToolbar: true,
                    },

                    

                }
            })
            console.log("Edit>>>>>",product.value)
        } catch (err) {
        console.log(err)
        }
    })

    const active = ref(0);
    const router = useRouter();
    definePageMeta({
        layout: "dashboard",
        middleware: "auth",
    })


    // Get district by country id
    const getDistrict = async (countryId) => {
        loading.value = "not";
        districts.value = await $fetch(`${EndPoint}/district/${countryId.value}`, {headers:headers.value});
        loading.value = "success"
    }


    // Get district by country id
    const getThana = async (districtId) => {
        loading.value = "not";
        polices.value = await $fetch(`${EndPoint}/police_station/${districtId.value}`, {headers:headers.value});
        loading.value = "success"
    }

    const selectedShipping = ref('area');
    const shippings = ref([
        { name: 'Area Wise', key: 'area' },
        { name: 'Flat Rate', key: 'flat' },
        { name: 'Free Shipping', key: 'Free' }

    ]);


    const payments = ref([
        { name: 'Cash Delivery', code: 'COD', image: '/cod.jpg' },
        { name: 'Bkash Pay', code: 'bkash', image: '/bkash.jpg' },
        { name: 'Nagad Pay', code: 'nagad', image: '/nagad.png' },
        { name: 'Rocket Pay', code: 'rocket', image: '/rocket.png' },
        { name: 'Wallet Pay', code: 'wallet', image: '/wallet.jpg' },
        { name: 'Fund Pay', code: 'fund', image: '/fund.png' },
        { name: 'SSL Commerze', code: 'ssl', image: '/ssl.png' }
        
    ]);


    const getDataEditor = () => {

        Editor.value.save().then((outputData) => {
            editorOldData.value = outputData;
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    }



    // Remove extra field
    const removeMoreField = (index) => {
        extraFields.value.splice(index, 1);
    }


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


    // Get percentage or fixed discount
    const getPercentageOrFixed = (e) => {
        if(e.target.value == 0 ){
            dicount.value = parseFloat(((regular_price.value - current_price.value)/regular_price.value)*100).toFixed(2);
        }else{
            dicount.value = ( regular_price.value - current_price.value);
        }
    }

    // Get discount
    const getDiscount = (e) => {
        dicount.value = ( e.target.value - current_price.value);
    }





    const submitData = async () => {

        loading.value = "not";

        let data = {
            name : productName.value,
            description : editorOldData.value,
            brand_id : selectedBrand.value,
            vendor_id : selectedVendor.value,
            country_id : selectedCountry.value,
            category : selectedCategory.value,
            district_id : selectedDistrict.value,
            police_station_id : selectedPolice.value,
            regular_price : regular_price.value,
            current_price : current_price.value,
            discount : dicount.value,
            discount_type : dicount_type.value,

            icon : icon.value,
            feature : feature.value,
            gallery : gallery.value,
            start_offer : startDate.value,
            end_offer : endDate.value,
            stock : stock.value,
            minimum_order: minimumNumber.value,
            status : selectedStatus.value,
            
            sizes : sizes.value,
            colors : colors.value,

            seo_tag: seoTag.value,
            seo_description: seoDescription.value,
            shipping: selectedShipping.value,
            shipping_cost: flat_rate.value,
            payment_method: selectedPayment.value,

            extend_props :  extraFields.value
            
        }

        const resp = await $fetch(`${EndPoint}/admin/${MasterKey}/product/${route.params.id}`,
            {
                method: 'POST',
                headers:headers.value,
                body: data
            }
        )

        console.log("Response>>>>",resp);
        console.log("Data>>>>",data);
        console.log("Dates>>>", startDate.value)

        router.push('/product');
        loading.value = "success";

    }
    
</script>
<template>
    <NuxtLayout :name="layout">
            <div class="w-full px-3 mt-1">

                <div v-if="loading !== 'success' " class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                    <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
                </div>

                

                    <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                        <div class="flex w-full justify-between bg-gray-400 text-white">
                            
                            <div class="font-semibold mt-1 ml-3">Edit Products</div>
                            <div class="font-semibold ml-1 flex">
                                <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                                    <Icon name="gg:arrow-left-o"></Icon>
                                    Back
                                </button>
                            </div>
                            
                        </div>

                        <!-- Table list goes here -->
                        <div class="h-full overflow-y-auto w-full max-h-[calc(100vh-8.2rem)] flex flex-col bg-gray-100">
                            <form @submit.prevent="submitData" enctype="multipart/form-data">
                                <div class="relative flex flex-grow">
                                    <div class="w-2/12  h-full relative overflow-hidden bg-white">
                                        <div class="flex-grow w-[13.49%] z-10 cursor-pointer bg-white fixed">                                
                                            <div @click="active = 0" :class="`${active == 0 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b border-t py-1 text-left pl-3 mt-3 text-sm hover:bg-gray-100"  >Basic Information</div>
                                            <div @click="active = 1" :class="`${active == 1 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b py-1 text-left pl-3 text-sm hover:bg-gray-100">Attributes/Additional</div>
                                            <!-- <div @click="active = 2" :class="`${active == 2 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b py-1 text-left pl-3 text-sm hover:bg-gray-100">Stock Managment</div> -->
                                            <div @click="active = 3" :class="`${active == 3 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b py-1 text-left pl-3 text-sm hover:bg-gray-100">Galleries</div>
                                            <div @click="active = 4" :class="`${active == 4 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b py-1 text-left pl-3 text-sm hover:bg-gray-100">Shipping Information</div>
                                            <div @click="active = 5" :class="`${active == 5 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b py-1 text-left pl-3 text-sm hover:bg-gray-100">SEO</div>
                                            <div @click="active = 6" :class="`${active == 6 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b py-1 text-left pl-3 text-sm hover:bg-gray-100">Offer</div>
                                            <!-- <div @click="active = 7" :class="`${active == 7 ? 'border-l-4 border-l-red-600 bg-gray-100' : ''}`" class="w-full border-b py-1 text-left pl-3 text-sm hover:bg-gray-100">Payment Method</div> -->
                                        </div>
                                    </div>
                                    <div class="w-10/12 h-full pb-8 py-2 px-6 bg-gray-100">
                                        <TabView unstyled v-model:activeIndex="active">
                                            <TabPanel>
                                                <div class="w-full">
                                                    <label for="dd-city" class="text-sm w-full">Product Name</label>
                                                    <input v-model="productName" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md" type="text" placeholder="Product Name" />
                                                </div>
                                                <div class="w-full mt-1">
                                                    <div class="grid grid-cols-4 gap-2">
                                                        <div>
                                                            <label class="text-sm w-full">Current Price</label>
                                                            <input v-model="current_price" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md" type="text" placeholder="Current Price" />
                                                        </div>

                                                        <div>
                                                            <label class="text-sm w-full">Regular Price</label>
                                                            <input v-model="regular_price" @keyup="getDiscount" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md" type="text" placeholder="Regular Price" />
                                                        </div>

                                                        <div>
                                                            <label  class="text-sm w-full">Discount Type</label>
                                                            <select @change="getPercentageOrFixed" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md">
                                                                <option SELECTED value="1">Fixed</option>
                                                                <option value="0">Percentage</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label class="text-sm w-full">Discount</label>
                                                            <input v-model="dicount" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md" type="text" placeholder="Discount" />
                                                        </div>

                                                        
                                                        
                                                        
                                                    </div>
                                                    <div class="grid grid-cols-4 gap-2">
                                                        <div>
                                                            <label for="dd-city" class="text-sm w-full">Brand</label>
                                                            <Dropdown v-model="selectedBrand" editable :options="brands" optionValue="id" optionLabel="name" placeholder="Select a Brand" />
                                                        </div>

                                                        <div class="categories">
                                                            <label for="categories" class="text-sm w-full">Category</label>
                                                            <MultiSelect :pt="{
                                                                itemCheckbox : {
                                                                    class: 'shadow-md shadow-cyan-500'
                                                                }
                                                            }" v-model="selectedCategory" :options="categories" filter optionValue="id" optionLabel="name" placeholder="Select a Category" />
                                                        </div>

                                                        <div>
                                                            <label for="dd-city" class="text-sm w-full">Vendor Id</label>
                                                            <Dropdown v-model="selectedVendor" editable :options="vendors" optionValue="id" optionLabel="name" placeholder="Select a Vendor" />
                                                        </div>
                                                        <div>
                                                            <label for="dd-city" class="text-sm w-full">Country</label>
                                                            <Dropdown v-model="selectedCountry" editable :options="countries" @change="getDistrict" optionValue="id" optionLabel="name" placeholder="Select a Country" />
                                                        </div>
                                                        
                                                        
                                                    </div>
                                                </div>
                                                <div class="w-full mt-1">
                                                    <div class="grid grid-cols-4 gap-2">

                                                        <div>
                                                            <label for="dd-city" class="text-sm w-full">District</label>
                                                            <Dropdown v-model="selectedDistrict" editable :options="districts" @change="getThana" optionValue="id"  optionLabel="name" placeholder="Select a District" />
                                                        </div>

                                                        <div>
                                                            <label for="dd-city" class="text-sm w-full">Police Station / Thana</label>
                                                            <Dropdown v-model="selectedPolice" editable :options="polices" optionValue="id" optionLabel="name" placeholder="Select a Police Station / Thana" />
                                                        </div>

                                                        <div>
                                                            <label for="dd-city" class="text-sm w-full">Status</label>
                                                            <Dropdown v-model="selectedStatus" editable :options="status" :value="status.name" optionValue="id" optionLabel="name" placeholder="Select a Status" />
                                                        </div>

                                                        <div class="w-full">
                                                            <label for="dd-city" class="text-sm w-full">Total Stock</label>
                                                            <input v-model="stock" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md" type="number" placeholder="Stock" />
                                                        </div>
                                                        
                                                    </div>  
                                                </div>  

                                                <div class="w-full mt-2">
                                                    <label for="dd-city" class="text-sm w-full">Product Description</label>
                                                    <div id="editorjs" @keyup="getDataEditor()" class="w-full bg-white text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" ></div>
                                                </div>
                                            </TabPanel> 
                                            <!-- Basic Information -->

                                            <TabPanel>
                                                <div class="grid grid-rows-2 gap-2">
                                                    <div class="w-1/2 pr-1">
                                                        <label for="dd-city" class="text-sm w-full pl-1">Color</label>
                                                        <input v-model="colors" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md" type="text" placeholder="Example: White,Black" />
                                                        <div class="text-[10px] text-red-400 pl-1">Color name must be comma (,) separator</div>
                                                    </div>
                                                    <div class="w-1/2">
                                                        <label for="dd-city" class="text-sm w-full">Size</label>
                                                        <input v-model="sizes" class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md" type="text" placeholder="Example: S,M" />
                                                        <div class="text-[10px] text-red-400 pl-1">Size name must be comma (,) separator</div>
                                                    </div>
                                                </div>

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
                                                                <input type="text" v-model="extra.field_name"  class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                                            </div>
                                                            <div class="w-full mr-2">
                                                                <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                                                <input type="text" v-model="extra.value" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                                            </div>
                                                            <div class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreField(index)"><Icon class="text-white" name="humbleicons:times"></Icon></div>
                                                            
                                                        </div>


                                                    </Fieldset>
                                                    
                                                </div>

                                            </TabPanel>
                                            <!-- Additional Information -->
                                            <TabPanel>
                                                <!-- <div class="mb-2 mt-1 grid grid-cols-3 gap-2 " v-for="color in colors.split(',')" :key="color">
                                                    <ProductCard @addItionalData="additionalItems" v-for="size in sizes.split(',')" :key="size" :size="size" :color="color" />
                                                </div> -->
                                                
                                            </TabPanel>
                                            <!-- Stock Management -->
                                            <TabPanel>
                                                <div class="flex w-full px-2 py-1">
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
                                            </TabPanel>
                                            <!-- Galleries Information -->
                                            <TabPanel>
                                                <div class="mt-1">
                                                    <div v-for="shipping in shippings" :key="shipping.key" class="flex mb-3 align-items-center">
                                                        <RadioButton v-model="selectedShipping" :inputId="shipping.key" name="dynamic" :value="shipping.key" />
                                                        <label :for="shipping.key"  class="ml-2">{{ shipping.name }}</label>
                                                    </div>

                                                    <input class="py-1 px-4 rounded-md outline-none focus:border-green-200 border" v-model="flat_rate" placeholder="1.00" type="text" v-if="'flat' == selectedShipping">
                                                </div>
                                            </TabPanel>
                                            <!-- Shipping Information -->

                                            <TabPanel>
                                                <div class="mt-1 flex-col flex">
                                                    <label for="seo_meta" class="text-sm w-3/5">SEO Tag</label>
                                                    <input v-model="seoTag" class="w-3/5 py-1 px-4 rounded-md outline-none focus:border-green-200 border"  placeholder="Title" type="text">
                                                    <div class="text-[10px] text-red-400 pl-1">Tag name must be comma (,) separator</div>
                                                </div>
                                                <div class="mt-3 flex-col flex">
                                                    <label for="seo_meta" class="text-sm w-3/5">SEO Short Decription</label>
                                                    <textarea v-model="seoDescription" rows="6" class="w-3/5 resize-none py-1 px-4 rounded-md outline-none focus:border-green-200 border" placeholder="SEO Short Decription"/>
                                                </div>
                                            </TabPanel>
                                            <!-- SEO Information -->
                                            <TabPanel>
                                                <div class="mt-1 flex-col flex">
                                                    <label for="seo_meta" class="text-sm w-3/5">Start Date</label>
                                                    <Calendar :pt="{
                                                        input: {
                                                            class: 'px-4 py-1 border'
                                                        }
                                                    }" class="w-3/5 py-1" d="calendar-24h" v-model="startDate" showTime hourFormat="24" />
                                                </div>
                                                <div class="mt-1 flex-col flex">
                                                    <label for="seo_meta" class="text-sm w-3/5">End Date</label>
                                                    <Calendar :pt="{
                                                        input: {
                                                            class: 'px-4 py-1 border'
                                                        }
                                                    }" class="w-3/5 py-1" v-model="endDate" id="calendar-24h" showTime hourFormat="24" />
                                                </div>

                                                <div class="mt-1 flex-col flex">
                                                    <label for="seo_meta" class="text-sm w-3/5">Minimum Order</label>
                                                    <input v-model="minimumNumber" class="w-3/5 py-1 px-4 rounded-md outline-none focus:border-green-200 border"  placeholder="Minimum Number" type="number">
                                                </div>
                                                
                                            </TabPanel>
                                            <!-- <TabPanel>
                                                <ProductPay :payments="payments" />
                                            </TabPanel> -->
                                        </TabView>
                                        
                                    </div>

                                </div>
                                <div class="fixed bottom-9 w-[13.5%]">
                                    <button type="submit" class="rounded-bl-md bg-yellow-600 hover:font-semibold hover:bg-yellow-500 text-gray-100 hover:text-black w-full px-4 py-2">
                                        Update <Icon name="fa6-solid:paper-plane"/>
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                    </div> <!-- Header Div  -->

                    
                
            </div>
        </NuxtLayout>
</template>