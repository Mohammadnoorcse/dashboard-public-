<script setup>
import InputGroup from "primevue/inputgroup";
import Sidebar from "primevue/sidebar";
//Define Page Meta
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
const permissionStore = usePermissionStore();
const { accessMenu, allAccess } = storeToRefs(permissionStore);
const accessMenuKeys = computed(() => Object.keys(accessMenu.value));
console.log("Permission Fetch Result allAccess:", allAccess.value);

// Function to check access
const visibleAllow = (menu_id, access_id) => {
    if (accessMenuKeys.value.includes("super_admin")) {
        return true; // If user has "super_admin" access, return true
    }
    return !!(allAccess.value && allAccess.value[menu_id] && allAccess.value[menu_id][access_id]); // Otherwise, check if the ID exists in allAccess
};

//Define Store
const store = useFeedbackStore();
const feedbackData = computed(() => store.feedbacks);
const pagination = computed(() => store.pagination);
//For Loading Component
const isLoading = ref("success");
//For Right Side Filter
const visibleRight = ref(false);
// Initialize Toast
const toast = useToast();
//Pagination Initial PageNumber
const pageNumber = ref(1);

const customerName = ref("")
const tempCustomerName =  ref("")
const customerStatus = ref("");
const tempCustomerStatus = ref("")
const filteredDataCount = ref();
const filted = ref();

// Watch customerName field changes and apply filter
const applyFilter = async () => {
            // Update customerName from tempCustomerName
        if (tempCustomerName.value) {
            customerName.value = tempCustomerName.value;
        } else {
            customerName.value = "";
        }

        // Update customerStatus from tempCustomerStatus
        if (tempCustomerStatus.value) {
            customerStatus.value = tempCustomerStatus.value;
        } else {
            customerStatus.value = "";
        }
    if (customerName.value || customerStatus.value) {
        isLoading.value = 'loading';
        const res = await store.filterdData(tempCustomerName.value, tempCustomerStatus.value);
        console.log("Response: ",res.data)
        filted.value = res.data.data;
        console.log("Filed",filted)
        filteredDataCount.value = res.data.length;
        isLoading.value = 'success';
    }
};


// On Load or Reload Get New Updated Data
const loadFeedbacks = async () => {
  isLoading.value = "Loading";
  await store.getAllFeedbacks(
    pageNumber.value,
    store.pagination.perPage
  );
  feedbackData.value = store.feedbacks;
  console.log(feedbackData.value);
  isLoading.value = "success";
};

// Ensure data is loaded before the component mounts
onBeforeMount(async () => {
  await loadFeedbacks();
});

// Watch for changes in the store Coupon and update CouponData accordingly
watch(
  () => store.feedbacks,
  (newFeedback) => {
    feedbackData.value = newFeedback;
  }
);
// Watch PageNumber Change
watch(pageNumber, async (newPage) => {
  isLoading.value = "loading";
  await store.getAllFeedbacks(newPage, pagination.value.perPage);
  isLoading.value = "success";
});
// OnPage Change Get New Data
const onPageChange = (newPage) => {
  pageNumber.value = newPage;
  store.getAllFeedbacks(pageNumber.value, pagination.value.perPage);
};
// On Search Get New Coupon Data
const handleSearch = () => {
  pageNumber.value = 1;
  store.getAllFeedbacks(pageNumber.value, pagination.value.perPage);
};
// On Apply Filter Get New Coupon Data
const goToPage = (page) => {
  if (page > 0 && page <= pagination.value.totalPages) {
    pageNumber.value = page;
    store.getAllFeedbacks(pageNumber.value, pagination.value.perPage);
  }
};

//Status update
const updateStatus = async (id, status, rattings, comments) => {
  isLoading.value = "loading";

  try {
    const feedbackData = reactive({
      status: status,
      rattings: rattings,
      comments: comments,
    });
    console.log(feedbackData);
    const res =  await store.updateFeedback(feedbackData, id);
    if (res.msg === "feeback_update") {
      toast.add({
                severity: 'success',
                summary: 'Feedback Updated',
                detail: 'Feedback was Updated successfully.',
                life: 2000,
            });
    }else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred.',
                life: 2000,
            });
        }
  } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An unexpected error occurred.',
            life: 2000,
        });
        console.error(error);
    } finally {
        isLoading.value = "success";
    }
};

console.log("FeedBack:",feedbackData)
console.log("")

