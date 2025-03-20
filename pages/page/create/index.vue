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
const selectedStatus = ref();
const selectedLayout = ref(1);


const active = ref(0);
const router = useRouter();

const status = ref([
    { name: 'Active', id: 1 },
    { name: 'Inactive', id: 0 }
]);
const itemLayout = ref([
    { name: 'Default', id: 1 },
    { name: 'None', id: 0 }
]);

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
})



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

onMounted(async () => {

    try {



        loading.value = "success";

        const editor = await uploadEditorJS()
        Editor.value = new editor.default({
            placeholder: "write samething here...",
            holder: 'editorjs',
            data: editorOldData.value,
            tools: {


                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+M',
                },

                Embed: Embed,
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
    } catch (err) {
        console.log(err)
    }
})






const getDataEditor = () => {

    Editor.value.save().then((outputData) => {
        editorOldData.value = outputData;
    }).catch((error) => {
        console.log('Saving failed: ', error)
    });
}



const extraFields = ref([]);

// Add extra field function goes here
const addMoreField = () => {
    extraFields.value = [
        ...extraFields.value, {
            field_name: "",
            value: "",
        }
    ];
}

// Remove extra field
const removeMoreField = (index) => {
    extraFields.value.splice(index, 1);
}



const submitData = async () => {

    loading.value = "not";

    let data = {
        name: productName.value,
        description: editorOldData.value,
        status: selectedStatus.value,
        layout: selectedLayout.value,
        extend_props: extraFields.value

    }


    const resp = await $fetch(`${EndPoint}/admin/${MasterKey}/page`,
        {
            method: 'POST',
            headers: headers.value,
            body: data
        }
    )

    console.table(resp);
    router.push('/page');
    loading.value = "success";

}

</script>
<template>
    <NuxtLayout :name="layout">
        <div class="w-full px-3 mt-1">

            <!-- <div v-if="loading !== 'success' " class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                    <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
                </div> -->



            <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                <div class="flex w-full justify-between bg-gray-400 text-white">

                    <div class="font-semibold mt-1 ml-3">Add Page</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()"
                            class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>

                </div>

                <!-- Table list goes here -->
                <div class="h-full overflow-y-auto w-full max-h-[calc(100vh-8.2rem)] flex flex-col bg-gray-100">
                    <form @submit.prevent="submitData" enctype="multipart/form-data">
                        <div class="relative flex flex-grow">

                            <div class="w-10/12 h-full pb-8 py-2 px-6 bg-gray-100">

                                <div class="w-full">
                                    <label for="dd-city" class="text-sm w-full">Name</label>
                                    <input v-model="productName"
                                        class="w-full text-sm border py-1 px-2 outline-none focus:border-green-200 rounded-md"
                                        type="text" placeholder="Name" />
                                </div>

                                <div class="w-full mt-2">
                                    <label for="dd-city" class="text-sm w-full">Description</label>
                                    <div id="editorjs" @keyup="getDataEditor()"
                                        class="w-full bg-white text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                                    </div>
                                </div>


                            </div>

                            <div class="w-2/12  h-[80vh] relative overflow-auto bg-white">
                                <div
                                    class=" w-2/12  h-[80vh] overflow-auto flex-grow w-[13.49%] z-10 cursor-pointer bg-white fixed">
                                    <!-- status -->

                                    <div class="flex flex-col gap-1">
                                        <div class="w-full text-left pl-3 mt-3 text-sm hover:bg-gray-100">
                                            Status
                                        </div>

                                        <div class="w-full py-1 text-left pl-3 text-sm flex-col">
                                            <Dropdown v-model="selectedStatus" editable :options="status"
                                                :value="status.name" optionValue="id" optionLabel="name"
                                                placeholder="Select a Status" />
                                        </div>
                                    </div>

                                    <!-- layout -->

                                    <div class="flex flex-col gap-1">
                                        <div class="w-full text-left pl-3 mt-3 text-sm hover:bg-gray-100">
                                            Layout
                                        </div>

                                        <div class="w-full py-1 text-left pl-3 text-sm flex-col">
                                            <Dropdown v-model="selectedLayout" editable :options="itemLayout"
                                                :value="itemLayout.name" optionValue="id" optionLabel="name"
                                                placeholder="Select a Layout" />
                                        </div>
                                    </div>



                                    <!-- extra props -->

                                    <div class="flex flex-col gap-1">
                                        <div class="w-full text-left pl-3 mt-3 text-sm hover:bg-gray-100">
                                            Extra Props
                                        </div>

                                        <div class="w-full py-1 text-left pl-3 text-sm flex-col">
                                            <div class="grid grid-col gap-2 mt-2">
                                                <Fieldset legend="Extra Props" :pt="{
                                                    root: {
                                                        class: 'border p-2'
                                                    },
                                                    legend: {
                                                        class: 'p-0 m-0'
                                                    },
                                                    togglerIcon: {

                                                    }
                                                }">
                                                    <template #legend>
                                                        <div class="flex align-items-center pl-2">
                                                            <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer"
                                                                @click="addMoreField">Add More <Icon
                                                                    name="mdi:table-add" width="1.4em" height="1.4em">
                                                                </Icon>
                                                            </div>

                                                        </div>
                                                    </template>

                                                    <div class="flex flex-col gap-2 w-full px-1 py-1 pb-7"
                                                        v-for="(extra, index) in extraFields" :key="index">
                

                                                        <div class="w-full flex flex-col gap-1">
                                                            <!-- <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname">
                                                                Field Name <Icon name="clarity:info-solid"></Icon>
                                                            </label> -->
                                                            <div class="flex justify-center items-center">
                                                                <label for="dd-citwy" class="text-sm w-full"
                                                                    title="Use field name like: filedName, field_name or filedname">
                                                                    Field Name <Icon name="clarity:info-solid"></Icon>
                                                                </label>

                                                                <div class="bg-red-500 w-6 h-6  p-2 rounded-md  cursor-pointer flex justify-center items-center "
                                                                    @click="removeMoreField(index)">
                                                                    <Icon class="text-white text-center"
                                                                        name="humbleicons:times"></Icon>
                                                                </div>
                                                            </div>

                                                            <input type="text" v-model="extra.field_name"
                                                                class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                                                                placeholder="Field Name" />

                                                        </div>

                                                        <div class="w-full">
                                                            <label for="dd-citye" class="text-sm w-full"> Field
                                                                Value</label>
                                                            <input type="text" v-model="extra.value"
                                                                class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
                                                                placeholder="Field Value" />
                                                        </div>
                                                        <!-- <div class="flex justify-end">
                                                            <div class="bg-red-500 w-7 h-7  p-2 rounded-md  cursor-pointer flex justify-center items-center "
                                                            @click="removeMoreField(index)">
                                                            <Icon class="text-white text-center"
                                                                name="humbleicons:times"></Icon>
                                                        </div>
                                                        </div> -->


                                                    </div>


                                                </Fieldset>

                                            </div>
                                        </div>
                                    </div>




                                    <!-- <div class="w-full border-b py-1 text-left pl-3 text-sm ">
                                            <label for="dd-city" class="text-sm w-full">Layout</label>
                                            <Dropdown v-model="selectedStatus" editable :options="status" :value="status.name" optionValue="id" optionLabel="name" placeholder="Select a Status" />
                                        </div> -->

                                </div>
                            </div>

                        </div>
                        <div class="fixed bottom-9 right-3 w-[13.5%]">
                            <button type="submit"
                                class="rounded-bl-md bg-cyan-600 hover:font-semibold hover:bg-cyan-500 text-gray-100 hover:text-black w-full px-4 py-2">
                                Submit
                                <Icon name="fa6-solid:paper-plane" />
                            </button>
                        </div>
                    </form>
                </div>

            </div> <!-- Header Div  -->



        </div>
    </NuxtLayout>
</template>