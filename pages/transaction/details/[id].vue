<script setup>
const { dateMonthFunction, dateFunction } = useDataDate();
// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;

const transaction = ref(null)
const loading = ref('not')
const route = useRoute();
const userId = route.params.id;

const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})

definePageMeta({
    layout: "dashboard",
    middleware: "auth",
})

const totalPurchases = ref(0)

const fetchTransacationDetails = async () => {
    loading.value = "not";
    try {

        const response = await $fetch(`${EndPoint}/admin/${MasterKey}/transaction?orderBy=desc&page=1&and_user_id=${userId}`, {
        method: 'get',
        headers: headers.value,
        });
        transaction.value = response.trasactions

        // Calculate the total amount for all data
        totalPurchases.value = transaction.value.data.reduce((sum, transac) => {
        return sum + (transac.total_amount || 0); // Add total_amount, default to 0 if undefined
        }, 0);

        // console.log(totalPurchases.value)
        // console.log("T",transaction.value)
    } catch (error) {
        console.log(error);
    }
    loading.value = "success";
}

fetchTransacationDetails()

function printPage() {
  if (process.client) {
    window.print();
  }
}
</script>
<template>
    <NuxtLayout :name="layout">
        <div class="w-full px-3 mt-1">
            <div v-if="loading !== 'success'" class="min-h-screen w-full top-0 left-0 z-30 flex items-center fixed">
                <div class="w-12 mx-auto">
                    <img alt="loading..." src="/spinner.gif" />
                </div>
            </div>
            <!-- <div class="shadow-md bg-white w-full h-[calc(100vh-6rem)] overflow-hidden rounded-md print:overflow-auto"> -->
                <!-- <div class="flex w-full justify-between bg-gray-400 text-white print:hidden">
                    <div class="font-semibold mt-1 ml-3">Transaction Details</div>
                    <div class="font-semibold ml-1 flex">
                        <button @click="$router.back()" class="bg-[#800] hover:bg-red-500 text-gray-100 hover:text-black px-4 py-1 text-sm transition delay-100">
                            <Icon name="gg:arrow-left-o"></Icon>
                            Back
                        </button>
                    </div>                    
                </div> -->
                <!-- <div class=" h-[calc(100vh-11.6rem)] overflow-y-auto border-b px-3 pt-3"> -->
                    <div class="-mx-4 mt-8 flow-root sm:mx-0 print:min-h-full">
                        <div class="max-w-6xl mx-auto p-8 bg-white rounded border-2 shadow-md my-6 mt-2" id="invoice">
                            <div class="grid grid-cols-2 items-center">
                                <div>
                                    <!--  Company logo  -->
                                    <img src="https://coderorbit.com/_next/static/media/coderorbit.3e82d816.png" alt="company-logo" height="100" width="100">
                                </div>

                                <div class="text-right">
                                    <p>coderorbit.com</p>
                                    <p class="text-gray-500 text-sm">sales@coderorbit.com</p>
                                    <p class="text-gray-500 text-sm mt-1">+880-1712345678</p>
                                    <p class="text-gray-500 text-sm mt-1">VAT: 8657671212</p>
                                </div>
                            </div>
                            <!-- Client info -->
                            <div class="grid grid-cols-2 items-center mt-8">
                                <div>
                                    <p class="font-bold text-gray-800">Transaction Details:</p>
                                    <p class="text-gray-500">
                                        Name: {{ transaction?.data[0].extend_props.contact.name }}
                                        <br />
                                        Address: {{ transaction?.data[0].extend_props.contact.address }}
                                    </p>
                                    <p class="text-gray-500">Mobile No: {{ transaction?.data[0].extend_props.contact.mobile }}</p>
                                </div>
                            </div>

                            <!-- Invoice Items -->
                            <div class="-mx-4 mt-8 flow-root sm:mx-0">
                                <table class="min-w-full">
                                    <thead class="border-b border-gray-400 bg-gray-100 text-gray-900 ">
                                        <tr>
                                            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">SL</th>
                                            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Order Id</th>
                                            <th scope="col" class="hidden py-3 pl-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Transaction Id</th>
                                            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Debit</th>
                                            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Credit</th>
                                            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Total</th>
                                            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Date</th>
                                            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Payment Method</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(transac, idx) in transaction?.data" :key="transac.id" class="border-b border-gray-200">
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ idx + 1 }}</td>
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ transac.order_id}}</td>
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ transac.transaction_id }}</td>
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ transac.debit }}</td>
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ transac.credit }}</td>
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell"><Currency :amount="transac.total_amount"/> </td>
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{dateMonthFunction(transac.updated_at)}}</td>
                                            <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ transac.payment_method }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div class="w-full flex">
                                    <div class="w-8/12">
                                        <img src="https://i.ibb.co.com/6gDfDYK/qr-code.png" alt="" height="100" width="100">
                                    </div>
                                    <div class="w-6/12 text-right">
                                        <table class="inline-table">
                                            <tbody>
                                                <tr>
                                                    <th scope="row" colspan="3" class="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">Total Purchases:</th>
                                                    <th scope="row" class="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total Purchases:</th>
                                                    <td class="pl-3 pr-4 pt-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"><Currency :amount="totalPurchases"/></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <!--  Footer  -->
                            <!-- <div class="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                                Please pay the invoice before the due date. You can pay the invoice by logging in to your account fromour client portal.
                            </div> -->

                        </div>
                    </div>
                <!-- </div> -->
                <div class="flex justify-center print:hidden">
                    <button type="button" class="bg-red-800 text-white py-2 px-4 my-3 rounded-sm m-1" @click="$router.back()">Back</button>
                    <button type="button" class="bg-red-800 text-white py-2 px-4 my-3 rounded-sm m-1" @click="printPage">Print</button>
                </div>
            <!-- </div> -->

        </div>

    </NuxtLayout>
</template>