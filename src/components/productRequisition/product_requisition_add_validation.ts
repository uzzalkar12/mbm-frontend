import * as Yup from "yup";

const productSchema =  Yup.object().shape({
    requested_quantity: Yup.number().nullable(true).typeError('Req. quantity is a number field').transform((v, o) => (o === '' ? null : v)).positive().integer().moreThan(0, 'Req. quantity must be greater than zero')
        .max(9999999).label("Req. quantity"),
    requested_comment: Yup.string().nullable(true).transform((v, o) => (o === '' ? null : v)).min(1).max(255).label("Req. comment"),
});

const productRequisitionAddValidation = Yup.object().shape({
    products: Yup.array().of(productSchema).min(1)
})

export default productRequisitionAddValidation
