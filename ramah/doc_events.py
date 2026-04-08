import frappe

@frappe.whitelist()
def get_settings_data(height, hole_type, qty):
    doc = frappe.get_doc("Ramah Settings")
    table = doc.get("slide_settings")

    return_hole_qty = 0

    if hole_type == "One Hole":
        for row in table:
            if row.get("to_height") >= height:
                return_hole_qty = row.get("one_hole_qty")
                break
            else:
                return_hole_qty = row.get("one_hole_qty")
    if hole_type == "Two Hole":
        for row in table:
            if row.get("to_height") >= height:
                return_hole_qty = row.get("two_hole_qty")
                break
            else:
                return_hole_qty = row.get("two_hole_qty")

    return {
        "hole_qty" : return_hole_qty,
        "qty" : qty,
    }
    
@frappe.whitelist()
def validate_child_items(doc, method):    
    items = doc.items

    for row in items:
        if row.rate < row.custom_less_rate_for_sale:
            frappe.throw(f"<p>You have entered wrong value of <b>Rate</b> for item in row <b>{row.idx}</b>.</p><p>It should be more than <b>{row.custom_less_rate_for_sale}</b></p>")

from erpnext.stock.doctype.batch.batch import make_batch

# Function for making Batch from item in Stock Reconsillation
@frappe.whitelist()
def before_insert_stock_reconcillation(doc, method):
    items_list = doc.items

    has_batch_no = ""
    create_new_batch = ""
    batch_number_series = ""

    for item in items_list:
        # checking if item has batch no. and auto batch naming on
        has_batch_no = frappe.get_value("Item", item.item_code, "has_batch_no")
        create_new_batch = frappe.get_value("Item", item.item_code, "create_new_batch")
        batch_number_series = frappe.get_value("Item", item.item_code, "batch_number_series")

        if batch_number_series and create_new_batch and has_batch_no:
            # using make_batch function for making batch from items
            batch = make_batch(frappe._dict({
                "item": item.item_code,
                "manufacturing_date": doc.posting_date,
                "stock_uom": item.stock_uom,
                "custom_width": item.custom_width,
                "custom_height": item.custom_height,
                "custom_color": item.custom_color
            }))

            # for setting barcode of batch
            frappe.set_value("Batch", batch, "custom_batch_no_barcode", batch)

            # for setting batch no. in Items table in SR
            item.batch_no = batch
