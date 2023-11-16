import * as Yup from "yup";

const productSchema =  Yup.object().shape({
    accept_quantity: Yup.number().nullable(true).typeError('Accept quantity is a number field').transform((v, o) => (o === '' ? null : v)).positive().integer().moreThan(0, 'Accept quantity must be greater than zero')
        .max(9999999).label("Accept quantity"),
    total_amount: Yup.string().nullable(true).transform((v, o) => (o === '' ? null : v)).min(1).max(255).label("Total amount"),
});

const productRequisitionAddValidation = Yup.object().shape({
    //product_stocks: Yup.array().of(productSchema).min(1)
})

export default productRequisitionAddValidation
