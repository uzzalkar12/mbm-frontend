enum Actions {
  // action types
  PRODUCT_REQUISITION_LISTS = "productRequisitionLists",
  PRODUCT_REQUISITION_STORE = "productRequisitionStore",
  FETCH_PRODUCT_REQUISITION = "fetchProductRequisition",
  PRODUCT_REQUISITION_LIST = "productRequisitionList",
  PRODUCT_REQUISITION_UPDATE = "productRequisitionUpdate",
  PRODUCT_REQUISITION_DELETE = "productRequisitionDelete",
  FETCH_PRODUCT_REQUISITION_LIST_CODES = "fetchProductRequisitionListCodes",
  PRODUCT_REQUISITION_ISSUE_STORE = "productRequisitionIssueStore",
  PRODUCT_REQUISITION_ISSUE_UPDATE = "productRequisitionIssueUpdate",
  FETCH_PRODUCT_REQUISITION_ISSUE_LIST_CODES = "fetchProductRequisitionIssueListCodes",
}

enum Mutations {
  // mutation types
  SET_PRODUCT_REQUISITION_LISTS = "setProductRequisitionLists",
  SET_PRODUCT_REQUISITION_SUPPLIER = "setProductRequisitionSupplier",
  SET_PRODUCT_REQUISITION_LIST = "setProductRequisitionList",
  SET_PRODUCT_REQUISITION = "setProductRequisition",
  SET_PRODUCT_REQUISITION_ISSUE = "setProductRequisitionIssue",
  SET_PRODUCT_REQUISITION_PRODUCT_LIST = "setProductRequisitionProductList",
  SET_PRODUCT_REQUISITION_PRODUCT_IDS = "setProductRequisitionProductIds",
  SET_PRODUCT_REQUISITION_FOR_UPDATE = "setProductRequisitionForUpdate",
}

export { Actions, Mutations };
