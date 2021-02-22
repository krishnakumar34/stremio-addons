"use strict";
exports.__esModule = true;
var addon_1 = require("./addon");
var stremio_addon_sdk_1 = require("stremio-addon-sdk");
exports["default"] = addon_1["default"]().then(function (addonInterface) { return stremio_addon_sdk_1.getRouter(addonInterface); });
