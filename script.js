
// Сформировать код места для заданных параметров
function placeCode (prefix, alley, line, level) {
	// Префикс - 2 символа аллеи - 3 символа места - 2 символа уровня
	return prefix.toString() + alley.toString().padStart (2, '0') + line.toString().padStart (3, '0') + level.toString().padStart (2, '0');
}

// Получить целочисленное значение из тега <input>
function getIntValue (id) {
	return parseInt (document.getElementById (id).value);
}

// Получить номер аллеи из формы ввода
function getAlley () {
	return getIntValue ('alley');
}

// Получить сторону из формы ввода
function getParity () {
	let side = document.getElementById ('side');
	return side.value == 'R';
}

// Получить префикс места из формы ввода
function getPlacePrefix () {
	return getIntValue ('placePrefix');
}

// Получить длину аллеи из формы ввода
function getAlleyLength () {
	return getIntValue ('alleyLength');
}

// Получить тип аллеи из формы ввода
function getAlleyType () {
	let selector = document.getElementById ('typeSelector');
	return selector.value;
}

// Сгенерировать элемент штрих-кода
function generateBarcode (code) {
	let newBarcode = document.createElement ('canvas');
	newBarcode.classList.add ("placeBarcode");

	let newBarcodeRet = bwipjs.toCanvas (
		newBarcode,
		{
			bcid:        'code128', 	// Barcode type
			text:        code,    		// Text to encode
			scale:       3,         	// 3x scaling factor
			rotate:		'L',
			height:      10,        	// Bar height, in millimeters
			includetext: false,     	// Show human-readable text
			textxalign:  'center',  	// Always good to set this
		}
	);

	return newBarcode;
}

// Сгенерировать топологию согласно данным формы ввода
function generateAlleyBarcodes (_ev) {
	let alley = getAlley();
	let last = getAlleyLength();
	let even = getParity();
	let prefix = getPlacePrefix();
	let alleyType = getAlleyType();
	let isRack = !(alleyType == "alley");

	const possibleLevels = {
		"alley": [ 01 ],
		"rack":  [ 01, 10, 20, 30, 40, 50 ],
		"rack02":[ 01, 02, 10, 20, 30, 40, 50 ]
	}
	let levelSet = possibleLevels[alleyType];

	let container = document.getElementById ('barcodes');

	for (let i = even ? 2 : 1; i <= last; i += 2) {
		for (lev of levelSet) {
			let code = placeCode (prefix, alley, i, lev);
			container.appendChild (createTopologyBox (code, alley, i, lev, isRack));
		}
	}
	
	document.getElementById ('box').style.display = 'none'; 
}

// Сгенерировать отдельную этикетку топологии с заданными параметрами
function createTopologyBox(barcodeId, alley, place, level, upDownPointer) {
	let templateElem = document.getElementById ("topoBoxTemplate");
	let template = templateElem.cloneNode (true);

	const horizontalPointers = { // SVG path
		right: 	"M 0 10 L 165 10 L 165 0 L 180 20 L 165 40 L 165 30 L 0 30",
		up:  	"M 15 35 L 55 35 L 35 0 M 65 35 L 105 35 L 85 0 M 115 35 L 155 35 L 135 0",
		down: 	"M 15 0 L 55 0 L 35 35 M 65 0 L 105 0 L 85 35 M 115 0 L 155 0 L 135 35",
		none: 	"M 0 0"
	};

	const verticalPointers = {
		down: 	"M 10 0 L 10 160 L 0 160 L 15 180 L 30 160 L 20 160 L 20 0",
		up: 	"M 10 180 L 10 20 L 0 20 L 15 0 L 30 20 L 20 20 L 20 180",
		none:	"M 0 0"
	}

	let horizontalPointer = horizontalPointers.right;
	let verticalPointer = verticalPointers.none;

	if (upDownPointer) {
		horizontalPointer = horizontalPointers.none;
		verticalPointer = level < 10 ? verticalPointers.down : verticalPointers.up;
	}

	template.querySelector ('.placeId').innerHTML = place.toString().padStart (3, '0');
	template.querySelector ('.alleyId').innerHTML = alley.toString().padStart (2, '0');
	template.querySelector ('.levelId').innerHTML = level.toString().padStart (2, '0');

	template.querySelector ('#barcodeid').appendChild (generateBarcode (barcodeId));
	
	template.querySelector ('.horizontalTopoArrow').setAttribute ('d', horizontalPointer);
	template.querySelector ('.verticalTopoArrow').setAttribute ('d', verticalPointer);

	template.classList.remove ('template');
	return template;
}

// Задать событие при нажатии кнопки
function setupHooks (_ev) {
	let but = document.getElementById ('generate');
	but.addEventListener ("click", generateAlleyBarcodes);
}

// Задаем событие нажатия кнопки при загрузке окна
window.addEventListener ('load', setupHooks);

