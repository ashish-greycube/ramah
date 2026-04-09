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
                docname: cur_frm.doc.name,
                args_data: [{
                    batch_no: cur_frm.doc.name,
                    qty: cur_frm.doc.batch_qty,
                    item_name: cur_frm.doc.item_name,
                    item_code: cur_frm.doc.item,
                    width: cur_frm.doc.custom_width,
                    height: cur_frm.doc.custom_height,
                    color: cur_frm.doc.custom_color,
                    barcode: cur_frm.doc.custom_batch_no_barcode,
                    doctype: cur_frm.doc.doctype,
                    docname: cur_frm.doc.name
                }]
            };
            open_url_post(url, args, true);
        })
    }
})
