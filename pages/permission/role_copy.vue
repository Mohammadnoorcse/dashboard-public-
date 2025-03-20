<script setup>
import Dropdown from 'primevue/dropdown';
import { ref } from 'vue';
    
definePageMeta({
    layout: "dashboard",
    middleware: "auth",
})



    // replace with actual API endpoint and master key
    const config = useRuntimeConfig();
    const EndPoint = config.public.baseURl;
    const MasterKey = config.public.masterToken;
    const app_token = useTokenStore().getToken;

    const headers = ref({
        "Accept": "application/json",
        "Authorization": `Bearer ${app_token}`,
        "App-Master-Key" : `${MasterKey}`
    })

const router = useRouter();
//Get Toast
const toast = useToast();

const opened = ref(false);
const checkboxSelected = ref(false);
const updatePermissions = ref([]);
const checkExitPermissions = ref([]);
const loading = ref("not");
const exits = ref(true);
const roles = ref([]);
const roleId = ref();
const roleAccess = ref([]);
const nodes = ref({}
    // {
    //     "roles": [
    //         {
    //             "id": 2,
    //             "name": "Admin",
    //             "status": "2",
    //             "created_at": null,
    //             "updated_at": null
    //         },
    //         {
    //             "id": 3,
    //             "name": "Shop Manger",
    //             "status": "2",
    //             "created_at": null,
    //             "updated_at": null
    //         },
    //         {
    //             "id": 4,
    //             "name": "Staff",
    //             "status": "2",
    //             "created_at": null,
    //             "updated_at": null
    //         },
    //         {
    //             "id": 5,
    //             "name": "Customer",
    //             "status": "2",
    //             "created_at": null,
    //             "updated_at": null
    //         },
    //         {
    //             "id": 6,
    //             "name": "Vendor",
    //             "status": "2",
    //             "created_at": null,
    //             "updated_at": null
    //         }
    //     ],
    //     "access": [
    //         {
    //             "id": 1,
    //             "name": "Home",
    //             "slug": "home",
    //             "parent_id": null,
    //             "sequance": "1",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 1,
    //                     "menu_id": "1",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 2,
    //             "name": "Category",
    //             "slug": "category",
    //             "parent_id": null,
    //             "sequance": "2",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 2,
    //                     "menu_id": "2",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 3,
    //                     "menu_id": "2",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 4,
    //                     "menu_id": "2",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 3,
    //             "name": "Brand",
    //             "slug": "brand",
    //             "parent_id": null,
    //             "sequance": "3",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 6,
    //                     "menu_id": "3",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 7,
    //                     "menu_id": "3",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 8,
    //                     "menu_id": "3",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 9,
    //                     "menu_id": "3",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 4,
    //             "name": "User",
    //             "slug": "user",
    //             "parent_id": null,
    //             "sequance": "4",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 10,
    //                     "menu_id": "4",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 11,
    //                     "menu_id": "4",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 12,
    //                     "menu_id": "4",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 13,
    //                     "menu_id": "4",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 5,
    //             "name": "Role",
    //             "slug": "role",
    //             "parent_id": null,
    //             "sequance": "5",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 14,
    //                     "menu_id": "5",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 15,
    //                     "menu_id": "5",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 16,
    //                     "menu_id": "5",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 17,
    //                     "menu_id": "5",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 6,
    //             "name": "Permission",
    //             "slug": "permission",
    //             "parent_id": null,
    //             "sequance": "6",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 18,
    //                     "menu_id": "6",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 19,
    //                     "menu_id": "6",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 21,
    //                     "menu_id": "6",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 7,
    //             "name": "Vendor",
    //             "slug": "vendor",
    //             "parent_id": null,
    //             "sequance": "7",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 22,
    //                     "menu_id": "7",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 23,
    //                     "menu_id": "7",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 24,
    //                     "menu_id": "7",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 25,
    //                     "menu_id": "7",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 8,
    //             "name": "Products",
    //             "slug": "products",
    //             "parent_id": null,
    //             "sequance": "8",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 26,
    //                     "menu_id": "8",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 27,
    //                     "menu_id": "8",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 28,
    //                     "menu_id": "8",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 29,
    //                     "menu_id": "8",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 9,
    //             "name": "Orders",
    //             "slug": "orders",
    //             "parent_id": null,
    //             "sequance": "9",
    //             "status": "1",
    //             "created_at": "2023-02-19T00:55:51.000000Z",
    //             "updated_at": "2023-02-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 30,
    //                     "menu_id": "9",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 31,
    //                     "menu_id": "9",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 32,
    //                     "menu_id": "9",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 33,
    //                     "menu_id": "9",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 10,
    //             "name": "Slide",
    //             "slug": "slide",
    //             "parent_id": null,
    //             "sequance": "10",
    //             "status": "1",
    //             "created_at": "2023-05-03T00:55:51.000000Z",
    //             "updated_at": "2023-05-03T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 34,
    //                     "menu_id": "10",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 35,
    //                     "menu_id": "10",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 36,
    //                     "menu_id": "10",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 37,
    //                     "menu_id": "10",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 11,
    //             "name": "Status",
    //             "slug": "status",
    //             "parent_id": null,
    //             "sequance": "11",
    //             "status": "1",
    //             "created_at": "2023-05-09T00:55:51.000000Z",
    //             "updated_at": "2023-05-09T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 38,
    //                     "menu_id": "11",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 39,
    //                     "menu_id": "11",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 40,
    //                     "menu_id": "11",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 41,
    //                     "menu_id": "11",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 12,
    //             "name": "Coupon",
    //             "slug": "coupon",
    //             "parent_id": null,
    //             "sequance": "12",
    //             "status": "1",
    //             "created_at": "2023-05-09T00:55:51.000000Z",
    //             "updated_at": "2023-05-09T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 42,
    //                     "menu_id": "12",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 43,
    //                     "menu_id": "12",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 44,
    //                     "menu_id": "12",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 45,
    //                     "menu_id": "12",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 13,
    //             "name": "Referral",
    //             "slug": "referral",
    //             "parent_id": null,
    //             "sequance": "13",
    //             "status": "1",
    //             "created_at": "2023-05-19T00:55:51.000000Z",
    //             "updated_at": "2023-05-19T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 46,
    //                     "menu_id": "13",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 47,
    //                     "menu_id": "13",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 48,
    //                     "menu_id": "13",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 49,
    //                     "menu_id": "13",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 14,
    //             "name": "Bundle",
    //             "slug": "bundle",
    //             "parent_id": null,
    //             "sequance": "14",
    //             "status": "1",
    //             "created_at": "2023-05-21T00:55:51.000000Z",
    //             "updated_at": "2023-05-21T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 50,
    //                     "menu_id": "14",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 51,
    //                     "menu_id": "14",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 52,
    //                     "menu_id": "14",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 53,
    //                     "menu_id": "14",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 15,
    //             "name": "Transaction",
    //             "slug": "transaction",
    //             "parent_id": null,
    //             "sequance": "15",
    //             "status": "1",
    //             "created_at": "2023-05-21T00:55:51.000000Z",
    //             "updated_at": "2023-05-21T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 54,
    //                     "menu_id": "15",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 55,
    //                     "menu_id": "15",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 56,
    //                     "menu_id": "15",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 57,
    //                     "menu_id": "15",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 16,
    //             "name": "Mail Config",
    //             "slug": "mail_config",
    //             "parent_id": null,
    //             "sequance": "16",
    //             "status": "1",
    //             "created_at": "2023-09-05T00:55:51.000000Z",
    //             "updated_at": "2023-09-05T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 58,
    //                     "menu_id": "16",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 59,
    //                     "menu_id": "16",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 60,
    //                     "menu_id": "16",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 61,
    //                     "menu_id": "16",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 17,
    //             "name": "Feedback",
    //             "slug": "feedback",
    //             "parent_id": null,
    //             "sequance": "17",
    //             "status": "1",
    //             "created_at": "2023-09-05T00:55:51.000000Z",
    //             "updated_at": "2023-09-05T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 66,
    //                     "menu_id": "17",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 67,
    //                     "menu_id": "17",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 }
    //             ]
    //         },
    //         {
    //             "id": 18,
    //             "name": "Web Settings",
    //             "slug": "web_settings",
    //             "parent_id": null,
    //             "sequance": "18",
    //             "status": "1",
    //             "created_at": "2023-09-05T00:55:51.000000Z",
    //             "updated_at": "2023-09-05T00:55:51.000000Z",
    //             "children": [
    //                 {
    //                     "id": 62,
    //                     "menu_id": "18",
    //                     "action_id": "1",
    //                     "action": {
    //                         "id": 1,
    //                         "name": "View"
    //                     }
    //                 },
    //                 {
    //                     "id": 63,
    //                     "menu_id": "18",
    //                     "action_id": "2",
    //                     "action": {
    //                         "id": 2,
    //                         "name": "Add"
    //                     }
    //                 },
    //                 {
    //                     "id": 64,
    //                     "menu_id": "18",
    //                     "action_id": "3",
    //                     "action": {
    //                         "id": 3,
    //                         "name": "Edit"
    //                     }
    //                 },
    //                 {
    //                     "id": 65,
    //                     "menu_id": "18",
    //                     "action_id": "4",
    //                     "action": {
    //                         "id": 4,
    //                         "name": "Delete"
    //                     }
    //                 }
    //             ]
    //         }
    //     ]
    // }
);



