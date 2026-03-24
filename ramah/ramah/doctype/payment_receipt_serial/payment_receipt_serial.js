// Copyright (c) 2026, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Payment Receipt Serial", {
	create_serial(frm){
        if(!frm.is_new()){
            frm.call({
                doc: frm.doc,
                method:"create_serial"
            })
        }else{
            frappe.throw("Plese save the document first then proceed.")
        }
       
    }
});
