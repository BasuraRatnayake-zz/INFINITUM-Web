/*! INFINITUM Validation v1.0.0.6 (http://www.infinitum.lk/developer) | Copyright (c) 2019 INFINITUM | Licensed under the MIT license */
Infinitum.prototype.Validation = function (validationDiv, dataFields, regexFields, focusOnError = false) {
	var _rules = {
		'email': /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/,
		'12h-time': /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])\s*([AaPp][Mm])$/,
		'gmap-embed': /^(?:https:\/\/www\.google\.com\/maps\/embed\?pb=)[\W\w]+$/,
		'alpha-numeric': /^[#\.0-9a-zA-Z\s,-:\\&]+$/,
		'alpha-numeric-unicode': /^[#\.0-9\pL\s,-:\\&]+$/,
		'check': /^(true|false)$/,
		'numeric': /^[0-9]+$/,
		'link': /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&\'\(\)\*\+,;=.]+$/,
		'date': /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/,
		'time': /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])$/
	};
	this.rules = _rules;

	/* Core - Start */
	var data = new Object();
	var validRegex = new Object();
	var dataValues = new Object();
	var fieldData = new Object();

	/* Load Field Data - Start */
	var dataLength = dataFields.length;

	function _loadData(key, regexPattern) { //Load Data into the Arrays
		data[key] = $('#' + key);

		/* Field Data - Start */
		var _dataTemp = data[key];
		var _dataType = _dataTemp.attr('type');
		var _dataMultiple = _dataTemp.attr('data-limit');

		fieldData[key] = {
			'type': _dataType === undefined ? 'text' : _dataType,
			'limit': _dataMultiple === undefined ? 1 : _dataMultiple
		};
		/* Field Data - End */

		var _regex = regexPattern;

		if (typeof _regex === 'string') {
			if (_dataType === 'file') {
				_regex = _regex.toString().split('|');

				if (_regex.length < 2) {
					$(infinitum.infinitumResult).css('display', 'block').html("Image Regex Not Configured Correctly");
					return false;
				}

				_regex = {
					'types': _regex[0],
					'size': _regex[1]
				};

				_regex['regex'] = "(?:[a-zA-Z0-9s_.-])+\/(?:" + _regex['types'].toLowerCase().replace(/,/g, '|') + ")";
				_regex['regex'] = new RegExp(_regex['regex'], "g");
			} else {
				_regex = _rules[_regex];
			}
		}

		validRegex[key] = _regex;
	}

	for (var i = 0; i < dataLength; i++) {
		_loadData(dataFields[i], regexFields[i]);
	}

	function _init() {
		$("." + validationDiv + ",#" + validationDiv + "," + this.infinitumResult).css('display', 'none');
		for (var i = 0; i < dataLength; i++) {
			switch (fieldData[dataFields[i]]['type']) {
				case 'text':
					dataValues[dataFields[i]] = (data[dataFields[i]].val() || "").toString().split(',');
					break;
				case 'password':
					dataValues[dataFields[i]] = data[dataFields[i]].val().toString().split(',');
					break;
				case 'file':
					dataValues[dataFields[i]] = data[dataFields[i]][0].files;
					break;
				case 'checkbox':
					dataValues[dataFields[i]] = [data[dataFields[i]].is(":checked")];
					break;
				case 'date':
					dataValues[dataFields[i]] = (data[dataFields[i]].val() || "").toString().split(',');
					break;
				case 'radio':					
					dataValues[dataFields[i]] = $('input[id='+dataFields[i]+']:checked').val();
					break;
			}
		}
	}
	/* Load Field Data - End */

	this.addValidation = function (divId, regex) { //Add Key to Validation Arrays
		if (data.hasOwnProperty(divId)) {
			$(infinitum.infinitumResult).css('display', 'block').html("Key Already Exist");
			return false;
		}

		dataFields.push(divId);
		regexFields.push(regex);

		_loadData(divId, regex);
		dataLength++;
	}
	this.removeValidation = function (divId) { //Remove Key from Validation Arrays
		if (data.hasOwnProperty(divId)) {
			delete data[divId];
			delete validRegex[divId];
			delete dataValues[divId];
			delete fieldData[divId];

			var _index = dataFields.indexOf(divId);
			if (_index > -1) {
				dataFields.splice(_index, 1);
				regexFields.splice(_index, 1);
			}

			dataLength--;
			return true;
		}

		$(infinitum.infinitumResult).css('display', 'block').html("Error Occurred Trying to Delete Key " + divId);
		return false;
	}

	this.inputToJSON = async function () { //Convert Input Field Data into JSON string		
		var _formData = {};

		for (var key in dataValues) {
			if (fieldData[key]['type'] === 'file') {
				_formData[key] = [];
				for (var i = 0; i < Math.min(fieldData[key]['limit'], dataValues[key].length); i++) {
					var _file = dataValues[key][i];
					await getBase64Promise(_file).then(
						data => {
							_formData[key].push(data);
						}
					);

				}

				// var data = await infinitum.imageToBase64(dataValues[key][0]);

				// var data = getBase64(key);
				// _formData[key] = data;
				continue;
			}
			_formData[key] = fieldData[key]['limit'] == 1 ? dataValues[key][0] : dataValues[key];
		}

		return _formData;
	}
	
	this.inputToObject = function() {//Convert Input Field Data into JObject
		var _formData = {};
		
		for (var key in dataValues) {
			if (fieldData[key]['type'] === 'file') {
				_formData[key] = [];
				for (var i = 0; i < Math.min(fieldData[key]['limit'], dataValues[key].length); i++) {
					var _file = dataValues[key][i];
					getBase64Promise(_file).then(
						data => {
							_formData[key].push(data);
						}
					);

				}
				continue;
			}
			
			_formData[key] = fieldData[key]['limit'] == 1 ? dataValues[key][0] : dataValues[key];
		}
		
		return _formData;
	}

	this.inputToFormData = function () { //Convert Input Field Data into FormData 
		var formData = new FormData();

		for (var key in dataValues) {
			if (fieldData[key]['type'] === 'file') {
				var data = getBase64(key);
				formData.append(key, data);
				continue;
			}
			var _data = fieldData[key]['limit'] == 1 ? dataValues[key][0] : dataValues[key];
			formData.append(key, dataValues[key]);
		}

		return formData;
	}

	this.getValidationDiv = function (key) {
		return getParentDiv(key);
	}

	function getParentDiv(key) {
		var parent = $(data[key]).parent();
		var valDivParent = parent;
		var parentFound = false;

		while (!parentFound) {
			var children = valDivParent.children();
			var childrenLength = children.length;

			for (var i = 0; i < childrenLength; i++) {
				if (children[i].className.includes(validationDiv)) {
					parentFound = true;
					valDivParent = children[i];
					break;
				}
			}

			if (parentFound) break;

			valDivParent = valDivParent.parent();
		}

		return $(valDivParent);
	}


	// function isVisible(key) { // validate only visible fields
	// 	return $(data[key]).is(':visible');
	// }

	function getBase64(key) { // get pre added base64 image from the input
		return $(data[key]).data('base64');
	}

	function getBase64Promise(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	/* Core - End */

	function validateFields(k) {
		var fieldLength = fieldData[k]['limit'] > dataValues[k].length ? dataValues[k].length : fieldData[k]['limit'];

		for (var i = 0; i < fieldLength; i++) {
			// if (isVisible(k)) {
			if (!validRegex[k].test(dataValues[k][i])) {
				var parentDiv = getParentDiv(k);
				parentDiv.css('display', 'block');

				if (focusOnError) {
					var scrollPos = $(parentDiv).parent().offset().top;
					scrollPos -= 70;
					$(window).scrollTop(scrollPos);
				}

				return false;
			}
			// }
		}
	}
	this.validateFields = function () {
		_init();
		for (var k in data) {
			if (validateFields(k) == false) return false;
		}
		return true;
	}

	function validateFiles(k) {
		var parentDiv = null;

		if (dataValues[k].length === 0) {
			parentDiv = getParentDiv(k);
			parentDiv.css('display', 'block');
			return false;
		}

		for (var i = 0; i < Math.min(fieldData[k]['limit'], dataValues[k].length); i++) {
			var _file = dataValues[k][i];
			var _fileSize = _file.size / 1024 / 1024;
			var _status = {
				'size': true,
				'type': true
			}

			if (!new RegExp(validRegex[k]['regex']).test(_file.type.toString())) _status['type'] = false; //Validate Type
			if (_fileSize > validRegex[k]['size']) _status['size'] = false; //Validate Size

			if (!_status['size'] || !_status['type']) {
				parentDiv = getParentDiv(k);
				parentDiv.css('display', 'block');

				var msg = "Only " + validRegex[k]['types'] + " file types allowed";

				if (!_status['size']) msg = "File must be less than " + validRegex[k]['size'] + " MB";

				parentDiv.html(msg);
				return false;
			}
		}
	}
	this.validateFiles = function () {
		_init();
		for (var k in data) {
			if (validateFiles(k) == false) return false;
		}

		return true;
	}

	this.validateAll = function () {
		_init();
		var _status = true;
		for (var k in data) {
			if (fieldData[k]['type'] !== 'file') {
				if (validateFields(k) == false) return false;
			} else {
				if (validateFiles(k) == false) return false;
			}
		}
		return true;
	}

	this.clearAll = function () {
		for (var k in data) {
			// if (fieldData[k]['type'] !== 'file') {
			$('#' + k).val("");
			// } else {
			// if (validateFiles(k) == false) return false;
			// }
		}
	}
}
