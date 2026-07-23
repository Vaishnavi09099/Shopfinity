import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { createShopfinityAgent, agentSystemPrompt } from "@/lib/ai/agent"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Please login to use the assistant" },
                { status: 401 }
            )
        }

        const { message } = await req.json()

        if (!message) {
            return NextResponse.json(
                { message: "Message is required" },
                { status: 400 }
            )
        }

        const agent = createShopfinityAgent(session.user.id)

        const result = await agent.invoke({
            messages: [
                new SystemMessage(agentSystemPrompt),
                new HumanMessage(message)
            ]
        })

        const lastMessage = result.messages[result.messages.length - 1]

        return NextResponse.json(
            { reply: lastMessage.content },
            { status: 200 }
        )

    } catch (error) {
        console.error("AI assistant error:", error)
        return NextResponse.json(
            { message: "Something went wrong, please try again" },
            { status: 500 }
        )
    }
}