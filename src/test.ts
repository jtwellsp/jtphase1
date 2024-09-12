
import { Octokit } from "octokit";
import dotenv from "dotenv";

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
  } catch (error) {
    console.error("Error fetching authenticated user data:", error);
    if ((error as any).response) {
      console.error("Status:", (error as any).response.status);
      console.error("Headers:", (error as any).response.headers);
      console.error("Data:", (error as any).response.data);
    }
  }
};
getData();