// Copyright (c) 2026, GreyCube Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Template", {
	refresh(frm) {
        frm.set_query("item",()=>{
            return{
                filters:{
                    include_item_in_manufacturing : 1
                }
            }
        }),
        frm.set_query("item","raw_material", function (doc,cdt,cdn){
            return {
                filters: {
                    include_item_in_manufacturing : 0
                }
			}
        })
	},
});

