import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY
});

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
);

const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool],
});

/**
 * Generate an answer for a chat.
 * @param {Array<{role: 'user' | 'ai', content: string}>} messages - full chat history, oldest first
 */
export async function generateResponse(messages) {

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know.
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
            ...messages.map((msg) =>
                msg.role === "user"
                    ? new HumanMessage(msg.content)
                    : new AIMessage(msg.content)
            )
        ]
    });

    return response.messages[response.messages.length - 1].text;
}


export async function AiTitle(message) {

    const response = await geminiModel.invoke([
        new SystemMessage(`
            You generate concise and descriptive titles for chat conversations.

            Rules:
            - Generate only 2-4 words.
            - Keep the title clear and relevant.
            - Do not use quotation marks.
            - Do not explain anything.
            - Return only the title.
        `),

        new HumanMessage(`
            Generate a title for this conversation:

            "${message}"
        `)
    ]);

    return response.text.trim();
}
