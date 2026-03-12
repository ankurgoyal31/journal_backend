"use server"
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";
dotenv.config();
 const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY});

export const get_s = async(que)=>{
 let baseMessages = [
    {
      role: 'system',
      content: `You are an AI assistant that analyzes journal entries from a wellness application.

Your task is to read the user's journal text and determine:

1. emotion – the main emotional state expressed in the journal
2. keywords – important words or themes from the text
3. summary – a short summary of the emotional experience

Strict Rules:

1. Return ONLY valid JSON.
2. Do NOT include explanations, comments, or text outside JSON.
3. Follow the exact schema below.
4. Keep the summary concise (1 sentence).
JSON format:
{
"emotion": "",
"keywords": [],
"summary": ""
}

Journal entry:
`
    }, 
    {
      role: 'user', 
      content: que
    },
  
   ];
 
   const completion = await groq.chat.completions.create({ 
    model: "llama-3.3-70b-versatile",
    messages: baseMessages,              
  });
    let data = completion.choices[0].message.content;
    console.log("data",data)
    if(!data) {
        return "went wrong...."
    }
let json_format = JSON.parse(data);
return json_format;
 }
async function websearch({query}) {
  console.log(query,"........")
  const response = await tvly.search(query);
  let res = response.results.map((item)=>{return item.content}).join("\n\n")
  return res;
}