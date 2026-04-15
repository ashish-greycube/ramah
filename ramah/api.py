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

# Function called by URL for getting print pdf
@frappe.whitelist()
def get_pdf_file(docname, args_data):
	import json
	
	# Parse args_data if it's a string
	if isinstance(args_data, str):
		args_data = json.loads(args_data.replace("'", '"'))
	
	# Generate barcodes for all items using get_barcode func.
	for item in args_data:
		if item.get('barcode'):
			# Generate barcode and set in in args_data as bar_code
			item['bar_code'] = get_barcode("code128", item['barcode'], None, None, None, True)
	
	# Render template with barcode and all data
	html = frappe.render_template(
		"ramah/ramah/print_format/batch_no_barcode/batch_no_barcode.html",
		{
			"args": {
				"args_data": json.dumps(args_data)
			},
			"items_with_barcodes": args_data  # Pass the data with barcodes, we can access this for printing all data
		}
	)
	
	# Page dimensions
	options = {
		"page-width": "6cm",
		"page-height": "4cm",
		"margin-left": "0mm",
		"margin-right": "0mm"
	}
	
	pdf = get_pdf(html, options)
	
	frappe.local.response.filename = "{name}.pdf".format(
		name=docname.replace(" ", "-").replace("/", "-")
	)
	frappe.local.response.filecontent = pdf
	frappe.local.response.type = "pdf"

# Function for getting barcode from any alphanumeric string	=>	got from Print Designer
@frappe.whitelist()
def get_barcode(
	barcode_format, barcode_value, options=None, width=None, height=None, png_base64=False
):
	if not options:
		options = {}

	options = frappe.parse_json(options)

	if isinstance(barcode_value, str) and barcode_value.startswith("<svg"):
		import re
		barcode_value = re.search(r'data-barcode-value="(.*?)">', barcode_value).group(1)

	if barcode_value == "":
		fallback_html_string = """
			<div class="fallback-barcode">
				<div class="content">
					<span>No Value was Provided to Barcode</span>
				</div>
			</div>
		"""
		return {"type": "svg", "value": fallback_html_string}

	if barcode_format == "qrcode":
		return get_qrcode(barcode_value, options, png_base64)

	from io import BytesIO
	import barcode
	from barcode.writer import ImageWriter, SVGWriter
	import base64

	class PDSVGWriter(SVGWriter):
		def __init__(self):
			SVGWriter.__init__(self)

		def calculate_viewbox(self, code):
			vw, vh = self.calculate_size(len(code[0]), len(code))
			return vw, vh

		def _init(self, code):
			SVGWriter._init(self, code)
			vw, vh = self.calculate_viewbox(code)
			if not width:
				self._root.removeAttribute("width")
			else:
				self._root.setAttribute("width", f"{width * 3.7795275591}")
			if not height:
				self._root.removeAttribute("height")
			else:
				self._root.setAttribute("height", height)

			self._root.setAttribute("viewBox", f"0 0 {vw * 3.7795275591} {vh * 3.7795275591}")

	if barcode_format not in barcode.PROVIDED_BARCODES:
		return (
			f"Barcode format {barcode_format} not supported. Valid formats are: {barcode.PROVIDED_BARCODES}"
		)
	
	writer = ImageWriter() if png_base64 else PDSVGWriter()
	barcode_class = barcode.get_barcode_class(barcode_format)

	try:
		code = barcode_class(barcode_value, writer=writer)
	except Exception as e:
		frappe.msgprint(
			f"Invalid barcode value <b>{barcode_value}</b> for format <b>{barcode_format}</b>: {str(e)}",
			raise_exception=True,
			alert=True,
			indicator="red",
		)

	stream = BytesIO()
	code.write(stream, options)
	
	if png_base64:
		# For PNG: get binary data and encode to base64
		stream.seek(0)
		barcode_value = base64.b64encode(stream.read()).decode('utf-8')
	else:
		# For SVG: decode as UTF-8 string
		barcode_value = stream.getvalue().decode("utf-8")
	
	stream.close()

	return {"type": "png_base64" if png_base64 else "svg", "value": barcode_value}

@frappe.whitelist()
def get_qrcode(barcode_value, options=None, png_base64=False):
	from io import BytesIO

	import pyqrcode

	if not options:
		options = {}

	options = frappe.parse_json(options)
	options = {
		"scale": options.get("scale", 5),
		"module_color": options.get("module_color", "#000000"),
		"background": options.get("background", "#ffffff"),
		"quiet_zone": options.get("quiet_zone", 1),
	}
	qr = pyqrcode.create(barcode_value)
	stream = BytesIO()
	if png_base64:
		qrcode_svg = qr.png_as_base64_str(**options)
	else:
		options.update(
			{"svgclass": "print-qrcode", "lineclass": "print-qrcode-path", "omithw": True, "xmldecl": False}
		)
		qr.svg(stream, **options)
		qrcode_svg = stream.getvalue().decode("utf-8")
		stream.close()

	return {"type": "png_base64" if png_base64 else "svg", "value": qrcode_svg}


@frappe.whitelist()
def append_item_details_sr(item, line, qty, warehouse, name):
	items_to_add = []
	for i in range(int(line)):
		items_to_add.append({
			"item_code": item,
			"qty": qty,
			"warehouse": warehouse,
			"color" : frappe.db.get_value("Item", item, "test") or "",
			"valuation_rate": frappe.db.get_value("Item", item, "valuation_rate") or 0,
		})
	return items_to_add



@frappe.whitelist()
def get_valuation_rate_from_item(item):
	valuation_rate = frappe.get_value("Item", item, "valuation_rate")

	return valuation_rate
