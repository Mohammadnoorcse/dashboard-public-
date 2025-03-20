<template>
    <div class="flex items-center">
      <template v-for="star in stars" :key="star">
        <Icon
          :name="starIconName(star)"
          width="1.4em"
          height="1.4em"
          :class="starIconClass(star)"
        />
      </template>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    maxRating: {
      type: Number,
      default: 5, // Maximum number of stars
    },
  });
  
  const stars = computed(() => Array.from({ length: props.maxRating }, (_, i) => i + 1));
  
  const starIconName = (star) => {
    const floorRating = Math.floor(props.rating);
    return floorRating >= star
      ? 'mdi:star' // Full star
      : props.rating >= star - 0.5
      ? 'mdi:star-half-full' // Half star
      : 'mdi:star-outline'; // Outline star
  };
  
  const starIconClass = (star) => {
    const floorRating = Math.floor(props.rating);
    return floorRating >= star
      ? 'text-yellow-400' // Full yellow
      : props.rating >= star - 0.5
      ? 'text-yellow-400' // Half yellow
      : 'text-gray-400'; // Gray
  };
  </script>
  
  <style scoped>
  .flex {
    display: flex;
    gap: 4px;
  }
  
  .items-center {
    align-items: center;
  }
  </style>
  