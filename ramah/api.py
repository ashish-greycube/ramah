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

from frappe.utils.pdf import get_pdf

@frappe.whitelist()
def get_pdf_file(docname):
    html = frappe.get_template("ramah/ramah/print_format/batch_no_barcode/batch_no_barcode.html").render()
    options={
        "page-width": "6cm",
        "page-height": "4cm",
        "margin-left":"0mm",
        "margin-right":"0mm"
    }
    pdf = get_pdf(html, options)

    frappe.local.response.filename = "{name}.pdf".format(
        name=docname.replace(" ", "-").replace("/", "-")
    )
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "pdf"