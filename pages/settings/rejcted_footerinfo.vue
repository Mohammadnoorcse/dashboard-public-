<script setup>
import { ref } from "vue";
import Fieldset from 'primevue/fieldset';

// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;

const loading = ref('not')
const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
});


const extraProps = ref({
        field_name: "",
        value: "",
        group: ""
});

const SupportextraFields = ref([
        {
            SupportfieldName: "",
            SupportfieldValue: "",
            SupportfieldGroup: "Support",
        },
        {
            SupportfieldName: "",
            SupportfieldValue: "",
            SupportfieldGroup: "Support",
        },
        {
            SupportfieldName: "",
            SupportfieldValue: "",
            SupportfieldGroup: "Support",
        }
]);

// Add extra support field function goes here
const addMoreSupportField = () => {
            SupportextraFields.value = [
            ...SupportextraFields.value, {
                SupportfieldName: "",
                SupportfieldValue: "",
                SupportfieldGroup: "Support",
        }
    ];
}

// Remove extra support field
const removeMoreSupportField = (index) => {
        SupportextraFields.value.splice(index, 1);
}

const SocialMediaExtraFields = ref([
    {
        SocialMediaFieldName: "",
        SocialMediaFieldValue: "",
        SocialMediaFieldGroup: "SocialMedia",
    },
    {
        SocialMediaFieldName: "",
        SocialMediaFieldValue: "",
        SocialMediaFieldGroup: "SocialMedia",
    },
    {
        SocialMediaFieldName: "",
        SocialMediaFieldValue: "",
        SocialMediaFieldGroup: "SocialMedia",
    }
]);

// Add extra SocialMedia field function
const addMoreSocialMediaField = () => {
    SocialMediaExtraFields.value = [
        ...SocialMediaExtraFields.value,
        {
            SocialMediaFieldName: "",
            SocialMediaFieldValue: "",
            SocialMediaFieldGroup: "SocialMedia",
        }
    ];
};

// Remove extra SocialMedia field
const removeMoreSocialMediaField = (index) => {
    SocialMediaExtraFields.value.splice(index, 1);
};

const QuickLinksExtraFields = ref([
    {
        QuickLinksFieldName: "",
        QuickLinksFieldValue: "",
        QuickLinksFieldGroup: "QuickLinks",
    },
    {
        QuickLinksFieldName: "",
        QuickLinksFieldValue: "",
        QuickLinksFieldGroup: "QuickLinks",
    },
    {
        QuickLinksFieldName: "",
        QuickLinksFieldValue: "",
        QuickLinksFieldGroup: "QuickLinks",
    }
]);

// Add extra QuickLinks field function
const addMoreQuickLinksField = () => {
    QuickLinksExtraFields.value = [
        ...QuickLinksExtraFields.value,
        {
            QuickLinksFieldName: "",
            QuickLinksFieldValue: "",
            QuickLinksFieldGroup: "QuickLinks",
        }
    ];
};

// Remove extra QuickLinks field
const removeMoreQuickLinksField = (index) => {
    QuickLinksExtraFields.value.splice(index, 1);
};

const ExclusiveExtraFields = ref([
    {
        ExclusiveFieldName: "",
        ExclusiveFieldValue: "",
        ExclusiveFieldGroup: "Exclusive",
    },
    {
        ExclusiveFieldName: "",
        ExclusiveFieldValue: "",
        ExclusiveFieldGroup: "Exclusive",
    },
    {
        ExclusiveFieldName: "",
        ExclusiveFieldValue: "",
        ExclusiveFieldGroup: "Exclusive",
    }
]);

// Add extra Exclusive field function
const addMoreExclusiveField = () => {
    ExclusiveExtraFields.value = [
        ...ExclusiveExtraFields.value,
        {
            ExclusiveFieldName: "",
            ExclusiveFieldValue: "",
            ExclusiveFieldGroup: "Exclusive",
        }
    ];
};

// Remove extra Exclusive field
const removeMoreExclusiveField = (index) => {
    ExclusiveExtraFields.value.splice(index, 1);
};

