<script setup>
    const props = defineProps({
        payments: {
            type: Object,
            required: true,
        },
    });

    const { payments } = props;

    console.table(payments);

</script>
<template>
    <div class="grid grid-cols-6 gap-4">
        <div class="border rounded-md p-2 bg-white relative" v-for="payment in payments" :key="payment.code">
            <img alt="payment.code" :src="payment.image"/>
            <div class="text-center bg-blue-300 rounded-b text-black font-semibold text-sm">{{ payment.name }}</div>
            <input class="absolute top-1 right-1 h-6 w-6" checked type="checkbox">
        </div>
    </div>
</template>