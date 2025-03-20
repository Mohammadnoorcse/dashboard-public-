<script setup >
import { ref } from "vue";
import PanelMenu from "primevue/panelmenu";

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

const items = ref([
  {
    id: 1,
    label: "Dashboard",
    icon: "mage:dashboard-fill",
    route: "/dashboard",
  },
  {
    id: 2,
    label: "Category",
    icon: "heroicons:square-3-stack-3d-20-solid",
    items: [
      {
        id: 2.1,
        label: "Lists",
        icon: "mingcute:menu-line",
        route: "/category",
      },
      {
        id: 2.2,
        label: "Add",
        icon: "ph:list-plus-bold",
        route: "/category/create",
      },
    ],
  },
  {
    id: 3,
    label: "Product",
    icon: "fluent:box-16-filled",
    items: [
      {
        id: 3.1,
        label: "Lists",
        icon: "mingcute:menu-line",
        route: "/product",
      },
      {
        id: 3.2,
        label: "Add",
        icon: "ph:list-plus-bold",
        route: "/product/create",
      },
    //   {
    //     label: "Active",
    //     icon: "mingcute:menu-line",
    //     route: "/product/Active",
    //   },
    //   {
    //     label: "Inactive",
    //     icon: "mingcute:menu-line",
    //     route: "/product/inactive",
    //   },
    ],
  },
  {
    id: 4,
    label: "Orders",
    icon: "fa-solid:shopping-basket",
    items: [
      {
        id: 4.1,
        label: "Lists",
        icon: "mingcute:menu-line",
        route: "/order",
      },
      
   
    ],
  },

  
  {
    id: 5,
    label: "Slide",
    icon: "material-symbols:transition-slide",
    items: [
      {
        id: 5.1,
        label: "List",
        icon: "mingcute:menu-line",
        route: "/slide",
      },
      {
        id: 5.2,
        label: "Add",
        icon: "ph:list-plus-bold",
        route: "/slide/create",
      },
    ],
  },
  {
    id: 6,
    label: "Brand",
    icon: "pajamas:labels",
    items: [
        {
            id: 6.1,
            label: "List",
            icon: "mingcute:menu-line",
            route: "/brand",
        },
        {
            id: 6.2,
            label: "Add",
            icon: "ph:list-plus-bold",
            route: "/brand/create",
        },
    ],
  },
  {
    id: 7,
    label: "Coupon",
    icon: "mingcute:coupon-fill",
    items: [
      {
        id: 7.1,
        label: "List",
        icon: "mingcute:menu-line",
        route: "/coupon",
      },
      {
        id: 7.2,
        label: "Add",
        icon: "ph:list-plus-bold",
        route: "/Coupon/create",
      },
    ],
  },
  {
    id: 8,
    label: "Vendor",
    icon: "teenyicons:shop-solid",
    items: [
      {
        id: 8.1,
        label: "List",
        icon: "mingcute:menu-line",
        route: "/Vendor",
      },
      {
        id: 8.2,
        label: "Add",
        icon: "ph:list-plus-bold",
        route: "/Vendor/create",
      },
    ],
  },
  {
    id: 9,
    label: "Feedback",
    icon: "material-symbols:reviews-rounded",
    items: [
      {
        id: 9.1,
        label: "All Feedback",
        icon: "mingcute:menu-line",
        route: "/feedback",
      },
    ],
  },
  {
    id: 10,
    label: "Permission",
    icon: "teenyicons:password-solid",
    items: [
        {
            id: 10.1,
            label: "Role",
            icon: "game-icons:house-keys",
            route: "/permission",
        },
        {
            id: 10.2,
            label: "Role Permission",
            icon: "ooui:user-contributions-ltr",
            route: "/permission/role",
        },
        {
            id: 10.3,
            label: "User Permission",
            icon: "mdi:user-lock",
            route: "/permission/user",
        },
    ],
  },

    {
        id: 11,
        label: "Mail Configuration",
        icon: "fluent:mail-settings-16-filled",
        route: "/mail",
    },

    {
        id: 12,
        label: "Web Settings",
        icon: "mingcute:settings-6-fill",
        route: "/settings",
    },

    {
        id: 13,
        label: "Transactions",
        icon: "tdesign:money",
        route: "/transaction",
    }

]);

