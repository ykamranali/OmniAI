import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  try {
    const genAI = new GoogleGenerativeAI("AQ.Ab8RN6JRd-jkDZ8KjhuO9AFKmsAeVtSZmHw4q4yUdGNeS1xXVw");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Test");
    console.log("SUCCESS:", result.response.text());
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}

test();
