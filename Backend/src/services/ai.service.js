import { ChatGoogle } from "@langchain/google";

const model = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi() {
  model.invoke("what is ai in 1 word").then((response) => {
    console.log(response.text);
  });
}
