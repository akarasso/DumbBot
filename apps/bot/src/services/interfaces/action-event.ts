import {
    Guild,
    GuildMember,
    MessageMentions,
    TextChannel,
    VoiceChannel,
} from 'discord.js'

export type ActionEvent = {
    isVoted: boolean
    actionName: string
    args: string[]
    guild: Guild
    member: GuildMember | null
    mentions?: MessageMentions
    textChannel?: TextChannel
    voiceChannel: VoiceChannel | null
}
