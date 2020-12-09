import { Message } from "discord.js"

export type VoteEvent = {
    allowedMembersToVote: string[]
    nextEventName: string
    message: Message
    voteNeeded: number
}