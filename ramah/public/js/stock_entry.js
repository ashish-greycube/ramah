frappe.ui.form.on("Stock Entry", {
    custom_batch_barcode_scan(frm) {
        let barcode_data = frm.doc.custom_batch_barcode_scan

        if (barcode_data) {
            add_item_from_batch_no(frm, barcode_data)
            frm.doc.custom_batch_barcode_scan = ""
            frm.refresh_field(custom_batch_barcode_scan)
        }
    }
})


function add_item_from_batch_no(frm, data) {
    frappe.call({
        method: "ramah.api.get_item_from_batch_no",
        args: {
            batch_no: data
        },
        callback: function (r) {
            if (r.message) {
                let item_code = r.message["item_code"]
                let batch_no = r.message["batch_no"]
                let item_uom = r.message["item_uom"]

                // For adding child table
                let row = frm.add_child('items')
                row.use_serial_batch_fields = 1
                row.item_code = item_code
                row.batch_no = batch_no
                row.uom = item_uom
                row.qty = 1
                frm.refresh_field('items')

                frappe.show_alert({ message: ('Item Added'), indicator: 'green' })
            }
        }
    });
}
