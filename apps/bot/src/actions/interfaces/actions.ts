import { Message, TextChannel } from 'discord.js'

export interface IAction<T = any> {
	format(msg: Message): T
	execute: (event: T) => void
	help: (channel: TextChannel) => void
	doc: () => string[]
}
