/*! INFINITUM Core v1.0.0.2 (http://www.infinitum.lk/developer) | Copyright (c) 2018 INFINITUM | Licensed under the MIT license */
function Infinitum() {
	this.infinitumResult = '#infinitum-result';

	/* Network Connectivity - Start */
	this.baseURL = "";
	this.fetchSettings = {
		timeout: 2000,
		responseType: 'json',
		requestType: "application/x-www-form-urlencoded; charset=UTF-8",
		statusMethods: {
			/*  5xx Server Error - Start */
			500: function (response) { //Internal Server Error
			},
			501: function (response) { //Not Implemented
			},
			502: function (response) { //Bad Gateway
			},
			503: function (response) { //Service Unavailable
			},
			504: function (response) { //Gateway Timeout
			},
			505: function (response) { //HTTP Version Not Supported
			},
			/*  5xx Server Error - End */
			/*  4xx Client Error - Start */
			400: function (response) { //Bad Request
			},
			401: function (response) { //Authorization Required

			},
			402: function (response) { //Payment Required

			},
			403: function (response) { //Forbidden

			},
			404: function (response) { //Not Found
			},
			405: function (response) { //Method Not Allowed

			},
			406: function (response) { //Not Acceptable

			},
			407: function (response) { //Proxy Authentication Required

			},
			408: function (response) { //Request Timed Out

			},
			409: function (response) { //Conflicting Request

			},
			410: function (response) { //Gone

			},
			411: function (response) { //Content Length Required

			},
			412: function (response) { //Precondition Failed

			},
			413: function (response) { //Request Entity Too Long

			},
			414: function (response) { //Request URI Too Long

			},
			415: function (response) { //Unsupported Media Type

			},
			/*  4xx Client Error - End */
			/*  2xx Success - Start */
			200: function (response) { //OK
			},
			201: function (response) { //Created

			},
			202: function (response) { //Accepted

			},
			203: function (response) { //Non-Authorative Information

			},
			204: function (response) { //No Content

			},
			205: function (response) { //Reset Content

			},
			206: function (response) { //Partial Content

			},
			/*  2xx Success - End */
			/* Default Methods - Start */
			beforeSend: function (data) {
				console.log("Before Request Sent"+ data);
			}
			/* Default Methods - end */
		}
	};

	this.fetch = function (url, type, data = undefined) {
		try {
			var _ajaxSettings = {
				type: type,
				url: url,
				timeout: this.fetchSettings['timeout'],
				dataType: this.fetchSettings['responseType'],
				contentType: this.fetchSettings['requestType'],
				statusCode: this.fetchSettings['statusMethods'],
				beforeSend: this.fetchSettings['statusMethods']['beforeSend']
			};

			if (data !== undefined) _ajaxSettings['data'] = data

			$.ajax(_ajaxSettings);
		} catch (error) {
			$(this.infinitumResult).css('display', 'block').html(error);
		}
	}
	/* Network Connectivity - End */

	/* Image Manipulations - Start */
	this.imageToBase64 = async function (file) {
		var data = undefined;
		var reader = new FileReader();

		try {
			reader.onloadend = await

			function () {
				data = reader.result;
			}
			await reader.readAsDataURL(file);
		} catch (error) {
			$(this.infinitumResult).css('display', 'block').html(error);
		}

		return data;
	}

	this.readDataURL = function (input, previewId = undefined, width = undefined, height = undefined) {
		var reader = new FileReader();

		reader.onload = function () {
			if (previewId != undefined) $(previewId).attr('src', reader.result);
			$(input).data('base64', reader.result);
		};

		reader.readAsDataURL(input.files[0]);
	}

	this.resizeBase64Image = function (input, width, height) {
		scaleImage($(input).data('base64'), width, height, function (canvas) {
			$(input).data('base64', canvas.toDataURL("image/png"));
		});
	}
	/* Image Manipulations - End */
}

function scaleImage(url, width, height, callback) {
	var img = new Image(),
		width = width,
		height = height,
		callback;

	img.onload = function () {
		var canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");

		canvas.width = width;
		canvas.height = height;

		ctx.drawImage(this, 0, 0, width, height);

		callback(canvas);
	};

	img.src = url;
}

var infinitum = new Infinitum();