frappe.ui.form.on("Stock Reconciliation", {
    refresh(frm) {
        frm.add_custom_button("PDF", function (frm) {

            // getting all selected rows
            let all_selected = cur_frm.get_selected()
            let selected_rows = all_selected["items"]
            let all_items = cur_frm.doc.items

            let current_qty = ""
            let current_batch = ""
            let current_item_code = ""
            let current_item_name = ""
            let current_width = ""
            let current_height = ""
            let current_color = ""
            let current_barcode = ""

            let args_data = []

            let url = `/api/method/ramah.api.get_pdf_file`;

            // created a async fumction, so that frappe.db can use await
            const create_args = async () => {
                for (let row in selected_rows) {
                    // Loop through all rows and get batch_no and qty for each row
                    for (let item in all_items) {
                        if (all_items[item]["name"] == selected_rows[row]) {
                            current_qty = all_items[item]["qty"]
                            current_batch = all_items[item]["batch_no"]
                            current_item_code = all_items[item]["item_code"]
                            current_item_name = all_items[item]["item_name"]
                            current_width = all_items[item]["custom_width"]
                            current_height = all_items[item]["custom_height"]
                            current_color = all_items[item]["custom_color"]
                        }
                    }

                    // get Batch Doc for getting barcode, uses await so stops execution
                    let batch_doc = await frappe.db.get_doc("Batch", current_batch)

                    current_barcode = batch_doc["custom_batch_no_barcode"]

                    // setting all details of a single row and pusing in args_data
                    let obj = {
                        batch_no: current_batch,
                        qty: current_qty,
                        item_name: current_item_name,
                        item_code: current_item_code,
                        width: current_width,
                        height: current_height,
                        color: current_color,
                        barcode: current_barcode,
                        doctype: cur_frm.doc.doctype,
                        docname: cur_frm.doc.name
                    }

                    args_data.push(obj)
                }

                if (args_data.length > 0) {
                    let args = {
                        doctype: cur_frm.doc.doctype,
                        docname: cur_frm.doc.name,
                        args_data: args_data
                    }
                    open_url_post(url, args, true);
                }
            }

            create_args()
        })
    }
})