const OtherInformationExtraFields = ref([
    {
        OtherInformationFieldName: "",
        OtherInformationFieldValue: "",
        OtherInformationFieldGroup: "OtherInformation",
    },
    {
        OtherInformationFieldName: "",
        OtherInformationFieldValue: "",
        OtherInformationFieldGroup: "OtherInformation",
    },
    {
        OtherInformationFieldName: "",
        OtherInformationFieldValue: "",
        OtherInformationFieldGroup: "OtherInformation",
    }
]);

// Add extra OtherInformation field function
const addMoreOtherInformationField = () => {
    OtherInformationExtraFields.value = [
        ...OtherInformationExtraFields.value,
        {
            OtherInformationFieldName: "",
            OtherInformationFieldValue: "",
            OtherInformationFieldGroup: "OtherInformation",
        }
    ];
};

// Remove extra OtherInformation field
const removeMoreOtherInformationField = (index) => {
    OtherInformationExtraFields.value.splice(index, 1);
};

const web_settings = ref([])


onMounted(async () => {
    try {
        web_settings.value = await $fetch(`${EndPoint}/admin/${MasterKey}/web_settings`, {
            method: 'get',
            headers: headers.value,
        });

        loading.value = "success";
        console.log(web_settings.value);
    } catch (err) {
        console.log(err);
    }
});

