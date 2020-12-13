import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { UnpauseMusicEvent } from './interfaces/events'
import { Right } from './interfaces/rights'
import { GROUPS } from '../contants/groups'
import { COMMANDS } from '../contants/commands'

@injectable()
export default class UnpauseMusicAction implements IAction<UnpauseMusicEvent> {

	public name = COMMANDS.UNPAUSE

	public rights: Right = {
		groups: [
			GROUPS.ADMIN,
			GROUPS.TITS,
			GROUPS.MEMBERS,
		],
		members: false,
	}

	public voteRights: Right = {
		groups: true,
		members: true,
	}

	constructor(
		private readonly actionService: ActionMessageService,
		private readonly musicPlayerService: MusicPlayerService,
	) {
		this.actionService.registerActionMessage(this.name, this)
	}

	public doc() {
		return [
			`!${ this.name }`,
			`!${ this.name }`,
		]
	}

	public help(channel: TextChannel) {
		channel.send('!unpause')
	}

	public format(_msg: Message): UnpauseMusicEvent {
		return {}
	}

	public execute(_event: UnpauseMusicEvent) {
		this.musicPlayerService.unpause()
	}
}
