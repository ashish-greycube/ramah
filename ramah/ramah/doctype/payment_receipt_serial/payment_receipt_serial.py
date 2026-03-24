# Copyright (c) 2026, GreyCube Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class PaymentReceiptSerial(Document):
    def validate(self):
        range_from = int(self.range_from)
        range_to = int(self.range_to)
        
        for i in range(range_from, range_to + 1):
            exists = frappe.db.exists("Receipt Serial", {
                "serial_no": i,
                "sales_partner": self.sales_partner
            })  
            if exists:
                frappe.throw("For this sales partner receipt serial already exist.")
        
    @frappe.whitelist()
    def create_serial(self):
        range_from = int(self.range_from)
        range_to = int(self.range_to)

        for i in range(range_from, range_to + 1):
            exists = frappe.db.exists("Receipt Serial", {
                "serial_no": i,
                "sales_partner": self.sales_partner
            })
            
            if not exists:
                doc = frappe.new_doc('Receipt Serial')
                doc.serial_no = i
                doc.sales_partner = self.sales_partner
                doc.insert()
                self.append("receipt_serial",{
                    "serial_no":doc.name
                })
            
        frappe.msgprint("Receipt Serial are created")
