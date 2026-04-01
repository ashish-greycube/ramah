frappe.ui.form.on("Batch", {
    batch_id(frm) {
        frm.doc.custom_batch_no_barcode = frm.doc.batch_id
        frm.refresh_field('custom_batch_no_barcode')
    }
})
