import { google } from "@ai-sdk/google";
import {
  APICallError,
  convertToModelMessages,
  streamText,
  validateUIMessages,
} from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import { buildChatContext } from "@/lib/chatbot/context";
import { checkRateLimit, getClientIp } from "@/lib/chatbot/rate-limit";
import { buildSystemPrompt } from "@/lib/chatbot/system-prompt";

export const maxDuration = 30;

const MAX_MESSAGE_CHARS = 1000;
const HISTORY_LIMIT = 10;

const bodySchema = z.object({
  messages: z.array(z.unknown()).min(1).max(20),
  locale: z.enum(["vi", "en"]).default("vi"),
});

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[POST /api/chat] GOOGLE_GENERATIVE_AI_API_KEY is not set");
      return NextResponse.json({ error: "not_configured" }, { status: 500 });
    }

    if (!checkRateLimit(getClientIp(req))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    let messages;
    try {
      messages = await validateUIMessages({ messages: parsed.data.messages });
    } catch {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }

    const last = messages[messages.length - 1];
    if (!last || last.role !== "user") {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }

    const lastText = last.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");
    if (lastText.trim().length === 0 || lastText.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json({ error: "message_too_long" }, { status: 400 });
    }

    const system = buildSystemPrompt(
      await buildChatContext(),
      parsed.data.locale,
    );

    const result = streamText({
      model: google(process.env.CHATBOT_MODEL ?? "gemini-3.1-flash-lite"),
      system,
      messages: await convertToModelMessages(messages.slice(-HISTORY_LIMIT)),
      temperature: 0.4,
      maxOutputTokens: 1024,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("[POST /api/chat]", error);
        if (APICallError.isInstance(error) && error.statusCode === 429) {
          return "rate_limited";
        }
        return "upstream_error";
      },
    });
  } catch (error) {
    console.error("[POST /api/chat]", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
