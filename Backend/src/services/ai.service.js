import {
  AIMessage,
  createAgent,
  HumanMessage,
  SystemMessage,
  tool,
} from "langchain";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet",
  schema: z.object({
    query: z.string().describe("The search query to loop on the internet"),
  }),
});

const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
});

export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(
        `you are a helpful assistant that provides accurate and concise answers to user queries. You have access to a tool called "searchInternet" that allows you to retrieve the latest information from the internet. When you receive a user query, you can use this tool to gather relevant information before formulating your response. Always ensure that your answers are based on the most up-to-date information available, and provide clear and concise responses to the user's questions.`,
      ),
      ...messages.map((msg) => {
        if (msg.role == "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content);
        }
      }),
    ],
  });
  return response.messages[response.messages.length - 1].text;
}

export async function generateTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`you are a helpful assistant that generates concise and relevant titles for the given content. The title should be no more than 5 words long and should capture the essence of the content provided by the user.
      
      user will provide you a first message which is the content for which you need to generate a title. Please ensure that the title is 2-4 words, clear, engaging, and accurately reflects the main idea of the content. Avoid using unnecessary words and focus on creating a title that is both informative and attention-grabbing.
      `),
    new HumanMessage(
      `Genrate a title for a chat conversation based on the following first message: "${message}"`,
    ),
  ]);
  return response.text;
}
