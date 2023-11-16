
interface InterfaceProductRequisition {
    id?: number | string;
    product_requisition_number: string;
    created_at?: string;
}

const productRequisitionData = {
    id: '',
    product_requisition_items: [],
}

const tableHeaderData = [
    {
        columnName: "PR Number",
        columnLabel: "product_requisition_number",
        sortEnabled: true,
        columnWidth: 250,
    },
    {
        columnName: "Created Date",
        columnLabel: "created_at",
        sortEnabled: true,
        columnWidth: 150,
    },
    {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
    },
];

export {InterfaceProductRequisition, productRequisitionData, tableHeaderData}