<script setup>
    import Image from 'primevue/image';
    import Fieldset from 'primevue/fieldset';

    const props = defineProps(['additional']);
    const { additional } = props;

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


    console.table(props);

</script>

<template>

    <Fieldset legend="Extra Props" :pt="fieldestStyle">
        <template #legend>
            <div class="flex align-items-center pl-2 border-t">
                <span class="font-bold">Color: {{ additional.slug }}</span>
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

</template>