</script>
<template>
  <NuxtLayout :name="layout">
    <Toast />
    <Spiner :loading="isLoading" />
    <div class="w-full px-3 mt-1">
      <div
        class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md"
      >
        <!-- Header goes here -->
        <div class="flex w-full justify-between bg-gray-400 text-white">
          <div class="font-semibold mt-1 ml-3">All Feedbacks</div>
          <div class="font-semibold ml-1 flex">
            <button
              @click="$router.back()"
              class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100"
            >
              <Icon name="gg:arrow-left-o"></Icon>
              Back
            </button>

            <button
              class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm"
              @click="visibleRight = true"
            >
              <Icon name="iconoir:filter-solid"></Icon>
              Filter
            </button>
          </div>
        </div>

        <!-- Table list goes here -->
        <div class="h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">
          <table class="w-full table-auto">
            <!--Table header -->
            <thead>
              <tr class="w-full bg-gray-300 text-sm">
                <th class="p-1 text-left text-sm w-8">SL</th>
                <th class="p-1 text-left text-sm">Customer Id</th>
                <th class="p-1 text-left text-sm">Product Id</th>
                <th class="p-1 text-left text-sm w-2/5">Comments</th>
                <th class="p-1 text-left text-sm">Rattings</th>
                <th class="p-1 text-left">Status</th>
                <th class="p-1 text-center w-24">...</th>
              </tr>
            </thead>
            <!--Table Body-->
            <tbody>
              <!-- <tr v-for="vendor in (vendorName && vendorName.length > 0 || vendorStatus ? filted : vendorData)" :key="vendor.unique_id" class="bg-white odd:bg-gray-100"></tr> -->
              <tr v-for="review in (customerName && customerName.length > 0 || customerStatus ? filted : feedbackData.data)" :key="review.id" class="bg-white odd:bg-gray-100">
              <!--Feedback Id-->
                <td class="p-1 text-center text-xs">{{ review.id }}</td>
                <!--Feedback Name-->
                <td class="p-1 text-left text-xs">
                  {{ review.customer.name }}
                </td>
                <!--Feedback ProductID-->
                <td class="p-1 text-left text-xs">{{ review.product_id }}</td>
                <!--Feedback Comments-->
                <td class="p-1 text-left text-xs">{{ review.comments }}</td>
                <!--Feedback Review-->
                <td class="p-1 text-left text-xs">
                  <StarRating :rating="review.rattings" />
                </td>
                <!-- Feedback Status -->
                <td class="p-1 text-left text-xs">
                  <label class="relative inline-flex cursor-pointer items-center">
                    <input
                      id="switch"
                      type="checkbox"
                      class="peer sr-only"
                      :checked="review.status === 1"
                      @change="() => {
                        const newStatus = review.status === 1 ? 0 : 1;
                        updateStatus(review.id, newStatus, review.rattings, review.comments);
                      }"
                    />
                    <div
                      class="peer h-6 w-11 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300"
                    ></div>
                  </label>
                </td>
                <!--Feedback Others-->
                <td v-if="visibleAllow(17,3)" class="p-1 text-center text-xs flex justify-center">
                  <div
                    class="rounded-md mx-1 bg-green-500 p-1 cursor-pointer text-white"
                    title="Edit"
                  >
                    <Icon
                      name="material-symbols:edit"
                      width="1.4em"
                      height="1.4em"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer-->
        <div class="order_title text-sm flex justify-between h-full">
          <!-- Search Box -->
          <div class="mt-[2px] ml-3">
            <InputGroup>
              <input
                type="number"
                v-model="pageNumber"
                @keyup.enter="goToPage(pageNumber)"
                class="border border-r-0 p-1 focus:outline-none"
                placeholder="Page Number"
              />
              <icon
                class="text-3xl bg-gray-200 px-2 w-12 rounded-r cursor-pointer"
                name="nonicons:go-16"
                color="#000"
                @click="goToPage(pageNumber)"
              />
            </InputGroup>
          </div>
          <!-- Pagination -->
          <div class="pt-2">
            <Pagination
              :currentPage="pageNumber"
              :totalPages="pagination.totalPages"
              :links="pagination.links"
              @paginate="onPageChange"
            />
          </div>
        </div>
      </div>

      <Sidebar
        v-model:visible="visibleRight"
        header="Category Filter"
        position="right"
      >
        <div class="w-full">
          <label for="dd-city" class="text-sm w-full">Customer Name</label>
          <input
            type="text"
            v-model="tempCustomerName"
            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
            placeholder="Customer Id"
          />
        </div>
        <div class="w-full mt-2">
          <label for="dd-city" class="text-sm w-full">Status</label>
          <select
            name="status"
            v-model="tempCustomerStatus"
            id="commission_type"
            class="w-full text-sm border py-1 px-2 outline-none focus:border-red-200 rounded-md"
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
            <option value="">All</option>
          </select>
        </div>

        <div class="font-semibold flex mt-2 place-content-end">
          <button
            class="bg-blue-600 hover:bg-blue-500 text-gray-100 transform hover:text-black px-4 py-1 text-sm rounded-md"
            @click="applyFilter"
          >
            <Icon name="fluent:search-12-filled"></Icon>
            Search
          </button>
        </div>
      </Sidebar>
    </div>
  </NuxtLayout>
</template>