onMounted(async () => {

    loading.value = "not";

    try {
        
        const roleAccess = await $fetch(`${EndPoint}/admin/${MasterKey}/roleAccess`,
            {
                method: 'get',
                headers: headers.value,
            }
        )

        loading.value = "success";
        nodes.value = roleAccess

        

    } catch (err) {
        console.log(err)
    }


    

})

// toggle function goes here for sub menu open
const toggle = (itemIndex) => {

    nodes.value.access[itemIndex] = {
        ...nodes.value.access[itemIndex],
        "opened" : !nodes.value.access[itemIndex].opened
    }

}


// Multiple checkbox function goes here for sub menu open
const multipleCheck = (itemIndex) => {

    nodes.value.access[itemIndex].children.forEach((item, index) => {

        nodes.value.access[itemIndex].children[index] = {
            ...nodes.value.access[itemIndex].children[index],
            "checked" : !nodes.value.access[itemIndex].children[index].checked
        }
        
    })

    

}



// Multiple checkbox function goes here for sub menu open
const singleCheck = (itemIndex, childeIndex, $event) => {


    nodes.value.access[itemIndex].children[childeIndex] = {
        ...nodes.value.access[itemIndex].children[childeIndex],
        "checked" : !nodes.value.access[itemIndex].children[childeIndex].checked
    }


    for (let i = 0; i < nodes.value.access[itemIndex].children.length; i++) {

        if(nodes.value.access[itemIndex].children[i].checked == false ){
            nodes.value.access[itemIndex] = {
                ...nodes.value.access[itemIndex],
                "indeterminate" : true
            }

            break;
        }else{
            nodes.value.access[itemIndex] = {
                ...nodes.value.access[itemIndex],
                "indeterminate" : false
            }

        }
    }

}



