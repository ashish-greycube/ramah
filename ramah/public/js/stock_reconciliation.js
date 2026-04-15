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
    },
    custom_button(frm) {
        if (!frm.doc.set_warehouse) {
            frappe.throw("Please select warehouse before appending items")
        }

        if (frm.doc.custom_item) {
            frappe.call({
                method: "ramah.api.append_item_details_sr",
                args: {
                    "item": frm.doc.custom_item,
                    "line": frm.doc.custom_no_of_line,
                    "qty": frm.doc.custom_qty,
                    "warehouse": frm.doc.set_warehouse,
                    "name": frm.doc.name
                },
                callback: async (r) => {
                    if (r.message) {
                        if (frm.doc.items && frm.doc.items.length == 1 && !frm.doc.items[0].item_code) {
                            frm.set_value("items", []);
                            frm.refresh_field("items");
                        }
                        for (let row_data of r.message) {
                            let child = frm.add_child("items");
                            await frappe.model.set_value(child.doctype, child.name, "item_code", row_data.item_code);
                            await frappe.model.set_value(child.doctype, child.name, "warehouse", row_data.warehouse);
                            await frappe.model.set_value(child.doctype, child.name, "qty", row_data.qty);
                            await frappe.model.set_value(child.doctype, child.name, "use_serial_batch_fields", 1);
                            await frappe.model.set_value(child.doctype, child.name, "valuation_rate", row_data.valuation_rate);
                            await frappe.model.set_value(child.doctype, child.name, "custom_color", row_data.color);
                        }
                        frm.refresh_field("items");
                    }
                }
            })
        }
    }
})


frappe.ui.form.on("Stock Reconciliation Item", {
    item_code(frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frappe.call({
            method: "ramah.api.get_valuation_rate_from_item",
            args: {
                "item": row["item_code"]
            },
        }).then((r) => {
            frappe.model.set_value(cdt, cdn, 'qty', 1);
            frappe.model.set_value(cdt, cdn, 'valuation_rate', r.message);
            frm.refresh_field("items");
        })
    }
})