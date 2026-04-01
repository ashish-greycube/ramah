import frappe

@frappe.whitelist()
def get_item_from_batch_no(batch_no):
    batch_doc = frappe.get_doc("Batch", batch_no).as_dict()

    item_code = batch_doc["item"]

    item_doc = frappe.get_doc("Item", item_code).as_dict()

    item_uom = item_doc["stock_uom"]

    return{
        "item_code": item_code,
        "batch_no": batch_no,
        "item_uom": item_uom
    }