const checkRoles = async (e) => {

    loading.value = "not";

    const result = await $fetch(`${EndPoint}/admin/${MasterKey}/roleAccess/${e.value}`,
        {
            method: 'get',
            headers: headers.value, 
        }
    )

    checkExitPermissions.value = result.access

    console.table(checkExitPermissions.value);
    console.table(nodes.value.access);
    

    // if(checkExitPermissions.value == ""){

    //     nodes.value.access.map((data, index) => {

    //         data.children.map((childData, childeIndex) => {
    //                 nodes.value.access[index].children[childeIndex].menu_id = {
    //                 ...nodes.value.access[index].children[childeIndex],
    //                 "checked" : false
    //             }

                
    //                 nodes.value.access[index] = {
    //                     ...nodes.value.access[index],
    //                     "indeterminate" : true
    //                 }
                
    //         })

    //     })

    // }else{

    //     checkExitPermissions.value.map((data, index) => {

    //         let findData = nodes.value.access.find((element) => element.id == data.menu_id);

    //         console.log(findData);

    //         if(findData.id !== undefined){
    //             data.children.map((childData, childeIndex) => {
    //                 if(nodes.value.access[index].children[childeIndex] != undefined){
    //                     nodes.value.access[index].children[childeIndex] = {
    //                         ...nodes.value.access[index].children[childeIndex],
    //                         "checked" : !nodes.value.access[index].children[childeIndex].checked
                            
    //                     }
                    
    //                 }

    //                 if(nodes.value.access[index].children.length == data.children.length ){
    //                     nodes.value.access[index] = {
    //                         ...nodes.value.access[index],
    //                         "indeterminate" : false
    //                     }
    //                 }else{
    //                     nodes.value.access[index] = {
    //                         ...nodes.value.access[index],
    //                         "indeterminate" : true
    //                     }

    //                 }
    //             })
    //         }
        
    //     })
    // }


    
    loading.value = "success";
}




// Update Function goes here

