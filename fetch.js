/*! INFINITUM Validation v1.0.0.1 (http://www.infinitum.lk/developer) | Copyright (c) 2018 INFINITUM | Licensed under the MIT license */
if (typeof Infinitum !== 'function')

function Infinitum() {}

Infinitum.prototype.Fetch = function (url, type, data, {
        success: successCallBack,
        error: errorCallBack
}) {
        $.ajax({
                url: url,
                type: type,
                data: data,
                success: successCallBack,
                error: errorCallBack
        });
}

var infinitum = new Infinitum();