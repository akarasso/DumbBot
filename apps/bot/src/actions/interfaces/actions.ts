import { Message, TextChannel } from 'discord.js'
import { Right } from './rights';

export interface IAction<T = any> {
	name: string,
	rights: Right,
	voteRights: Right,
	format(msg: Message): T
	execute: (event: T) => void
	help: (channel: TextChannel) => void
	doc: () => string[]
}