const updateRoles = async (e) => {

    loading.value = "not";

    let menus = [];
    for (let i = 0; i < nodes.value.access.length; i++) {

        for (let j = 0; j < nodes.value.access[i].children.length; j++) {

            if(nodes.value.access[i].children[j].checked) {
                let childId = nodes.value.access[i].children[j].action_id;

                menus[nodes.value.access[i].id] = {  ...menus[nodes.value.access[i].id], [childId] : childId }

            }

        }
    }

    updatePermissions.value = menus;

    const result = await $fetch(`${EndPoint}/admin/${MasterKey}/roleAccess/${roleId.value}`,
            {
                method: 'post',
                headers: headers.value,
                body: {
                    roles:updatePermissions.value,
                    exits : exits.value
                }
            }
           
        )


        if (result == "Success") {
            toast.add({
                severity: 'success',
                summary: 'Role Permission Update',
                detail: result.message || 'Role Permission Update successfully.',
                life: 2000,
            });


        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: result.message || 'An error occurred.',
                life: 2000,
            });
        }
        
        loading.value = "success";

}


</script>

<template>
    <NuxtLayout :name="layout">
            <div v-if="loading !== 'success' " class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                <div class="w-12 mx-auto"><img alt="loading..." src="/spinner.gif"></div>
            </div>

            <form class="w-full px-3 mt-1" @submit.prevent="updateRoles">

                <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md">
                    <div class="flex w-full justify-between bg-gray-400 text-white">
                        
                        <div class="font-semibold mt-1 ml-3">User Permission</div>
                        <div class="font-semibold ml-1 flex">
                            <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-2 text-sm transition delay-100">
                                <Icon name="gg:arrow-left-o"></Icon>
                                Back
                            </button>
                        </div>
                        
                    </div>

                    <!-- Table list goes here -->
                    <div class=" h-[calc(100vh-10.4rem)] overflow-y-auto border-b px-3 pt-3">

                        <Dropdown :pt="{
                            root: {
                                class: 'md:ml-4'
                            }
                        }" v-model="roleId" editable :options="nodes.roles" optionValue="id" optionLabel="name" @change="checkRoles" placeholder="Select Roles" class="w-full md:w-1/3" />



                        <ul  class="w-full pl-4 ">

                            <li v-for="(item, index) in nodes.access" :key="index">
                                
                                <div class="p-1 cursor-pointer flex ">
                                    <div @click="toggle(index)" class="w-6 h-8 text-center ease-in duration-300">
                                        <Icon name="iconamoon:arrow-right-2" :class="`${item.opened ? 'rotate-90' : ''}`" class="ease-in duration-300 text-2xl"></Icon>
                                    </div>
                                    <div class="-mt-[2px] flex">
                                        <input class="mr-2" :class="`_${item.id}`" v-bind="item.id" :checked="item.indeterminate != false ? false : true" :indeterminate="item.indeterminate" type="checkbox" @click="multipleCheck(index)"  :id="item.id">
                                        <label :for="item.id" class="text-md mt-1">{{ item.name }}</label>
                                    </div>
                                </div>

                                <ul class="ml-12 border-l pl-2 w-fit ease-in duration-300 overflow-hidden transition-all" :class="`${item.opened ? 'h-full' : 'h-[0px]'}`" v-if="item.children">
                                    <li v-for="(child, childKey) in item.children" :key="childKey">
                                        <div class="mt-1 flex">
                                            <input class="mr-2" name="actions[]" :value="child.id" @click="singleCheck(index, childKey, $event)" :checked="child.checked" type="checkbox" :id="item.id">
                                            <label :for="item.id" class="text-md -mt-[2px]">{{ child.action.name }}</label>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        
                    </div>
                    <div class="flex">
                        <div class="" >
                            <button type="submit" class="bg-yellow-500 px-4 py-2 text-white items-center">Update</button>
                        </div>
                        <div class="flex ml-4">

                            <input id="exit" v-model="exits" type="checkbox" />
                            <label class="ml-2 mt-1" for="exit">This will effect on existing users</label>
                        </div>
                    </div>
                </div>
                
            </form>
        </NuxtLayout>
</template>

<style>
    ul li ul li{
        padding: 0 !important;
    }
    .p-tree .p-tree-container .p-treenode {
        margin: 1px;
        padding: 0;
    }


    .p-checkbox .p-checkbox-box {
        width: 20px;
        height: 20px;
        color: #323130;
        border-radius: 2px;
        /* transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s; */
    }

    .p-tree .p-tree-container .p-treenode .p-treenode-content {
        border-radius: 2px;
        transition: box-shadow 0.2s;
        padding: 0 !important;
    }
    .p-treenode-children {
        padding-left: 26px
    }
</style>