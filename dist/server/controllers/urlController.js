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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const urlServices_1 = __importDefault(require("../services/urlServices"));
class URLController {
    static processURL(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Processing URL in the URL Controller.");
            const { url } = req.body;
            // Validate the URL format
            try {
                const urlObject = new url_1.URL(url);
                const response = yield urlServices_1.default.beginScoringModule(url);
                res.send(response);
            }
            catch (error) {
                res.status(400).send("Invalid URL");
            }
        });
    }
}
exports.default = URLController;
