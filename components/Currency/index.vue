<!-- Md. Samiul Islam,
 09 - 01 - 2025 -->
 
<script setup>
const props = defineProps(['amount']);
</script>
<template>

    <!-- {{ (parseInt(props.amount)).toLocaleString('en-US', { style: 'currency', currency: 'BDT', }) }} -->
    {{ (parseFloat(amount)).toLocaleString('en-US', { style: 'currency', currency: 'BDT', }) }}
</template>