const router = useRouter();
const activeMenu = ref(null);
const currentPath = router.currentRoute.value.fullPath;
// toggle function goes here for sub menu open
const toggle = (index) => {

    activeMenu.value = index;

}
const permissionStore = usePermissionStore();
const { accessMenu, allAccess } = storeToRefs(permissionStore);
const accessMenuKeys = computed(() => Object.keys(accessMenu.value));

const menuAccess = (id) => {
    // Check if super_admin is in accessMenuKeys
    if (accessMenuKeys.value.includes("super_admin")) {
        return true;
    }
    // Check if the given id exists in the keys list
    return accessMenuKeys.value.includes(id.toString());
};

const visibleAllow = (menu_id, access_id) => {
    if (accessMenuKeys.value.includes("super_admin")) {
        return true; // If user has "super_admin" access, return true
    }
    return !!(allAccess.value && allAccess.value[menu_id] && allAccess.value[menu_id][access_id]); // Otherwise, check if the ID exists in allAccess
};

// console.log("Access Keys:", accessMenuKeys.value);
</script>
<template>
  <div class="sidebar_menu w-full left-0 max-h-[calc(100vh-3rem)]">
    <ul class="mt-2">

        <li v-if="menuAccess(1)" class="relative cursor-pointer" id="1">
            <NuxtLink to="/dashboard" exact class="flex border-b py-1" >
            <Icon name="mage:dashboard-fill" width="1em" height="1em" class="ml-3" /> 
            <div class="text-left text-sm ml-1 -mt-[2px]">Dashboard </div> 
            </NuxtLink>
        </li>

        <li v-if="menuAccess(2)"  class="relative cursor-pointer" @click="toggle('category')">
            <div exact class="flex border-b py-1" >
                <Icon name="heroicons:square-3-stack-3d-20-solid" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Category </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'category' || currentPath == '/category' || currentPath == '/category/create' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'category' || currentPath == '/category' || currentPath == '/category/create' ? 'block' : 'hidden'}`">
                
                <li v-if="visibleAllow(2,1)" class="relative">
                    <NuxtLink exact to="/category" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>
                <li v-if="visibleAllow(2,2)" class="relative">
                    <NuxtLink exact to="/category/create" class="flex border-b py-1 pl-4">
                        <Icon name="ph:list-plus-bold" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Add</div>
                    </NuxtLink>
                </li>
                
            </ul>

        </li>

        <!-- Product -->
        <li v-if="menuAccess(8)"  class="relative cursor-pointer" @click="toggle('product')">
            <div exact class="flex border-b py-1">
                <Icon name="fluent:box-16-filled" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Product </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'product' || currentPath == '/product' || currentPath == '/product/create' || currentPath == '/product/*/edit' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'product' || currentPath == '/product' || currentPath == '/product/create' || currentPath == '/product/*/edit' ? 'block' : 'hidden'}`">
                <li v-if="visibleAllow(8,1)" class="relative">
                    <NuxtLink exact to="/product" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>

                <li v-if="visibleAllow(8,2)" class="relative">
                    <NuxtLink exact to="/product/create" class="flex border-b py-1 pl-4">
                        <Icon name="ph:list-plus-bold" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Add</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>

        <!-- Page -->
        <li v-if="menuAccess(19)"  class="relative cursor-pointer" @click="toggle('page')">
            <div exact class="flex border-b py-1">
                <Icon name="fluent:document-16-filled" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]"> Page</div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'page' || currentPath == '/page' || currentPath == '/page/create' || currentPath == '/page/*/edit' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'page' || currentPath == '/page' || currentPath == '/page/create' || currentPath == '/page/*/edit' ? 'block' : 'hidden'}`">
                <li v-if="visibleAllow(19,1)" class="relative">
                    <NuxtLink exact to="/page" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>

                <li v-if="visibleAllow(19,2)" class="relative">
                    <NuxtLink exact to="/page/create" class="flex border-b py-1 pl-4">
                        <Icon name="ph:list-plus-bold" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Add</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>


        <!-- Orders -->
        <li v-if="menuAccess(9)"  class="relative cursor-pointer" @click="toggle('order')">
            <div exact class="flex border-b py-1">
                <Icon name="fa-solid:shopping-basket" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Orders </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'order' || currentPath == '/order' || currentPath == '/order/*' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul v-if="visibleAllow(9,1)" :class="`${ activeMenu == 'order' || currentPath == '/order' || currentPath == '/order/*' ? 'block' : 'hidden'}`">
                <li class="relative">
                    <NuxtLink exact to="/order" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">All Orders</div>
                    </NuxtLink>
                </li>

                <li v-for="item in orderStatus" class="relative" :key="item.id">
                    <NuxtLink exact :to="`/order/${item.id}`" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">{{ item.name }}</div>
                    </NuxtLink>
                </li>

            </ul>
        </li>


        <!-- Slide -->
        <li v-if="menuAccess(10)"  class="relative cursor-pointer" @click="toggle('slide')">
            <div exact class="flex border-b py-1">
                <Icon name="material-symbols:transition-slide" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Slide </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'slide' || currentPath == '/slide' || currentPath == '/slide/create' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'slide' || currentPath == '/slide' || currentPath == '/slide/create' ? 'block' : 'hidden'}`">
                <li v-if="visibleAllow(10,1)" class="relative">
                    <NuxtLink exact to="/slide" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>

                <li v-if="visibleAllow(10,2)" class="relative">
                    <NuxtLink exact to="/slide/create" class="flex border-b py-1 pl-4">
                        <Icon name="ph:list-plus-bold" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Add</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>


        <!-- Brand -->
        <li v-if="menuAccess(3)"  class="relative cursor-pointer" @click="toggle('brand')">
            <div exact class="flex border-b py-1">
                <Icon name="pajamas:labels" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Brand </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'brand' || currentPath == '/brand' || currentPath == '/brand/create' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'brand' || currentPath == '/brand' || currentPath == '/brand/create' ? 'block' : 'hidden'}`">
                <li v-if="visibleAllow(3,1)" class="relative">
                    <NuxtLink exact to="/brand" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>

                <li v-if="visibleAllow(3,2)" class="relative">
                    <NuxtLink exact to="/brand/create" class="flex border-b py-1 pl-4">
                        <Icon name="ph:list-plus-bold" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Add</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>


        <!-- Coupon -->
        <li v-if="menuAccess(12)"  class="relative cursor-pointer" @click="toggle('coupon')">
            <div exact class="flex border-b py-1">
                <Icon name="mingcute:coupon-fill" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Coupon </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'coupon' || currentPath == '/coupon' || currentPath == '/coupon/create' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'coupon' || currentPath == '/coupon' || currentPath == '/coupon/create' ? 'block' : 'hidden'}`">
                <li v-if="visibleAllow(10,1)" class="relative">
                    <NuxtLink exact to="/coupon" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>

                <li v-if="visibleAllow(10,2)" class="relative">
                    <NuxtLink exact to="/coupon/create" class="flex border-b py-1 pl-4">
                        <Icon name="ph:list-plus-bold" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Add</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>


        <!-- Vendor -->
        <li v-if="menuAccess(7)"  class="relative cursor-pointer" @click="toggle('vendor')">
            <div exact class="flex border-b py-1">
                <Icon name="teenyicons:shop-solid" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Vendor </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'vendor' || currentPath == '/vendor' || currentPath == '/vendor/create' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'vendor' || currentPath == '/vendor' || currentPath == '/vendor/create' ? 'block' : 'hidden'}`">
                <li v-if="visibleAllow(7,1)" class="relative">
                    <NuxtLink exact to="/vendor" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>

                <li v-if="visibleAllow(7,2)" class="relative">
                    <NuxtLink exact to="/vendor/create" class="flex border-b py-1 pl-4">
                        <Icon name="ph:list-plus-bold" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Add</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>

        <!-- Feedback -->
        <li v-if="menuAccess(17)"  class="relative cursor-pointer" @click="toggle('feedback')">
            <div exact class="flex border-b py-1">
                <Icon name="material-symbols:reviews-rounded" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Feedback </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'feedback' || currentPath == '/feedback' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'feedback' || currentPath == '/feedback' ? 'block' : 'hidden'}`">
                <li class="relative">
                    <NuxtLink exact to="/feedback" class="flex border-b py-1 pl-4">
                        <Icon name="mingcute:menu-line" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">List</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>


        <!-- Permission -->
        <li v-if="menuAccess(6)"  class="relative cursor-pointer" @click="toggle('permission')">
            <div exact class="flex border-b py-1">
                <Icon name="teenyicons:password-solid" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Permission </div> 
                <Icon name="ic:round-keyboard-arrow-right" :class="`${ activeMenu == 'permission' || currentPath == '/permission' || currentPath == '/permission/create' ? 'rotate-90' : ''}`" class="absolute right-0 ease-in duration-300" width="1.2em" height="1.2em"/>
            </div>

            <ul :class="`${ activeMenu == 'permission' || currentPath == '/permission' || currentPath == '/permission/create' ? 'block' : 'hidden'}`">
                <li class="relative">
                    <NuxtLink exact to="/permission" class="flex border-b py-1 pl-4">
                        <Icon name="game-icons:house-keys" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Permission</div>
                    </NuxtLink>
                </li>

                <li class="relative">
                    <NuxtLink exact to="/permission/role" class="flex border-b py-1 pl-4">
                        <Icon name="ooui:user-contributions-ltr" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">Role Permission</div>
                    </NuxtLink>
                </li>

                <li class="relative">
                    <NuxtLink exact to="/permission/user" class="flex border-b py-1 pl-4">
                        <Icon name="mdi:user-lock" width="1em" height="1em" class="ml-3" /> 
                        <div class="text-left text-sm ml-1 -mt-[2px]">User Permission</div>
                    </NuxtLink>
                </li>
            </ul>
        </li>

        <li v-if="menuAccess(16)"  class="relative cursor-pointer">
            <NuxtLink to="/mail" exact class="flex border-b py-1" >
                <Icon name="fluent:mail-settings-16-filled" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Mail Configuration </div> 
            </NuxtLink>
        </li>

        <li v-if="menuAccess(18)"  class="relative cursor-pointer">
            <NuxtLink to="/settings" exact class="flex border-b py-1" >
                <Icon name="mingcute:settings-6-fill" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Web Settings </div> 
            </NuxtLink>
        </li>

        <li v-if="menuAccess(15)"  class="relative cursor-pointer">
            <NuxtLink to="/transaction" exact class="flex border-b py-1" >
                <Icon name="tdesign:money" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Transactions </div> 
            </NuxtLink>
        </li>
        <li v-if="menuAccess(4)" >
            <NuxtLink to="/users" exact class="flex border-b py-1" >
                <Icon name="fluent:people-16-filled" width="1em" height="1em" class="ml-3" /> 
                <div class="text-left text-sm ml-1 -mt-[2px]">Customer </div> 
            </NuxtLink>
        </li>
    </ul>

    <!-- <PanelMenu unstyled :model="items">
      <template #item="{ item }">
        <NuxtLink
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
        >
          <NuxtLink
            class="flex align-items-center cursor-pointer text-color px-3 py-2"
            :href="href"
            @click="navigate"
          >
            <Icon :name="item.icon" width="1.4em" height="1.4em" />
            <span class="ml-2 text-color">{{ item.label }}</span>
          </NuxtLink>
        </NuxtLink>
        <NuxtLink
          v-else
          class="flex align-items-center cursor-pointer text-color px-3 py-2"
          :href="item.url"
          :target="item.target"
        >
          <Icon :name="item.icon" width="1.4em" height="1.4em" />
          <span class="ml-2">{{ item.label }}</span>
          <span
            v-if="item.items"
            class="pi pi-angle-down text-primary ml-auto"
          />
        </NuxtLink>
      </template>
    </PanelMenu> -->
  </div>
</template>

<style scoped>
    .router-link-exact-active {
        border-left: solid #f00 3px;
    }
</style>
