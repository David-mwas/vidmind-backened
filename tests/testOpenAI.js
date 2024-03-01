import { OpenAI } from "openai";
const openai = new OpenAI({apiKey: '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'});
const response = await openai.listEngines();