<template>
  <div v-if="fetching">
    <div class="card">
      <div class="card-body p-9">
        <div class="table-responsive">
          <table class="table table-row-bordered table-row-gray-300 gy-7">
            <thead>
            <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0 justify-content-end">
              <th>Name</th>
              <th>Unit</th>
              <th>Requested Qty</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <template  v-for="(product_requisition_item, index) in product_requisition.product_requisition_items" :key="index">
              <tr>
                <td class="text-gray-600">{{ product_requisition_item.product.name }}</td>
                <td class="text-gray-600">{{ product_requisition_item.product.unit }}</td>
                <td class="text-gray-600">{{ product_requisition_item.requested_quantity }}</td>
                <td>
                  <table class="table table-rounded">
                    <thead>
                    <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0 justify-content-end">
                      <th>Amount</th>
                      <th>Unit Price</th>
                      <th>Issue Qty</th>
                      <th>Total Amount</th>
                      <th>Supplier</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="product_stock in product_requisition_item.product_stocks" :key="product_stock.id">
                      <td class="text-gray-600">{{ product_stock.quantity }}</td>
                      <td class="text-gray-600">{{ product_stock.unit_price }}</td>
                      <td class="text-gray-600">
                        <input disabled type="number" class="form-control form-control-sm" :name="'accept_quantity_' + product_stock.id" @keyup="productIssueStock(product_stock, product_requisition_item, product_requisition_item.product_stocks)" :id="'accept_quantity_' + product_stock.id" v-model="product_stock.accept_quantity">
                      </td>
                      <td class="text-gray-600">
                        <input disabled type="number" class="form-control form-control-sm" :name="'total_amount_' + product_stock.id" :id="'total_amount_' + product_stock.id" v-model="product_stock.total_amount">
                      </td>
                      <td class="text-gray-600">
                        <select disabled class="form-select form-select-sm" :name="'supplier_id_' + product_stock.id" :id="'supplier_id_' + product_stock.id" v-model="product_stock.supplier_id">
                          <option v-for="(supplier, index) in suppliers" :value="supplier.id" :key="index">{{ supplier.name }}</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td class="text-gray-600">
                        <input disabled type="text" class="form-control form-control-sm" :name="'requested_amount_' + product_requisition_item.id" :id="'requested_amount_' + product_requisition_item.id" v-model="product_requisition_item.requested_amount">
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

            </template>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="card" v-if="loading">
    <div class="card-body border-top p-9">
      <div class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref, onMounted, watch} from "vue";
import store from "@/store";
import {Actions} from "@/store/enums/ProductRequisitionEnums";
import { useToast } from "vue-toastification";
import {useRoute, useRouter} from "vue-router";
export default defineComponent({
  name: "Index",
  setup: function () {
    const route = useRoute()
    const router = useRouter()
    const fetching = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const btnLoading = ref<boolean>(false);
    const toast = useToast();
    const product_requisition = ref({})
    const suppliers = ref([])

    onMounted(async () => {
      await getProductRequisition()
    });

    const getProductRequisition = async () => {
      loading.value = true
      await store.dispatch(Actions.FETCH_PRODUCT_REQUISITION_ISSUE_LIST_CODES, route.params.product_requisition_id).then(async() => {
        product_requisition.value = await JSON.parse(JSON.stringify(computed(() => store.getters.getProductRequisitionIssue).value))
        suppliers.value = await JSON.parse(JSON.stringify(computed(() => store.getters.getSuppliers).value))
      }).finally(() => {
        loading.value = false
        fetching.value = true
      })
    }
    const productIssueStock = (product_stock, product_requisition_item, product_stocks) => {
      product_stock.total_amount = parseFloat(product_stock.accept_quantity) * parseFloat(product_stock.unit_price);
      product_requisition_item.requested_amount = product_stocks.reduce((total, stock) => {
        return total + stock.total_amount;
      }, 0);
    }

    const grandTotal = computed(() => {
      return 0;
    })


    return {
      fetching,
      product_requisition,
      loading,
      btnLoading,
      productIssueStock,
      suppliers,
      grandTotal,
    }
  },
})
;
</script>
<style scoped>
.form-control:disabled.is-invalid, .form-control[readonly].is-invalid {
  border-color: #f1416c;
}
</style>
