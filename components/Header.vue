<script setup>
import Menu from 'primevue/menu';
import { ref } from "vue";
const  store = useTokenStore();
const loginStore = useLoginStore();

const store2 = usePermissionStore();
// console.log("Store2", store2);
const permissions = ref(null); // Store API response
async function fetchPermissions() {
    const response = store2.getPermissions();
    // const remove = await store2.removePermissions();
    // console.log("Permissions:", response);
    if (response.success) {
        permissions.value = response; // Save the permissions data
    }
}
fetchPermissions();

const username = computed(() => loginStore.userData.name);
const email = computed(() => loginStore.userData.email);
const pin = computed(() => loginStore.userData.otp);
const menu = ref();
const notice = ref();
const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: `${username.value}`,
                icon: 'pi pi-user'
            },
            {
                label: `${email.value}`,
                icon: 'pi pi-envelope'
            },
            {
                label: `${pin.value}`,
                icon: 'pi pi-key'
            },
            
        ]
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-cog'
            },
            {
                label: 'Change Password',
                icon: 'pi pi-upload'
            
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    store.removeToken();
                    store2.removePermissions()
                    
                },
            }
        ]
    }
]);
const noteces = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Username',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Email',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Pin',
                icon: 'pi pi-refresh'
            },
            
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};
const getNotice = (event) => {
    notice.value.toggle(event);
};
</script>

<template>
    <div class="w-full flex justify-between px-3 bg-white border-b">
        <div>
            <h1 class="text-2xl font-semibold mt-1">Admin Panel</h1>
        </div>
        
            <div class="card flex justify-content-center p-2 relative">
                <div class="cursor-pointer mr-3 w-8 h-8 " @click="getNotice" aria-haspopup="true" aria-controls="overlay_menu">
                    <Icon class="cursor-pointer mt-1" name="codicon:bell-dot" width="1.4em" height="1.4em" color="#2bff00" />
                </div>
                <Menu ref="notice" id="overlay_menu" :model="noteces" :popup="true" />
                
                <img alt="logo" src="/logo.png" class="w-8 h-8 border rounded-full cursor-pointer" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu">
                <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
            </div>
        
    </div>
</template>