const sendextraPropsData = async () => {
    try {
        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/web_settings`, {
            method: 'post',
            headers: headers.value,
            body: JSON.stringify(extraProps.value),
        });

        console.log(response);
    } catch (err) {
        console.log(err);
    }
};

// Support Information Submit
const SupportdataSubmit = () => {
    SupportextraFields.value.forEach((field) => {
        extraProps.value.field_name = [
            ...(extraProps.value.field_name || []),
            field.SupportfieldName
        ];

        extraProps.value.value = [
            ...(extraProps.value.value || []),
            field.SupportfieldValue
        ];

        extraProps.value.group = [
            ...(extraProps.value.group || []),
            field.SupportfieldGroup
        ];
    });
    sendextraPropsData();
    // console.log(web_settings.value);
}

// SocialMedia Information Submit
const SocialMediaDataSubmit = () => {
    SocialMediaExtraFields.value.forEach((field) => {
        extraProps.value.field_name = [
            ...(extraProps.value.name || []),
            field.SocialMediaFieldName
        ];

        extraProps.value.value = [
            ...(extraProps.value.value || []),
            field.SocialMediaFieldValue
        ];

        extraProps.value.group = [
            ...(extraProps.value.group || []),
            field.SocialMediaFieldGroup
        ];
    });
    // console.log(extraProps);
    sendextraPropsData();
    // console.log(web_settings.value);
};

// QuickLinks Information Submit
const QuickLinksDataSubmit = () => {
    QuickLinksExtraFields.value.forEach((field) => {
        extraProps.value.field_name = [
            ...(extraProps.value.field_name || []),
            field.QuickLinksFieldName
        ];

        extraProps.value.value = [
            ...(extraProps.value.value || []),
            field.QuickLinksFieldValue
        ];

        extraProps.value.group = [
            ...(extraProps.value.group || []),
            field.QuickLinksFieldGroup
        ];
    });

    // console.log(extraProps);
    sendextraPropsData();
    // console.log(web_settings.value);
};

// Exclusive Information Submit
const ExclusiveDataSubmit = () => {
    ExclusiveExtraFields.value.forEach((field) => {
        extraProps.value.field_name = [
            ...(extraProps.value.field_name || []),
            field.ExclusiveFieldName
        ];

        extraProps.value.value = [
            ...(extraProps.value.value || []),
            field.ExclusiveFieldValue
        ];

        extraProps.value.group = [
            ...(extraProps.value.group || []),
            field.ExclusiveFieldGroup
        ];
    });

    // console.log(extraProps);
    sendextraPropsData();
    // console.log(web_settings.value);
};

// Other Information Submit
const OtherInformationDataSubmit = () => {
    OtherInformationExtraFields.value.forEach((field) => {
        extraProps.value.field_name = [
            ...(extraProps.value.field_name || []),
            field.OtherInformationFieldName
        ];

        extraProps.value.value = [
            ...(extraProps.value.value || []),
            field.OtherInformationFieldValue
        ];

        extraProps.value.group = [
            ...(extraProps.value.group || []),
            field.OtherInformationFieldGroup
        ];
    });

    // console.log(extraProps);
    sendextraPropsData();
    // console.log(web_settings.value);
};

</script>
<template>
<NuxtLayout :name="layout">
<div class="w-full px-3 mt-1">
    <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
        {{ web_settings.data}}
    <div class="flex w-full justify-between  bg-gray-400 text-white">
        <div class="font-semibold mt-1 ml-3">Create Footer Information</div>
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
            <div class="w-2/3">
                <form  @submit.prevent="SupportdataSubmit">
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
                                <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer" @click="addMoreSupportField">Add More <Icon name="mdi:table-add" width="1.4em" height="1.4em"></Icon></div>
                                <span class="font-bold">Support Information</span>
                            </div>
                        </template>
                            
                            <div class="flex w-full px-2 py-1" v-for="(extra, index) in SupportextraFields" :key="index">
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname"> Field Name <Icon name="clarity:info-solid"></Icon></label>
                                    <input type="text" v-model="extra.SupportfieldName"  class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Support Field Name"/>
                                </div>
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                    <input type="text" v-model="extra.SupportfieldValue" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Support Field Value"/>
                                </div>
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Group</label>
                                    <input type="text" v-model="extra.SupportfieldGroup" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Support Field Group"/>
                                </div>
                                
                                <div v-if="index >= 3" class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreSupportField(index)"><Icon class="text-white" name="humbleicons:times"></Icon></div>                               
                            </div>
                        </Fieldset>
                    </div>


                    <div class="place-content-end flex w-full mt-1">
                        <button class="bg-yellow-600 hover:font-semibold hover:bg-yellow-500 text-gray-100 hover:text-black mt-1 font-semibold py-1 rounded-md px-4 mb-4" type="submit">Update <Icon name="fa-solid:paper-plane"></Icon></button>
                    </div>
                </form>

                <form  @submit.prevent="SocialMediaDataSubmit">
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
                                <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer" @click="addMoreSocialMediaField">Add More <Icon name="mdi:table-add" width="1.4em" height="1.4em"></Icon></div>
                                <span class="font-bold">Social Media Information</span>
                            </div>
                        </template>
                            
                            <div class="flex w-full px-2 py-1" v-for="(extra, index) in SocialMediaExtraFields" :key="index">
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname"> Field Name <Icon name="clarity:info-solid"></Icon></label>
                                    <input type="text" v-model="extra.SocialMediaFieldName"  class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                </div>
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                    <input type="text" v-model="extra.SocialMediaFieldValue" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                </div>
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Group</label>
                                    <input type="text" v-model="extra.SocialMediaFieldGroup" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Group"/>
                                </div>
                                
                                <div v-if="index >= 3"  class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreSocialMediaField(index)"><Icon class="text-white" name="humbleicons:times"></Icon></div>                               
                            </div>
                        </Fieldset>
                    </div>


                    <div class="place-content-end flex w-full mt-1">
                        <button class="bg-yellow-600 hover:font-semibold hover:bg-yellow-500 text-gray-100 hover:text-black mt-1 font-semibold py-1 rounded-md px-4 mb-4" type="submit">Update <Icon name="fa-solid:paper-plane"></Icon></button>
                    </div>
                </form>
                <a target="_blank" class="text-xs text-red-500" href="https://www.base64-image.de/">Convert Image into base64</a>
                
                <form  @submit.prevent="QuickLinksDataSubmit">
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
                                <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer" @click="addMoreQuickLinksField">Add More <Icon name="mdi:table-add" width="1.4em" height="1.4em"></Icon></div>
                                <span class="font-bold">Quick Links</span>
                            </div>
                        </template>
                            
                            <div class="flex w-full px-2 py-1" v-for="(extra, index) in QuickLinksExtraFields" :key="index">
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname"> Field Name <Icon name="clarity:info-solid"></Icon></label>
                                    <input type="text" v-model="extra.QuickLinksFieldName"  class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                </div>
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                    <input type="text" v-model="extra.QuickLinksFieldValue" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                </div>
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Group</label>
                                    <input type="text" v-model="extra.QuickLinksFieldGroup" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Group"/>
                                </div>
                                
                                <div v-if="index >= 3" class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreQuickLinksField(index)"><Icon class="text-white" name="humbleicons:times"></Icon></div>                               
                            </div>
                        </Fieldset>
                    </div>


                    <div class="place-content-end flex w-full mt-1">
                        <button class="bg-yellow-600 hover:font-semibold hover:bg-yellow-500 text-gray-100 hover:text-black mt-1 font-semibold py-1 rounded-md px-4 mb-4" type="submit">Update <Icon name="fa-solid:paper-plane"></Icon></button>
                    </div>

                    
                </form>
                
                <form  @submit.prevent="ExclusiveDataSubmit">
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
                                <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer" @click="addMoreExclusiveField">Add More <Icon name="mdi:table-add" width="1.4em" height="1.4em"></Icon></div>
                                <span class="font-bold">Exclusive</span>
                            </div>
                        </template>
                            
                            <div class="flex w-full px-2 py-1" v-for="(extra, index) in ExclusiveExtraFields" :key="index">
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname"> Field Name <Icon name="clarity:info-solid"></Icon></label>
                                    <input type="text" v-model="extra.ExclusiveFieldName"  class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                </div>
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                    <input type="text" v-model="extra.ExclusiveFieldValue" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                </div>
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Group</label>
                                    <input type="text" v-model="extra.ExclusiveFieldGroup" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Group"/>
                                </div>
                                
                                <div v-if="index >= 3" class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreExclusiveField(index)"><Icon class="text-white" name="humbleicons:times"></Icon></div>                               
                            </div>
                        </Fieldset>
                    </div>


                    <div class="place-content-end flex w-full mt-1">
                        <button class="bg-yellow-600 hover:font-semibold hover:bg-yellow-500 text-gray-100 hover:text-black mt-1 font-semibold py-1 rounded-md px-4 mb-4" type="submit">Update <Icon name="fa-solid:paper-plane"></Icon></button>
                    </div>

                    
                </form>
                <form  @submit.prevent="OtherInformationDataSubmit">
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
                                <div class="m-1 border rounded-md px-2 text-xs pt-2 bg-cyan-500 text-white cursor-pointer" @click="addMoreOtherInformationField">Add More <Icon name="mdi:table-add" width="1.4em" height="1.4em"></Icon></div>
                                <span class="font-bold">Other Information</span>
                            </div>
                        </template>
                            
                            <div class="flex w-full px-2 py-1" v-for="(extra, index) in OtherInformationExtraFields" :key="index">
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citwy" class="text-sm w-full" title="Use field name like: filedName, field_name or filedname"> Field Name <Icon name="clarity:info-solid"></Icon></label>
                                    <input type="text" v-model="extra.OtherInformationFieldName"  class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Name"/>
                                </div>
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Value</label>
                                    <input type="text" v-model="extra.OtherInformationFieldValue" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Value"/>
                                </div>
                                
                                <div class="w-full mr-2">
                                    <label for="dd-citye" class="text-sm w-full"> Field Group</label>
                                    <input type="text" v-model="extra.OtherInformationFieldGroup" class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Field Group"/>
                                </div>
                                
                                <div v-if="index >= 3" class="bg-red-500 h-8 flex place-items-center p-2 rounded-md mt-[1.4rem] cursor-pointer" @click="removeMoreOtherInformationField(index)"><Icon class="text-white" name="humbleicons:times"></Icon></div>                               
                            </div>
                        </Fieldset>
                    </div>


                    <div class="place-content-end flex w-full mt-1">
                        <button class="bg-yellow-600 hover:font-semibold hover:bg-yellow-500 text-gray-100 hover:text-black mt-1 font-semibold py-1 rounded-md px-4 mb-4" type="submit">Update <Icon name="fa-solid:paper-plane"></Icon></button>
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
</div>

</div>
</NuxtLayout>
</template>