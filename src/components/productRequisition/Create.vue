<template>
  <div v-if="fetching">
    <Form id="form" @submit="save" :validation-schema="productRequisitionValidationSchema" v-slot="{ errors }">
      <div class="card">
        <div class="card-body p-9">
          <div class="table-responsive">
            <FieldArray name="products">
              <table class="table table-row-bordered table-row-gray-300 gy-7">
                <thead>
                <tr class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0 justify-content-end">
                  <th>Name</th>
                  <th>Unit</th>
                  <th>New Qty</th>
                  <th>Comment</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(product, idx) in products" :key="idx">
                  <td class="text-gray-600">{{ product.name }}</td>
                  <td class="text-gray-600">{{ product.unit }}</td>
                  <td>
                    <Field type="text" v-model="products[idx].requested_quantity" :id="'requested_quantity_'+product.id" :name="`products[${idx}].requested_quantity`" :class="{ 'is-invalid': errors[`products[${idx}].requested_quantity`] }" class="form-control form-control-sm"/>
                    <ErrorMessage class="text-danger" :name="`products[${idx}].request_quantity`"/>
                  </td>
                  <td>
                    <Field type="text" v-model="products[idx].requested_comment" :id="'requested_comment_'+product.id"  :name="`products[${idx}].requested_comment`" class="form-control form-control-sm"/>
                  </td>
                </tr>
                <tr v-if="products.length == 0">
                  <td colspan="9" class="text-center text-gray-600">
                    No product found
                  </td>
                </tr>
                </tbody>
              </table>
            </FieldArray>
          </div>
        </div>
        <div v-if="products.length > 0" class="card-footer d-flex justify-content-end py-6 px-9">
          <button type="button" class="btn btn-sm btn-light me-2" @click="$router.back()">Back</button>
          <button :data-kt-indicator="btnLoading ? 'on' : null" class="btn btn-sm btn-primary" type="submit">
              <span v-if="!btnLoading" class="indicator-label">Submit
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <inline-svg src="/media/icons/duotune/arrows/arr064.svg" />
                </span>
              </span>
            <span v-if="btnLoading" class="indicator-progress">Please wait...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
          </button>
        </div>
      </div>
    </Form>
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
import {productRequisitionData} from "@/components/productRequisition/product_requisition";
import productRequisitionAddValidation from "@/components/productRequisition/product_requisition_add_validation";
import { Field, Form, ErrorMessage, FieldArray } from 'vee-validate';
import { useToast } from "vue-toastification";
import {useRouter} from "vue-router";
import $ from 'jquery'
import moment from "moment";
export default defineComponent({
  components: {Field, Form, ErrorMessage, FieldArray},
  name: "Index",
  setup: function () {
    const router = useRouter()
    const fetching = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const btnLoading = ref<boolean>(false);
    const toast = useToast();
    const product_requisition = ref(productRequisitionData)
    let products = ref<Array<any>>([]);
    let product_ids = ref<Array<any>>([]);
    const productRequisitionValidationSchema = ref(productRequisitionAddValidation)

    onMounted(async () => {
      await getProducts()
    });

    const save = async () => {
      btnLoading.value = true
      const productRequisitionItemArray: any[] = []

      product_ids.value.forEach(id => {
        const requestQtyDiv = '#requested_quantity_' + id
        const requested_quantity = $(requestQtyDiv).val()

        const requestQuantityDiv = '#requested_comment_' + id
        const requested_comment = $(requestQuantityDiv).val()

        if (requested_quantity) {
          const productRequisitionItem = {
            product_id: id,
            requested_quantity: requested_quantity,
            requested_comment: requested_comment,
          }
          productRequisitionItemArray.push(productRequisitionItem)
        }
      })

      if (productRequisitionItemArray.length === 0) {
        useToast().error('Insert at least one product', {
          timeout: 2000,
        })
        return
      }

      const formData = new FormData()
      formData.append('product_requisition_items', JSON.stringify(productRequisitionItemArray))

      await store.dispatch(Actions.PRODUCT_REQUISITION_STORE, {product_requisition: formData}).then(() => {
        btnLoading.value = false;
        router.push({ name: "productRequisitions" });
      }).catch(() => {
        btnLoading.value = false;
      })
    };


    const getProducts = async () => {
      loading.value = true
      await store.dispatch(Actions.FETCH_PRODUCT_REQUISITION_LIST_CODES).then(async() => {
        products.value = await JSON.parse(JSON.stringify(computed(() => store.getters.getProductRequisitionProducts).value))
        product_ids.value = await JSON.parse(JSON.stringify(computed(() => store.getters.getProductRequisitionProductIds).value))
      }).finally(() => {
        loading.value = false
        fetching.value = true
      })
    }

    return {
      fetching,
      productRequisitionValidationSchema,
      save,
      loading,
      products,
      btnLoading,
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
