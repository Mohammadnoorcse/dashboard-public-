<script setup>
const props = defineProps(['additionals', 'color']);

console.log(props)

</script>

<template>
    <div class="w-full">
        <table class="table-auto w-full">
            <thead>
                <tr class="border bg-gray-200">
                    <th class="border text-center px-2 text-sm">Color</th>
                    <th class="border text-center px-2 text-sm">Size</th>
                    <th class="border text-center px-2 text-sm">Regular Price</th>
                    <th class="border text-center px-2 text-sm">Current Price</th>
                    <th class="border text-center px-2 text-sm">Discount</th>
                    <th class="border text-center px-2 text-sm">Discount Type</th>
                    <th class="border text-center px-2 text-sm">Stock</th>
                    <th class="border text-center px-2 text-sm">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border" v-for="additional in props.additionals" :key="additional.color" >
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.color }}</td>
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.size }}</td>
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.regular_price }}</td>
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.current_price }}</td>
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.discount }}</td>
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.discount_type == 1 ? "Fixed" : "Parcentage" }}</td>
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.stock }}</td>
                    <td class="border p-1 px-2 text-center text-xs"  >{{ additional.status  == 1 ? "Active" : "Inactive" }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>