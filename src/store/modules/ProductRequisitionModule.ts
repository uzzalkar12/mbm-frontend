import ApiService from "@/core/services/ApiService";
import { Actions, Mutations } from "@/store/enums/ProductRequisitionEnums";
import { Actions as StoreActions, Mutations as StoreMutations } from "@/store/enums/StoreEnums";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import {useToast} from "vue-toastification";
export interface ProductRequisitions {
  product_requisitions: Array<object>
}

export interface Products {
  products: Array<object>
}

export interface ProductIds {
  product_ids: Array<object>
}
export interface Suppliers {
  suppliers: Array<object>
}

export interface ProductRequisition {
  product_requisition: any
}
export interface ProductRequisitionIssue {
  product_requisition_issue: any
}
export interface ProductRequisitionInfo {
  errors: unknown;
  product_requisitions: ProductRequisitions;
  product_requisition: ProductRequisition;
  products: Products;
  product_ids: ProductIds;
  product_requisition_issue: ProductRequisitionIssue;
  suppliers: Suppliers;
}

@Module
export default class ProductRequisitionModule extends VuexModule implements ProductRequisitionInfo {
  errors = {};
  product_requisitions = {} as ProductRequisitions;
  product_requisition = {} as ProductRequisition;
  products = {} as Products;
  product_ids = {} as ProductIds;
  product_requisition_issue = {} as ProductRequisitionIssue;
  suppliers = {} as Suppliers;

  /**
   * Get all product_requisitions
   * @returns ProductRequisitions
   */
  get getProductRequisitions(): ProductRequisitions {
    return this.product_requisitions;
  }

  /**
   * Get all products
   * @returns Porducts
   */
  get getProductRequisitionProducts(): Products {
    return this.products;
  }

  /**
   * Get all product_ids
   * @returns ProductIds
   */
  get getProductRequisitionProductIds(): ProductIds {
    return this.product_ids;
  }

  /**
   * Get all product_ids
   * @returns ProductIds
   */
  get getSuppliers(): Suppliers {
    return this.suppliers;
  }

  /**
   * get product_requisition
   * @returns object
   */
  get getProductRequisition(): object {
    return this.product_requisition;
  }

  /**
   * get product_requisition_issue
   * @returns object
   */
  get getProductRequisitionIssue(): object {
    return this.product_requisition_issue;
  }

  /**
   * Get product_requisition errors
   * @returns array
   */
  get getProductRequisitionErrors() {
    return this.errors;
  }

  @Mutation
  [StoreMutations.SET_ERROR](error) {
    this.errors = { ...error };
  }

  @Mutation
  [Mutations.SET_PRODUCT_REQUISITION_PRODUCT_LIST](payload) {
    this.products = payload;
  }
  @Mutation
  [Mutations.SET_PRODUCT_REQUISITION_PRODUCT_IDS](payload) {
    this.product_ids = payload;
  }
  @Mutation
  [Mutations.SET_PRODUCT_REQUISITION_LISTS](payload) {
    this.product_requisitions = payload;
  }

  @Mutation
  [Mutations.SET_PRODUCT_REQUISITION](payload) {
    this.product_requisition = payload
  }
  @Mutation
  [Mutations.SET_PRODUCT_REQUISITION_FOR_UPDATE](payload) {
    this.product_requisition = payload
  }

  @Mutation
  [Mutations.SET_PRODUCT_REQUISITION_ISSUE](payload) {
    this.product_requisition_issue = payload
  }
  @Mutation
  [Mutations.SET_PRODUCT_REQUISITION_SUPPLIER](payload) {
    this.suppliers = payload
  }

  @Action
  [Actions.FETCH_PRODUCT_REQUISITION_LIST_CODES]() {
    return ApiService.get("/product-requisition/products")
        .then(({ data }) => {
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION_PRODUCT_LIST, data.products);
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION_PRODUCT_IDS, data.product_ids);
        })
        .catch(({ response }) => {
          toast('error', response.data.errors)
        });
  }

  @Action
  [Actions.FETCH_PRODUCT_REQUISITION_ISSUE_LIST_CODES](payload) {
    return ApiService.get("/product-requisitions/issue/" + payload)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION_ISSUE, data.product_requisition);
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION_SUPPLIER, data.suppliers);
        })
        .catch(({ response }) => {
          toast('error', response.data.errors)
        });
  }

  @Action
  [Actions.PRODUCT_REQUISITION_LISTS](payload) {
    return ApiService.post("/product-requisitions", payload)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION_LISTS, data.product_requisitions);
        })
        .catch(({ response }) => {
          toast('error', response.data.errors)
        });
  }
  @Action
  [Actions.PRODUCT_REQUISITION_ISSUE_STORE](payload) {
    return ApiService.post("/product-requisitions/issue/store", payload)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION_LISTS, data.product_requisitions);
        })
        .catch(({ response }) => {
          toast('error', response.data.errors)
        });
  }

  @Action
  [Actions.PRODUCT_REQUISITION_ISSUE_UPDATE](payload) {
    return ApiService.post("/product-requisitions/issue/update", payload)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION_LISTS, data.product_requisitions);
        })
        .catch(({ response }) => {
          toast('error', response.data.errors)
        });
  }

  @Action
  [Actions.FETCH_PRODUCT_REQUISITION](payload) {
    return ApiService.get("/product-requisitions/show/" + payload)
        .then(({ data }) => {
          this.context.commit(Mutations.SET_PRODUCT_REQUISITION, data.product_requisition);
        })
        .catch(({ response }) => {
          toast('error', response.data.errors)
        });
  }

  @Action // fetch purchase request
  [Actions.PRODUCT_REQUISITION_LIST](payload) {
    return ApiService.get("/product-requisitions/edit/" + payload).then(({data}) => {
      this.context.commit(Mutations.SET_PRODUCT_REQUISITION, data.product_requisition);
      this.context.commit(Mutations.SET_PRODUCT_REQUISITION_PRODUCT_LIST, data.products);
      this.context.commit(Mutations.SET_PRODUCT_REQUISITION_PRODUCT_IDS, data.product_ids);
    }).catch(({response}) => {
      toast('error', response.data)
    });
  }

  @Action
  [Actions.PRODUCT_REQUISITION_STORE](payload) {
    return ApiService.post("/product-requisitions/store", payload.product_requisition)
        .then(({ data }) => {
          toast('success', data)
        })
        .catch(({ response }) => {
          toast('error', response.data.errors)
        });
  }

  @Action
  [Actions.PRODUCT_REQUISITION_UPDATE](payload) {
    return ApiService.withImageUpdate("/product-requisitions/update/" + payload.id, payload.product_requisition)
        .then(({ data }) => {
          toast('success', data)
        })
        .catch(({ response }) => {
          toast('error', response.data)
        });
  }
  @Action
  [Actions.PRODUCT_REQUISITION_DELETE](payload) {
    return ApiService.delete("/product-requisitions/" + payload.id)
        .then(({ data }) => {
          toast('success', data)
        })
        .catch(({ response }) => {
          toast('error', response.data)
        });
  }
}

// common function
const toast = (type, data) => {
  if (type == 'error') {
    useToast().error(data.message, {
      timeout: 2000,
    })
  } else {
    useToast().success(data.message, {
      timeout: 2000,
    })
  }

}