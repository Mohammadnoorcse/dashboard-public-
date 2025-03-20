<script setup>
const props = defineProps(['statusID']);
const orderStatus = ref([
    {
        id: 1,
        name: "Pending"
    },
    {
        id: 2,
        name: "Confirmed"
    },
    {
        id: 3,
        name: "Processing"
    },
    {
        id: 4,
        name: "Packaging"
    },
    {
        id: 5,
        name: "Ready to Shipped"
    },
    {
        id: 6,
        name: "Cancel"
    },
    {
        id: 7,
        name: "Rejected"
    },
    {
        id: 8,
        name: "Delivered"
    }
])
</script>

<template>
    <span v-for="status in orderStatus" :key="status.id">
        <span v-if="status.id === parseInt(statusID)">{{ status.name }} Orders</span>
    </span>
</template>