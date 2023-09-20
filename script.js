
function placeCode(prefix, alley, line, level) {
	return prefix.toString() + alley.toString().padStart(2, '0') + line.toString().padStart(3, '0') + level.toString().padStart(2, '0');
}

function getAlley() {
	let alley = document.getElementById('alley');
	return parseInt(alley.value);
}

function getParity() {
	let side = document.getElementById('side');
	let val = side.value;
	if (val == 'L') return false;
	if (val == 'R') return true;
	throw ":/";
}

function getPlacePrefix() {
	let prefix = document.getElementById('placePrefix');
	return parseInt(prefix.value);
}

function getAlleyLength() {
	let len = document.getElementById('alleyLength');
	return parseInt(len.value);
}

function getAlleyType() {
	let selector = document.getElementById('typeSelector');
	return selector.value;
}

function createLabel(alley, place, level) {
	let lab = document.createElement('div');
	lab.classList.add('barcodeLabel');
	lab.textContent = alley.toString().padStart(2, '0') + "-" + place.toString().padStart(2, '0') + "-" + level.toString().padStart('0');
	return lab;
}

function createBarcodeBox(bc, alley, place, level) {
	let bcBox = document.createElement('div');
	bcBox.classList.add('barcodeBox');
	
	let lab = createLabel(alley, place, level);
	
	bcBox.appendChild(bc);
	bcBox.appendChild(lab);
	return bcBox;
}

function generateBarcode(code) {
	let newBarcode = document.createElement('canvas');
	newBarcode.classList.add("placeBarcode");
	let newBarcodeRet = bwipjs.toCanvas(newBarcode, {
		bcid:        'code128',       // Barcode type
		text:        code,    		// Text to encode
		scale:       3,               // 3x scaling factor
		rotate:		'L',
		height:      10,              // Bar height, in millimeters
		includetext: false,            // Show human-readable text
		textxalign:  'center',        // Always good to set this
	});
	return newBarcode;
}

function generateAlleyBarcodes(_ev) {
	alley = getAlley();
	last = getAlleyLength();
	even = getParity();
	prefix = getPlacePrefix();

	let alleyType = getAlleyType();
	let possibleLevels = {
		"alley": [ 01 ],
		"rack":  [ 01, 10, 20, 30, 40, 50 ],
		"rack02":[ 01, 02, 10, 20, 30, 40, 50]
	}

	let levelSet = possibleLevels[alleyType];

	let container = document.getElementById('barcodes');
	container.textContent = '';
	for (let i = even ? 2 : 1; i <= last; i += 2) {
		for (let j = 0; j < levelSet.length; j++) {
			lev = levelSet[j];
			let code = placeCode(prefix, alley, i, lev);
			console.log('"' + code + '"');
			container.appendChild(createTopologyBox(code, alley, i, lev));
			document.getElementById(code).appendChild(generateBarcode(code));
		}
	}
	
	document.getElementById('header').style.display = 'none';
	
}

function createFromTemplate(barcodeId, alley, place, level) {
	let template = "<div class = \"topoBox\">\
		<table>\
			<tr>\
				<td class = \"topoBoxText\"> line </td>\
				<td class = \"topoBoxText\"> LogistERA </td>\
			</tr>\
			<tr>\
				<td class = \"topoBoxValue\"> {ALLEY} </td>\
				<td rowspan = \"5\" id = \"{BARCODEID}\"> </td>\
			</tr>\
			<tr>\
				<td class = \"topoBoxText\"> place </td>\
			</tr>\
			<tr>\
				<td class = \"topoBoxValue\"> {PLACE} </td>\
			</tr>\
			<tr>\
				<td class = \"topoBoxText\"> level </td>\
			</tr>\
			<tr>\
				<td class = \"topoBoxValue\"> {LEVEL} </td>\
			</tr>\
			<tr> \
				<td colspan = \"2\" class = \"topoBoxSmallText\"> CloudWMS(R) www.cowms.ru </td>\
			</tr>\
			<tr>\
				<td colspan = \"2\" class = \"topoArrow\">\
					<svg version=\"1.1\"\
						baseProfile=\"full\"\
						width=\"180px\" height=\"40px\"\
						xmlns=\"http://www.w3.org/2000/svg\">\
						<path d = \"M 0 10 L 165 10 L 165 0 L 180 20 L 165 40 L 165 30 L 0 30\" fill = \"black\" stroke=\"black\"/>	\
					</svg>\
				</td>\
			</tr>\
		</table>\
	</div>";
	
	template = template.replace('{PLACE}', place.toString().padStart(3, '0'));
	template = template.replace('{ALLEY}', alley.toString().padStart(2, '0'));
	template = template.replace('{BARCODEID}', barcodeId);
	template = template.replace('{LEVEL}', level.toString().padStart(2, '0'));
	return template;
}

function createTopologyBox(bc, alley, place, level) {
	let template = document.createElement('template');
	template.innerHTML = createFromTemplate(bc, alley, place, level);
	let barcodeElem = document.getElementById(bc);
	return template.content.firstChild;
}

function setupHooks(_ev) {
	let but = document.getElementById('generate');
	but.addEventListener("click", generateAlleyBarcodes);
	//generateAlleyBarcodes();
}

window.addEventListener('load', setupHooks);

