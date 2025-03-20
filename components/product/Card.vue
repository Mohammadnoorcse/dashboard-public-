<script setup>
    import Card from 'primevue/card';
    import { reactive } from 'vue';
    const props = defineProps(['addionalData']);
    const emit = defineEmits(['update']);

    const product = reactive(
        {
            additional_key  : props.addionalData.additional_key,
            size            : props.addionalData.size,
            color           : props.addionalData.color,
            regular_price   : props.addionalData.regular_price,
            current_price   : props.addionalData.current_price,
            discount        : props.addionalData.discount,
            discount_type   : props.addionalData.discount_type,
            status          : props.addionalData.status,
            stock           : props.addionalData.stock,
            stock_status    : props.addionalData.stock_status

        }    
        
    )



    // const getData = (e, color, size) => {

    //     let fieldName = e.target.name
    //     let fieldValue = e.target.value
    //     // store.setAdditional(color, size, fieldName, fieldValue);


    //     emit('addItionalData', { color, size, fieldName, fieldValue });
    // }

    console.log(props.addionalData);

    const submitAdditionalData  = async () => {
        emit('update', product)
    }


</script>
<template>
    <Card class="w-full rounded-md overflow-hidden product_stock">
        <template #header>
            <div class=" bg-gray-300 p-1 text-center text-black font-semibold">Stock: {{ product.color }} | {{ product.size }}</div>
        </template>
        <template #content >
            <form @submit.prevent="submitAdditionalData" >

                <div class="w-full flex mb-1">
                    <label for="dd-city" class="text-xs w-2/5">Regular Price:</label>
                    <input type="number" v-model="product.regular_price"  class="w-3/5 text-xs border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Regular Price"/>
                </div>

                <div class="w-full flex mb-1">
                    <label for="dd-city" class="text-xs w-2/5">Current Price:</label>
                    <input type="number" v-model="product.current_price" class="w-3/5 text-xs border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Current Price"/>
                </div>

                <div class="w-full flex mb-1">
                    <label for="dd-city" class="text-xs w-2/5">Discount:</label>
                    <input type="number"  v-model="product.discount" class="w-3/5 text-xs border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Discount"/>
                </div>

                <div class="w-full flex mb-1">
                    <label for="dd-city" class="text-xs w-2/5">Discount Type: </label>
                    <select v-model="product.discount_type" @click="getData" id="discount_type" class="w-3/5 text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                        <option value="1"> Fixed</option>
                        <option value="0"> Parcentage</option>
                    </select>
                </div>

                <div class="w-full flex mb-1">
                    <label for="dd-city" class="text-xs w-2/5">Status:</label>
                    <select v-model="product.status" @click="getData" id="discount_type" class="w-3/5 text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                        <option value="1"> Active</option>
                        <option value="0"> Inactive</option>
                    </select>
                </div>

                <div class="w-full flex mb-1">
                    <label for="dd-city" class="text-xs w-2/5">Stock:</label>
                    <input type="number" v-model="product.stock"  @keyup="getData" class="w-3/5 text-xs border py-1 px-2 outline-none focus:border-red-200 rounded-md" placeholder="Stock"/>
                </div>

                <div class="w-full flex mb-1">
                    <label for="dd-city" class="text-xs w-2/5">Stock Status:</label>
                    <select v-model="product.stock_status" @click="getData" id="discount_type" class="w-3/5 text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md">
                        <option value="1"> Stock</option>
                        <option value="0"> Out of Stock</option>
                    </select>
                </div>

                <button type="submit" class="bg-yellow-400 hover:bg-yellow-900 hover:text-white transition-all py-1 px-2 float-end mt-1 rounded-md"> update</button>
            </form>
        </template>
    </Card>
</template>