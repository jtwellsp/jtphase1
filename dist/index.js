"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const { sayHello } = require('./example.js');
const apiKey = process.env.GITHUB_TOKEN;
const app = (0, express_1.default)();
const PORT = 3000;
app.get('/', (req, res) => {
    res.send(sayHello(apiKey));
});
/**
 * Start the Express server
 * @param port - The port number to run the server on
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map