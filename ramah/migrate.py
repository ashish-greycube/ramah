import frappe
def after_migrate():
    custom_fields = {
        "Batch" : [
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Barcode",
                label="Batch No Barcode",
                fieldname="custom_batch_no_barcode",
                insert_after="batch_id"
            ),
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Data",
                label="Width",
                fieldname="custom_width",
                insert_after="expiry_date"
            ),
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Data",
                label="Height",
                fieldname="custom_height",
                insert_after="custom_width"
            ),
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Data",
                label="Color",
                fieldname="custom_color",
                insert_after="custom_height"
            ),
        ],
        "Stock Entry" : [
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Data",
                label="Scan Batch Barcode",
                fieldname="custom_batch_barcode_scan",
                options="Barcode",
                insert_after="scan_barcode"
            ),
        ],
        "Stock Reconciliation Item" : [
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Data",
                label="Width",
                fieldname="custom_width",
                insert_after="batch_no"
            ),
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Data",
                label="Height",
                fieldname="custom_height",
                insert_after="custom_width"
            ),
            dict(
                is_custom_field=1,
                is_system_generated=0,
                fieldtype="Data",
                label="Color",
                fieldname="custom_color",
                insert_after="custom_height"
            ),
        ]
    }

    print("Adding Custom Fields In Batch, Stock Entry, Stock Reconciliation Item .....")
    for dt, fields in custom_fields.items():
        print("********************\n %s: " % dt, [d.get("fieldname") for d in fields])
    frappe.custom.doctype.custom_field.custom_field.create_custom_fields(custom_fields)