frappe.ui.form.on(`${cur_frm.doc.doctype} Item`, {
    item_code(frm, cdt, cdn) {
        let item_code = frappe.model.get_value(cdt, cdn, "item_code")

        frappe.db.get_value("Item", item_code, "item_group").then((r) => {
            let item_group = r.message.item_group
            set_mandatory(frm, item_code, item_group, "custom_is_angle_required", "custom_angle_type")
            set_mandatory(frm, item_code, item_group, "custom_is_hole_required", "custom_hole")
            set_mandatory(frm, item_code, item_group, "custom_is_production_type_required", "custom_production_type")
        })
    },
    rate(frm, cdt, cdn) {
        // validating rate
        let less_sale_rate = frappe.model.get_value(cdt, cdn, "custom_less_rate_for_sale")
        let rate = frappe.model.get_value(cdt, cdn, "rate")

        if (rate < less_sale_rate) {
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

    if (height) {
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
        })
    }
}

const set_qty = (cdt, cdn) => {
    let height = frappe.model.get_value(cdt, cdn, "custom_height")
    let width = frappe.model.get_value(cdt, cdn, "custom_width")
    let number = frappe.model.get_value(cdt, cdn, "custom_number")

    let qty = height * width * number
    frappe.model.set_value(cdt, cdn, "qty", qty)
}

const set_mandatory = (frm, item_code, item_group, group_field_name, item_field_name) => {

    frappe.db.get_value("Item Group", item_group, group_field_name).then((r) => {
        // let field_required = r.message.group_field_name
        let field_required = r.message[group_field_name]
        if (field_required == 1) {
            let row_index = frm.fields_dict.items.grid.open_grid_row.row.doc.idx
            // let field_index = frm.fields_dict.items.grid.open_grid_row.fields_dict.item_field_name.df.idx
            let field_index = frm.fields_dict.items.grid.open_grid_row.fields_dict[item_field_name].df.idx

            frm.fields_dict.items.grid.grid_rows[row_index - 1].docfields[field_index].reqd = 1
            frm.fields_dict.items.grid.refresh()
        } else {
            let row_index = frm.fields_dict.items.grid.open_grid_row.row.doc.idx
            // let field_index = frm.fields_dict.items.grid.open_grid_row.fields_dict.item_field_name.df.idx
            let field_index = frm.fields_dict.items.grid.open_grid_row.fields_dict[item_field_name].df.idx

            frm.fields_dict.items.grid.grid_rows[row_index - 1].docfields[field_index].reqd = 0
            frm.fields_dict.items.grid.refresh()
        }
    })
}