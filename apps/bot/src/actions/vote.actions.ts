import 'reflect-metadata'
import { Message, MessageMentions, TextChannel } from 'discord.js'
import { inject, injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import VoteService from '../services/vote.service'
import { VoteEvent } from './interfaces/events'
import { Vote } from '../services/interfaces/vote'

@injectable()
export default class VoteAction implements IAction<VoteEvent> {
	constructor(
		@inject(ActionMessageService) private readonly actionService: ActionMessageService,
		@inject(VoteService) private readonly voteService: VoteService,
	) {
		this.actionService.registerActionMessage('vote', this)
	}

	public doc() {
		return ['!vote <action> <args...>', '!vote volume 2', '!vote mute 2', '!vote play ...']
	}

	public help(channel: TextChannel) {
		channel.send('!vote <action> <args..>')
	}

	public format(msg: Message): VoteEvent {
		const { member } = msg
		if (!member) {
			throw new Error('Failed to get member')
		}
		const channelID = member.voice.channelID
		if (!channelID) {
			throw new Error('Member not connected')
		}
		const ids = member.voice.channel?.members.map((member) => member.id) || []
		const voteNeeded = ids.length / 2

		msg.content = msg.content.split(' ').slice(1).join(' ')
		const nextEventName = msg.content.split(' ')[0]
		if (!this.actionService.actionsMessage[nextEventName]) {
			throw new Error('Undefined action')
		}
		const targetID = this.getTarget(msg.mentions)
		if (!targetID) {
			throw new Error('No target define')
		}
		return {
			nextEventName,
			voteNeeded,
			allowedMembersToVote: ids,
			message: msg,
		}
	}

	public execute(event: VoteEvent) {
		const voteEvent: Vote = {
			voteNeeded: event.voteNeeded,
			message: event.message,
			allowedMembersToVote: event.allowedMembersToVote,
			callback: () => {
				this.actionService.proccessEvent(
					event.nextEventName,
					event.message,
				)
			},
		}
		this.voteService.createVote(voteEvent)
	}

	private getTarget(mentions: MessageMentions) {
		if (mentions.everyone === true || mentions.users.size !== 1) {
			return undefined
		}
		return mentions.users.first()?.id
	}
}
