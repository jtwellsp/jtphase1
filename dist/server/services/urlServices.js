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
Object.defineProperty(exports, "__esModule", { value: true });
const evaluateModule_1 = require("../../models/evaluators/evaluateModule");
class URLServices {
    static beginScoringModule(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Trying to start scoring the module in URL Services.");
            const result = yield (0, evaluateModule_1.evaluateModule)(url);
            console.log(result);
            return result;
        });
    }
}
exports.default = URLServices;
