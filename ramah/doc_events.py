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

    print(return_hole_qty, qty, "="*100)

    return {
        "hole_qty" : return_hole_qty,
        "qty" : qty,
    }
    

