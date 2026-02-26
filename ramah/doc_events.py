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
