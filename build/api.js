"use strict";
exports.__esModule = true;
exports.RedboxTvApi = void 0;
var needle = require("needle");
var redbox_1 = require("./models/redbox");
var stream_1 = require("./models/stream");
var RedboxTvApi = /** @class */ (function () {
    function RedboxTvApi() {
    }
    RedboxTvApi.createModified = function (modified) {
        // get current time since epoch in seconds
        var secs = Math.round(new Date().getTime() / 1000);
        var time = secs ^ modified;
        var timeChars = ("" + time).split('');
        return timeChars[0] + "0" + timeChars[1] + "1" + timeChars[2] + "2" + timeChars[3] + "3" + timeChars[4] + "4" + timeChars[5] + "5" + timeChars[6] + "6" + timeChars[7] + "7" + timeChars[8] + "8" + timeChars[9] + "9";
    };
    /**
     * Retreive stream token
     * @param url target url
     * @param auth bearer authentication credentials
     */
    RedboxTvApi.getToken = function (url, auth) {
        var modified = this.createModified(6154838);
        var headers = {
            'Authorization': 'Basic ' + auth,
            'User-Agent': 'Dalvik/1.6.0 (Linux; U; Android 4.4.2; SM-N935F Build/JLS36C)',
            'Modified': modified,
            'Accept-Encoding': 'gzip',
            'Connection': 'Keep-Alive'
        };
        return needle('get', url, { headers: headers })
            .then(function (res) { return res.body.replace('?wmsAuthSign=', ''); });
    };
    /**
     * Load RedBox data
     * This method fetches all channels & categories
     */
    RedboxTvApi.prototype.load = function () {
        var headers = {
            'Referer': 'http://welcome.com/',
            'Authorization': 'Basic aGVsbG9NRjpGdWNrb2Zm',
            'User-Agent': 'Dalvik/1.6.0 (Linux; U; Android 4.4.2; SM-N935F Build/JLS36C)',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept-Encoding': 'gzip'
        };
        var data = { check: 1, user_id: 3010064, version: 32 };
        return needle('post', 'http://163.172.111.138:8030/rbtv/i/redbox.tv/', data, { headers: headers, json: false })
            .then(function (response) { return JSON.parse(response.body); });
    };
    return RedboxTvApi;
}());
exports.RedboxTvApi = RedboxTvApi;
var RedboxTvApiWrapper = /** @class */ (function () {
    function RedboxTvApiWrapper() {
        this.api = new RedboxTvApi();
    }
    RedboxTvApiWrapper.prototype.decode = function (value, sliceEnd) {
        value = sliceEnd ? value.slice(0, -1) : value.slice(1);
        return Buffer.from(value, 'base64').toString();
    };
    /**
     * Convert json response data to `Category`
     * @param json
     */
    RedboxTvApiWrapper.prototype.readCategory = function (json) {
        return {
            id: json['cat_id'],
            name: json['cat_name']
        };
    };
    /**
     * Convert json response data to Channel
     * @param json
     */
    RedboxTvApiWrapper.prototype.readChannel = function (json) {
        var _this = this;
        return {
            id: this.decode(json['rY19pZA=='], true),
            name: this.decode(json['ZY19uYW1l'], true),
            iconUrl: this.decode(json['abG9nb191cmw='], false),
            category: this.readCategory(json),
            streams: json['Qc3RyZWFtX2xpc3Q='].map(function (stream) { return new stream_1["default"](Number.parseInt(_this.decode(stream['cc3RyZWFtX2lk'], true)), _this.decode(stream['Bc3RyZWFtX3VybA=='], false), Number.parseInt(_this.decode(stream['AdG9rZW4='], true))); })
        };
    };
    /**
     * Returns a box of channels & categories
     */
    RedboxTvApiWrapper.prototype.getBox = function () {
        var _this = this;
        var channels = 'eY2hhbm5lbHNfbGlzdA==';
        return this.api.load()
            .then(function (json) { return new redbox_1["default"](json['categories_list'].map(function (cat) { return _this.readCategory(cat); }), json[channels].map(function (chan) { return _this.readChannel(chan); })); });
    };
    return RedboxTvApiWrapper;
}());
exports["default"] = RedboxTvApiWrapper;
