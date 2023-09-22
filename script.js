
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
		"rack02":[ 01, 02, 10, 20, 30, 40, 50 ]
	}

	let levelSet = possibleLevels[alleyType];

	let container = document.getElementById('barcodes');

	for (let i = even ? 2 : 1; i <= last; i += 2) {
		for (let j = 0; j < levelSet.length; j++) {
			lev = levelSet[j];
			let code = placeCode(prefix, alley, i, lev);
			console.log('"' + code + '"');
			container.appendChild(createTopologyBox(code, alley, i, lev, !(alleyType == "alley")));
			document.getElementById(code).appendChild(generateBarcode(code));
		}
	}
	
	document.getElementById('header').style.display = 'none';
	
}

function createFromTemplate(barcodeId, alley, place, level, upDownPointer) {
	let templateElem = document.getElementById ("topoBoxTemplate");
	let template = templateElem.cloneNode (true);

	// 
	// "M 15 35 L 55 35 L 35 0 M 65 35 L 105 35 L 85 0 M 115 35 L 155 35 L 135 0\" fill = \"black\" stroke=\"black"

	let horizontalPointer = "M 0 10 L 165 10 L 165 0 L 180 20 L 165 40 L 165 30 L 0 30";
	let verticalPointer = "";

	if (upDownPointer) {
		if (level < 10) {
			horizontalPointer = ""; //"M 15 0 L 55 0 L 35 35 M 65 0 L 105 0 L 85 35 M 115 0 L 155 0 L 135 35";
			verticalPointer = "M 10 0 L 10 160 L 0 160 L 15 180 L 30 160 L 20 160 L 20 0";
		} else {
			horizontalPointer = ""; //"M 15 35 L 55 35 L 35 0 M 65 35 L 105 35 L 85 0 M 115 35 L 155 35 L 135 0";
			verticalPointer = "M 10 180 L 10 20 L 0 20 L 15 0 L 30 20 L 20 20 L 20 180";
		}
	}

	template.querySelector ('.placeId').innerHTML = place.toString().padStart(3, '0');
	template.querySelector ('.alleyId').innerHTML = alley.toString().padStart(2, '0');
	template.querySelector ('#barcodeid').id = barcodeId;
	template.querySelector ('.levelId').innerHTML = level.toString().padStart(2, '0');
	template.querySelector ('.horizontalTopoArrow').setAttribute('d', horizontalPointer);
	template.querySelector ('.verticalTopoArrow').setAttribute('d', verticalPointer);

	template.classList.remove ('template');

	return template;
}

function createTopologyBox(bc, alley, place, level, upDownPointer) {
	return createFromTemplate(bc, alley, place, level, upDownPointer);
}

function setupHooks(_ev) {
	let but = document.getElementById('generate');
	but.addEventListener("click", generateAlleyBarcodes);
	//generateAlleyBarcodes();
}

window.addEventListener('load', setupHooks);

