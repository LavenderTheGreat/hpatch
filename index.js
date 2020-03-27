// https://stackoverflow.com/questions/47164675/convert-float-to-32bit-hex-string-in-javascript
function _numberToFloat(number){
	const getHex = i => ('00' + i.toString(16)).slice(-2);

	var view = new DataView(new ArrayBuffer(4)),
		result;

	view.setFloat32(0, number);

	result = Array
		.apply(null, { length: 4 })
		.map((_, i) => getHex(view.getUint8(i)))
		.join('');

	return result;
}

function _numberToInt32(number){
	number = Math.floor(number)
	number = number.toString(16)
	if (number.length > 8){
		number = "FFFFFFFF"
	}
	if (number.length < 8){
		number = "0".repeat(8 - number.length).concat(number)
	}

	return number
}

// shorthand for finding variables in the attribute list
function _seek(array, varname){
	for (var i = 0; i < array.ATTRIBUTES.Attribute.length; i++) {
		if (array.ATTRIBUTES.Attribute[i].Variable == varname){
			return i
		}
	}
	return null
}

// shorthand for getting an XML value from an input value
function _valueToXML(value, type){
	switch(type){
		case "bool":
			//console.log(value)
			if (value){
				//console.log("TRUE")
				return "TRUE"
			} else {
				//console.log("FALSE")
				return "FALSE"
			}
		case "float":
			return _numberToFloat(value)
		case "int":
			return _numberToInt32(value)
	}
	
}

function _patchAttributes(file){
	var currentXML = parser.parse(file.target.result, {parseNodeValue: false})

	// Divide mod
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_fTimeIntoDistance")].Value = _valueToXML(document.getElementById("ga_ig_dividemod").value, "float")

	// Highway width
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_f3DHighwayRadiusAdjust")].Value = _valueToXML(document.getElementById("ga_ig_highwaywidth").value, "float")

	// Use checkpoint debug
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "s_bUseCheckpointDebug")].Value = _valueToXML(document.getElementById("ga_ig_cpdebug").checked, "bool")

	// Use running percent
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "s_bRenderRunningPercentage")].Value = _valueToXML(document.getElementById("ga_ig_rpercent").checked, "bool")

	// Use gem debug
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_bShowGemGeometry")].Value = _valueToXML(document.getElementById("ga_ig_gem_debug").checked, "bool")

	// Gem height
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_f3DGemHeight")].Value = _valueToXML(document.getElementById("ga_ig_gem_height").value, "float")

	// Gem radius
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_f3DGemWidth")].Value = _valueToXML(document.getElementById("ga_ig_gem_radius").value, "float")

	// Euhporia radius
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_f3DGemCollarScale")].Value = _valueToXML(document.getElementById("ga_ig_gem_euphoriaradius").value, "float")

	// Scratch radius
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_f3DScratchGemRadius")].Value = _valueToXML(document.getElementById("ga_ig_gem_scratchradius").value, "float")

	// Inner radius
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_f3DGemWidthStep")].Value = _valueToXML(document.getElementById("ga_ig_gem_innerradius").value, "float")

	// Flip deck (Buttons left)
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_abDeckFlip[0]")].Value = _valueToXML(document.getElementById("ga_ig_flipleft").checked, "bool")

	// Flip deck (Buttons right)
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_abDeckFlip[1]")].Value = _valueToXML(document.getElementById("ga_ig_flipright").checked, "bool")

	// Freestyle samples
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_bPlayFreestyleSample")].Value = _valueToXML(document.getElementById("ga_au_freestyle").checked, "bool")

	// Menu swap icon
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_bUseWiggleIconForVersus")].Value = _valueToXML(document.getElementById("ga_ui_swapicon").checked, "bool")

	// Menu dropshadows
	currentXML.ATTRIBUTES.Attribute[_seek(currentXML, "g_bShadowAllText")].Value = _valueToXML(document.getElementById("ga_ui_dropshadoweverywhere").checked, "bool")

	// Now save the file
	
	var parserJ2X = new parser.j2xParser({format: true, indentBy: "	"});

	//console.log( ('<?xml version="1.0" encoding="UTF-8"?>\n').concat(parserJ2X.parse(currentXML)) )

	var blob = new Blob([ ('<?xml version="1.0" encoding="UTF-8"?>\n').concat(parserJ2X.parse(currentXML)) ], {type: "text/xml"});
	saveAs(blob, "ATTRIBUTES_GLOBAL.XML");
}

function _fail(){
	console.log("FAIL")
}

function patchXML(){
	
	console.log(_numberToFloat(0.1))
	console.log(_numberToInt32(65))
	
	//console.log("BUTTON")
	var file = document.getElementById("input").files[0]
	var reader = new FileReader()
	reader.onload = _patchAttributes
	reader.readAsText(file)
}
