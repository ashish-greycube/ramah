frappe.ui.form.on("Quotation Item", {
    // item_code(frm, cdt, cdn) {
    //     // frm.set_df_property("custom_angle_type", "reqd", 1)
    //     frm.fields_dict.items.grid.open_grid_row.fields_dict.custom_angle_type.docfields.reqd = 1
    //     // let row_index1 = frm.fields_dict.items.grid.open_grid_row.fields_dict.custom_angle_type.df.reqd
    //     let row_index = frm.fields_dict.items.grid.grid_rows
    //     // frm.fields_dict.items.grid.grid_rows[row_number].docfields[field_idx].reqd=1
    //     frm.fields_dict.items.grid.refresh()
    //     console.log(row_index)
    //     // console.log(row_index1)
    // },
    rate(frm, cdt, cdn) {
        // validating rate
        let less_sale_rate = frappe.model.get_value(cdt, cdn, "custom_less_rate_for_sale")
        let rate = frappe.model.get_value(cdt, cdn, "rate")

        if (rate < less_sale_rate) {
            // frappe.model.set_value(cdt, cdn, "rate", 0)
            frappe.throw("Rate can't be less than minimum selling rate!")
        }
    },
    custom_height(frm, cdt, cdn) {
        //for setting qty
        set_qty(cdt, cdn)

        get_total_slides_number(cdt, cdn)
    },
    custom_width(frm, cdt, cdn) {
        //for setting qty
        set_qty(cdt, cdn)
    },
    custom_number(frm, cdt, cdn) {
        //for setting qty
        set_qty(cdt, cdn)
    },
    custom_per_piece_slide_number(frm, cdt, cdn) {
        get_total_slides_number(cdt, cdn)
    },
    custom_hole(frm, cdt, cdn) {
        get_total_slides_number(cdt, cdn)
    },
})

const get_total_slides_number = (cdt, cdn) => {
    let height = frappe.model.get_value(cdt, cdn, "custom_height")
    let hole_type = frappe.model.get_value(cdt, cdn, "custom_hole")
    let qty = frappe.model.get_value(cdt, cdn, "qty")

    let get_total_slide_number = frappe.call({
        method: "ramah.doc_events.get_settings_data",
        args: {
            "height": height,
            "hole_type": hole_type,
            "qty": qty
        },
        callback: (r) => {
            let response = r.message
            frappe.model.set_value(cdt, cdn, "custom_total_slide_number", (response.hole_qty * response.qty))
            frappe.model.set_value(cdt, cdn, "custom_per_piece_slide_number", (response.hole_qty))
        },
    });
}

const set_qty = (cdt, cdn) => {
    let height = frappe.model.get_value(cdt, cdn, "custom_height")
    let width = frappe.model.get_value(cdt, cdn, "custom_width")
    let number = frappe.model.get_value(cdt, cdn, "custom_number")

    let qty = height * width * number
    frappe.model.set_value(cdt, cdn, "qty", qty)
}