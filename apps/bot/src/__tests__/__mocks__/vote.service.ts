import { MessageReaction, PartialUser, User } from 'discord.js'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import DiscordJSService from '../../services/discord.service'
import { Vote } from '../../services/interfaces/vote'
import LoggerService from '../../services/logger.service'
import VoteService, { VoteTable } from '../../services/vote.service'

@injectable()
export class MockVoteService implements VoteService {
	public logger: Logger
	public voteTable: VoteTable = {}

	constructor(
		@inject(LoggerService) loggerService: LoggerService,
		@inject(DiscordJSService)
		public readonly discordJSService: DiscordJSService,
	) {
		this.logger = loggerService.get()
	}

	public createVote(_voteEvent: Vote) {
	}

	public onAddReaction(_reaction: MessageReaction, _user: User | PartialUser) {
	}
}
