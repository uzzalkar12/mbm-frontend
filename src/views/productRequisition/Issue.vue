<template>
  <div class="card">
    <Form id="product_requisition_search_form" @submit="searchProductRequisition">
      <div class="card-body">
        <div class="row fv-row">
          <div class="col-xl-4">
            <Field id="date_range" name="date_range" v-slot="{ field }">
              <Datepicker v-bind="field" v-model="search_data.date_range"
                          :format="productRequisitionDateFormat" :enableTimePicker="false" autoApply
                          monthNameFormat="long" placeholder="Select date"
                          range multi-calendars
                          popper-class="override-styles"
              ></Datepicker>
            </Field>
          </div>
          <div class="col-xl-4">
            <button :data-kt-indicator="searchBtnLoading ? 'on' : null" class="btn btn-sm btn-primary" type="submit">
              <span v-if="!searchBtnLoading" class="indicator-label">Search
                <span class="svg-icon svg-icon-3 ms-2 me-0">
                  <inline-svg src="/media/icons/duotune/arrows/arr064.svg" />
                </span>
              </span>
              <span v-if="searchBtnLoading" class="indicator-progress">Please wait...
                    <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </Form>
  </div>
  <div class="card mt-2">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <span class="svg-icon svg-icon-1 position-absolute ms-6">
            <inline-svg src="/media/icons/duotune/general/gen021.svg" />
          </span>
          <input type="text" v-model="search" @input="searchItems()" class="form-control form-control-sm form-control-solid w-300px ps-15" placeholder="Search Product Requisition"/>
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end">
          <!--begin::Export-->
          <!--end::Export-->
          <!--begin::Add purchase request-->
          <!--end::Add purchase request-->
        </div>
        <!--end::Toolbar-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <Datatable @on-sort="sort" :loading="loading" :data="product_requisitions" :header="tableHeader" :enable-items-per-page-dropdown="true">
        <template v-slot:product_requisition_number="{ row: product_requisition }">{{ product_requisition.product_requisition_number }}</template>
        <template v-slot:created_at="{ row: product_requisition }">{{ dateFormat(product_requisition.created_at) }}</template>
        <template v-slot:actions="{ row: product_requisition }">
          <div class="flex flex-column">
            <router-link :to="{name:'productRequisitionsIssueDetails', params:{ product_requisition_id: product_requisition.id }}" class="btn btn-sm btn-info me-2">
              <i class="bi bi-eye fs-4"></i> Details
            </router-link>
            <router-link :to="{name:'productRequisitionsIssueCreate', params:{ product_requisition_id: product_requisition.id }}" class="btn btn-sm btn-primary me-2">
              <i class="bi bi-plus fs-4"></i> Issue Create
            </router-link>
            <router-link :to="{name:'productRequisitionsIssueUpdate', params:{ product_requisition_id: product_requisition.id }}" class="btn btn-sm btn-success me-2">
              <i class="bi bi-pencil-square fs-4"></i> Issue Update
            </router-link>
          </div>

        </template>
      </Datatable>
    </div>
  </div>
</template>
<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import {InterfaceProductRequisition, tableHeaderData} from "@/components/productRequisition/product_requisition";
import store from "@/store";
import { Field, Form } from 'vee-validate';
import {Actions} from "@/store/enums/ProductRequisitionEnums";
import {Sort} from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.min.js";

export default defineComponent({
  name: "index",
  components: {
    Datatable, Field, Form
  },
  setup(props, {emit}) {
    const tableHeader = ref(tableHeaderData);
    const search = ref<string>("");
    const loading = ref(false);
    const searchBtnLoading = ref(false);
    const product_requisitions = ref<Array<InterfaceProductRequisition>>([]);
    const initProductRequisitions = ref<Array<InterfaceProductRequisition>>([]);
    const product_requisition = ref({});
    const product_requisition_number = ref(null);
    const current = ref(0);
    const product_requisition_statuses = ref([]);
    const product_requisition_status = ref([]);

    const search_data = ref({
      date_range: '',
    })


    const searchProductRequisition = async () => {
      searchBtnLoading.value = true
      loading.value = true
      await store.dispatch(Actions.PRODUCT_REQUISITION_LISTS, search_data.value).then(() => {
        const productRequisitionList = JSON.parse(JSON.stringify(computed(() => store.getters.getProductRequisitions).value))

        product_requisitions.value.splice(0, product_requisitions.value.length, ...productRequisitionList);
        initProductRequisitions.value.splice(0, initProductRequisitions.value.length, ...productRequisitionList);
        loading.value = false
        searchBtnLoading.value = false
      }).catch((error) => {
        loading.value = false
        searchBtnLoading.value = false
      })
    }


    const searchItems = () => {
      product_requisitions.value.splice(0, product_requisitions.value.length, ...initProductRequisitions.value);
      if (search.value !== "") {
        let results: Array<InterfaceProductRequisition> = [];
        for (let j = 0; j < product_requisitions.value.length; j++) {
          if (searchingFunc(product_requisitions.value[j], search.value)) {
            results.push(product_requisitions.value[j]);
          }
        }
        product_requisitions.value.splice(0, product_requisitions.value.length, ...results);
      }
    };
    const searchingFunc = (obj, value): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].indexOf(value) != -1) {
            return true;
          }
        }
      }
      return false;
    };
    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(product_requisitions.value, sort.label, { reverse });
      }
    };

    const deleteProductRequisition = (product_requisition:InterfaceProductRequisition) => {
      Swal.fire({
        title: "Confirm",
        text: `Are you sure to delete "${product_requisition.product_requisition_number}" ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F85606',
        cancelButtonColor: '#525252',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        buttonsStyling: true
      }).then(async function (isConfirm) {
        if (isConfirm.value === true) {
          await store.dispatch(Actions.PRODUCT_REQUISITION_DELETE, {
            id: product_requisition.id
          })

          await searchProductRequisition()
        }
      });
    }

    const productRequisitionDateFormat = (date:any) => {
      const startDate = moment(date[0]).format('YYYY-MM-DD');
      const endDate = moment(date[1]).format('YYYY-MM-DD');
      return `${startDate} - ${endDate}`
    }

    const dateFormat = (date) => {
      return moment(date).format('YYYY-MM-DD')
    }

    return {
      loading,
      product_requisitions,
      product_requisition,
      product_requisition_number,
      current,
      product_requisition_statuses,
      product_requisition_status,
      tableHeader,
      search,
      searchItems,
      sort,
      search_data,
      searchBtnLoading,
      productRequisitionDateFormat,
      searchProductRequisition,
      dateFormat,
      deleteProductRequisition,
    };
  }
});
</script>