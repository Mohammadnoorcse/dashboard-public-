<template>
    <div v-if="loading !== 'success' " class="min-h-screen w-full bg-black bg-opacity-[.3] top-0 left-0 z-30 flex items-center fixed">
        <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    loading: String ,
})

</script>

<style scoped>

</style>