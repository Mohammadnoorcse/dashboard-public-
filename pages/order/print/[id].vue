<script setup>
// replace with actual API endpoint and master key
const config = useRuntimeConfig();
const EndPoint = config.public.baseURl;
const MasterKey = config.public.masterToken;
const app_token = useTokenStore().getToken;
const loading = ref('not');

const headers = ref({
    "Accept": "application/json",
    "Authorization": `Bearer ${app_token}`,
    "App-Master-Key": `${MasterKey}`
})

definePageMeta({
  layout: "dashboard",
  middleware: 'auth',
});

const route = useRoute();
const orderId = route.params.id;
const details = ref(null);

const fetchOrderDetails = async () => {
    try {
        details.value = await $fetch(`${EndPoint}/admin/${MasterKey}/orders/${orderId}`, {
            method: 'GET',
            headers: headers.value,
        });
        console.table(details.value);
    } catch (err) {
        console.log(err);
    }
    
};

fetchOrderDetails();

function printPage() {
  if (process.client) {
    window.print();
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-8 bg-white rounded border-2 shadow-md my-6" id="invoice">

    <div class="grid grid-cols-2 items-center">
      <div>
        <!--  Company logo  -->
        <img src="https://coderorbit.com/_next/static/media/coderorbit.3e82d816.png" alt="company-logo" height="100" width="100">
      </div>

      <div class="text-right">
        <p>
          coderorbit.com
        </p>
        <p class="text-gray-500 text-sm">
          sales@coderorbit.com
        </p>
        <p class="text-gray-500 text-sm mt-1">
          +880-1712345678
        </p>
        <p class="text-gray-500 text-sm mt-1">
          VAT: 8657671212
        </p>
      </div>
    </div>

    <!-- Client info -->
    <div class="grid grid-cols-2 items-center mt-8">
      <div>
        <p class="font-bold text-gray-800">
          Bill to :
        </p>
        <p class="text-gray-500">
            Name: {{ details?.extend_props.contact.name }}
          <br />
          Address: {{ details?.extend_props.contact.address }}
        </p>
        <p class="text-gray-500">
            Email: {{ details?.created_by.email }}
        </p>
      </div>

      <div class="text-right">
        <p class="">
          Invoice number:
          <span class="text-gray-500">INV-{{ details?.unique_id }}</span>
        </p>
        <p>
          Invoice date: <span class="text-gray-500">{{ details?.created_at.trim().split('T')[0] }}</span>
        </p>
      </div>
    </div>

    <!-- Invoice Items -->
    <div class="-mx-4 mt-8 flow-root sm:mx-0">
      <table class="min-w-full">
        <thead class="border-b border-gray-400 bg-gray-100 text-gray-900">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">SL</th>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Items</th>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">Quantity</th>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">Price</th>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">Amount</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in details?.order_items" :key="index" class="border-b border-gray-200">
                <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{index + 1}}</td>
                <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ item.item_name }}</td>
                <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell">{{ item.quantity }}</td>
                <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell"><Currency :amount="item.current_price"/></td>
                <td class="hidden px-3 py-5 text-left text-sm text-gray-500 sm:table-cell"><Currency :amount="item.grand_total" /></td>
            </tr>
        </tbody>
      </table>
    </div>
    <div class="w-full flex">
                <div class="w-8/12">
                    <img src="https://i.ibb.co.com/6gDfDYK/qr-code.png" alt="" height="100" width="100">
                </div>
                <div class="w-4/12 text-right">
                    <table class="inline-table">
                        <tbody>
                      <tr>
                          <th scope="row" colspan="3"
                              class="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                              Subtotal:
                          </th>
                          <th scope="row"
                              class="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">Subtotal:
                          </th>
                          <td class="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0"><Currency :amount="details?.total"/></td>
                      </tr>
                        <tr>
                          <th scope="row" colspan="3" class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">Tax:</th>
                          <td class="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0"><Currency :amount="details?.order_items.reduce((total, item) => total + item.extend_props.tax, 0)"/></td>
                        </tr>
                      <tr>
                          <th scope="row" colspan="3"
                              class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                              Discount:
                          </th>
                          <th scope="row"
                              class="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Discount:
                          </th>
                          <td class="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0"><Currency :amount="details?.discount"/></td>
                      </tr>
                      <tr>
                          <th scope="row" colspan="3"
                              class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                              Shipping Fee:
                          </th>
                          <th scope="row"
                              class="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">Shipping Fee:
                          </th>
                          <td class="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0"><Currency :amount="0"/></td>
                      </tr>
                      <tr>
                          <th scope="row" colspan="3"
                              class="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">
                              Total:
                          </th>
                          <th scope="row"
                              class="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total:
                          </th>
                      <td class="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"><Currency :amount="details?.total - details?.discount"/></td>
                      </tr>
                  </tbody>
                    </table>
                </div>
              </div>

              <!--  Footer  -->
              <div class="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
                Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client
                portal.
              </div>

  </div>

<div class="flex justify-center print:hidden">
  <button type="button" class="bg-red-800 text-white py-2 px-4 my-3 rounded-sm m-2" @click="$router.back()">Back</button>
  <button type="button" class="bg-red-800 text-white py-2 px-4 my-3 rounded-sm m-2" @click="printPage">Print</button>
</div>
</template>