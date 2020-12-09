import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { MessageReaction, PartialUser, User } from 'discord.js'

import LoggerService from './logger.service'
import DiscordJSService from './discord.service'
import { Vote } from './interfaces/vote'

/*
 * @target Number of pos vote needed
 * @members User allowed to vote
 * @callback Function when enougth member vote pos
 */
type VoteEntry = {
	target: number
	members: string[]
	callback: () => void
}

type VoteTable = Record<string, undefined | VoteEntry>

@injectable()
export default class VoteService {
	private logger: Logger
	private voteTable: VoteTable = {}

	constructor(
		@inject(LoggerService) private readonly loggerService: LoggerService,
		@inject(DiscordJSService)
		private readonly discordJSService: DiscordJSService,
	) {
		this.logger = this.loggerService.get()
		this.discordJSService.client.on('messageReactionAdd', this.onAddReaction.bind(this))
	}

	public createVote(voteEvent: Vote) {
		this.logger.info({
			id: voteEvent.message.id,
			target: voteEvent.voteNeeded,
			callback: voteEvent.callback,
			members: voteEvent.allowedMembersToVote,
		})
		this.voteTable[voteEvent.message.id] = {
			target: voteEvent.voteNeeded,
			callback: voteEvent.callback,
			members: voteEvent.allowedMembersToVote,
		}
	}

	private onAddReaction(reaction: MessageReaction, _user: User | PartialUser) {
		if (reaction.emoji.name !== '👍') {
			return
		}
		const vote = this.voteTable[reaction.message.id]
		if (!vote) {
			return
		}
		let count = 0
		reaction.users.cache.forEach((user) => {
			if (vote.members.includes(user.id)) {
				count++
			}
		})
		if (count >= vote.target) {
			delete this.voteTable[reaction.message.id]
			vote.callback()
		}
	}
}
