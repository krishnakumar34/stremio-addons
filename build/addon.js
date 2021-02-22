"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var stremio_addon_sdk_1 = require("stremio-addon-sdk");
var manifest_1 = require("./manifest");
var api_1 = require("./api");
var converters_1 = require("./converters");
var api = new api_1["default"]();
function addonInit() {
    return __awaiter(this, void 0, void 0, function () {
        var redbox, builder;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getBox()];
                case 1:
                    redbox = _a.sent();
                    // populate 'extra.options' in manifest
                    manifest_1["default"].catalogs[0].extra
                        .find(function (extra) { return extra.name == 'genre'; })
                        .options = redbox.categories.map(function (cat) { return cat.name; });
                    builder = new stremio_addon_sdk_1.addonBuilder(manifest_1["default"]);
                    builder.defineCatalogHandler(function (_a) {
                        var extra = _a.extra, id = _a.id;
                        var metas = [];
                        if (extra.search && id == 'redboxtv-search') {
                            var channels = redbox.channels.filter(function (channel) { return channel.name.toLowerCase().indexOf(extra.search.toLowerCase()) > -1; });
                            metas = converters_1.toMetaPreviews(channels);
                        }
                        else {
                            // filter channels based on selected genre
                            var channels = redbox.channels.filter(function (channel) { return channel.category.name == extra.genre; });
                            var skip = 0;
                            var max = 50;
                            var channelsCount = channels.length;
                            if (extra.skip) {
                                skip = extra.skip || 0;
                                max = (channelsCount - skip >= max) ? skip + max : channelsCount - (channelsCount - skip);
                            }
                            else {
                                if (channelsCount < max)
                                    max = channelsCount;
                            }
                            metas = converters_1.toMetaPreviews(channels.slice(skip, max));
                        }
                        return Promise.resolve({ metas: metas, cacheMaxAge: 3600 * 24 * 7 });
                    });
                    builder.defineStreamHandler(function (_a) {
                        var id = _a.id;
                        return __awaiter(_this, void 0, void 0, function () {
                            var streams, selectedChannel;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        streams = [];
                                        selectedChannel = redbox.channels.find(function (chan) { return chan.id == Number.parseInt(id.split(':')[1]); });
                                        if (!selectedChannel) return [3 /*break*/, 2];
                                        return [4 /*yield*/, converters_1.toStreams(selectedChannel.streams)];
                                    case 1:
                                        streams = _b.sent();
                                        _b.label = 2;
                                    case 2: return [2 /*return*/, Promise.resolve({ streams: streams })];
                                }
                            });
                        });
                    });
                    builder.defineMetaHandler(function (_a) {
                        var id = _a.id;
                        var meta;
                        var selectedChannel = redbox.channels.find(function (channel) { return channel.id == Number.parseInt(id.split(':')[1]); });
                        if (selectedChannel) {
                            meta = converters_1.toMetaPreviews([].concat(selectedChannel))[0];
                            meta.background = manifest_1["default"].background;
                            meta.logo = meta.poster;
                            meta.description = selectedChannel.name;
                            meta.genres = [selectedChannel.category.name];
                        }
                        return Promise.resolve({ meta: meta });
                    });
                    return [2 /*return*/, builder.getInterface()];
            }
        });
    });
}
exports["default"] = addonInit;
