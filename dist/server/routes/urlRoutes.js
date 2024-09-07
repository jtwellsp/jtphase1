"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = __importDefault(require("../controllers/urlController"));
const router = (0, express_1.Router)();
// Define routes
router.post('/', urlController_1.default.processURL);
exports.default = router;
