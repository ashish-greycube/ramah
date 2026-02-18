import frappe

@frappe.whitelist()
def get_settings_data(height, hole_type, qty):
    doc = frappe.get_doc("Ramah Settings")
    table = doc.get("table_izdl")

    return_hole_qty = 0

    if hole_type == "One Hole":
        for i in table:
            if i.get("to_height") >= height:
                return_hole_qty = i.get("one_hole_qty")
                break
    if hole_type == "Two Hole":
        for i in table:
            if i.get("to_height") >= height:
                return_hole_qty = i.get("two_hole_qty")
                break

    return {
        "hole_qty" : return_hole_qty,
        "qty" : qty,
    }
    
@frappe.whitelist()
def validate_child_items(doc, method):
    print("="*100)
    
    items = doc.items

    for i in items:
        if i.rate < i.custom_less_rate_for_sale:
            print("="*100, i.idx, i.name, i.doctype)
            frappe.throw(f"<p>You have entered wrong value of <b>Rate</b> for item in row <b>{i.idx}</b>.</p><p>It should be more than <b>{i.custom_less_rate_for_sale}</b></p>")
