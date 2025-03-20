<template>
	<div class="pagination">
		<a v-for="(page, index) in links" :key="index" @click.prevent="changePage(page.label)" v-html="page.label"
			:class="{
				'border-t-4 px-2 border-red-500 text-red-500': page.active,
				'p-1 mt-1 text-black': !page.active,
			}" href="#"></a>
	</div>
</template>

<script setup>
// import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	currentPage: {
		type: Number,
		required: true,
	},
	totalPages: {
		type: Number,
		required: true,
	},
	links: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits(['paginate']);

const changePage = (label) => {
	if (label === '&laquo; Previous') {
		if (props.currentPage > 1) {
			emit('paginate', props.currentPage - 1);
		}
	} else if (label === 'Next &raquo;') {
		if (props.currentPage < props.totalPages) {
			emit('paginate', props.currentPage + 1);
		}
	} else {
		const pageNumber = parseInt(label);
		if (!isNaN(pageNumber)) {
			emit('paginate', pageNumber);
		}
	}
};
</script>

<style scoped>
.pagination a {
	cursor: pointer;
}
</style>