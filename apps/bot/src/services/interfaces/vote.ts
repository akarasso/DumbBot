import { Message } from 'discord.js'

export type Vote = {
    message: Message
    voteNeeded: number
    allowedMembersToVote: string[]
    callback: () => void
}
