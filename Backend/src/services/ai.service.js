import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";

const geminiModel = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(messages.map(msg=>{
    if(msg.role == "user"){
      return new HumanMessage(msg.content)
    }else if(msg.role == "ai"){
      return new AIMessage(msg.content) 
    }
  }));
  return response.text;
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
  return response.text
}
