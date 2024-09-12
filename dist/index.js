/**
 * @file index.ts
 * @description Entry point of the API
 * Here we are creating a simple express server.
 * The server listens for requests made and processes the URLs accordingly.
 */
import { Octokit } from "octokit";
import dotenv from "dotenv";
//import { evaluateModule } from "./models/evaluators/evaluateModule";
// Load environment variables from .env file
dotenv.config();
// Get the GitHub token from environment variables
const token = process.env.GITHUB_TOKEN;
if (!token) {
    throw new Error("GitHub token is not defined in the environment variables");
}
// Create an instance of Octokit with the token
const octokit = new Octokit({ auth: token });
// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const getData = async () => {
    try {
        const { data } = await octokit.rest.users.getAuthenticated();
        const { login } = data;
        console.log("Authenticated user login:", login);
    }
    catch (error) {
        console.error("Error fetching authenticated user data:", error);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Headers:", error.response.headers);
            console.error("Data:", error.response.data);
        }
    }
};
//console.log(evaluateModule("https://github.com"));
getData();
