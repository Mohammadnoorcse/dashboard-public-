<script setup>
    const props = defineProps({
        color: {
            type: String,
            required: true,
        },
    });
const { color } = props;

const galleries = ref([]);


const emit = defineEmits(['addItionalData']);

const  getData = (e, field) => {
    const file = e.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            emit('addItionalData', { name : field, dataValue : reader.result});
        };
        reader.readAsDataURL(file);
    }
}

const  selectMultiple = (e, field) => {

    const files = e.files;

    for( let i = 0; i < files.length; i++ ){

        const reader = new FileReader();
        if (files[i]) {
            reader.onload = () => {
                galleries.value[i] = reader.result 
            };
            reader.readAsDataURL(files[i]);
        }
    }

    emit('addItionalData', { name : field, dataValue : galleries.value});
    
    
}




</script>

<template>
    <div>

    <Fieldset legend="Extra Props" :pt="{ 
            root: {
                class: 'border p-2 mb-2'
            },
            legend:{
                class: 'p-0 m-0'
            },
            togglerIcon:{

            }
        }">
        <template #legend>
            <div class="flex align-items-center pl-2 border-t">
                
                <span class="font-bold">Color: {{ color }}</span>
            </div>
        </template>
            
        <div class="flex w-full px-2 py-1">
            <div class="w-full mr-2">
                <label for="dd-citwy" class="text-sm w-full"> Color Icon </label>
                <FileUpload :pt="{
                        chooseButton: {
                            class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                        },
                        
                        
                    }" mode="basic" type="file" @select="(event) => getData(event, `[${color}][color_icon]`)" accept="image/*" />
            </div>
            <div class="w-full mr-2">
                <label for="dd-citye" class="text-sm w-full"> Color Thumbnails</label>
                <FileUpload :pt="{
                        chooseButton: {
                            class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                        },
                    }" mode="basic" type="file" @select="(event) => getData(event, `[${color}][color_thumbnails]`)" accept="image/*" />
            </div>
            <div class="w-full mr-2">
                <label for="dd-citye" class="text-sm w-full"> Color Galleries</label>
                <FileUpload :pt="{
                        chooseButton: {
                            class: 'py-1 h-8 overflow-hidden w-full bg-gray-400',
                        },
                    }" mode="basic" @select="(event) => selectMultiple(event, `[${color}][color_galleries]`)" multiple accept="image/*" />
            </div>
        </div>

    </Fieldset>
    
</div>
</template>