frappe.ui.form.on("Batch", {
    batch_id(frm) {
        frm.doc.custom_batch_no_barcode = frm.doc.batch_id
        frm.refresh_field('custom_batch_no_barcode')
    },
    validate(frm) {
        frm.doc.custom_batch_no_barcode = frm.doc.name
    },
    refresh(frm) {
        frm.doc.custom_batch_no_barcode = frm.doc.name
        frm.add_custom_button("PDF", function (frm) {
            let url = `/api/method/ramah.api.get_pdf_file`;
            let args = {
                doctype: cur_frm.doc.doctype,
                docname: cur_frm.doc.name
            };
            open_url_post(url, args, true);
        })
    }
})
