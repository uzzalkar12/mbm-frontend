interface InterfaceProductRequisitionItem {
    id?: number | null | undefined;
    product_requisition_id: number;
    product_id: number;
    requested_quantity: number;
    requested_comment: string | null;
    created_at: string;
    product?: Array<any> | null;
}

export {InterfaceProductRequisitionItem}