import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { PauseMusicEvent } from './interfaces/events'
import { Right } from './interfaces/rights'
import { GROUPS } from '../contants/groups'
import { COMMANDS } from '../contants/commands'

@injectable()
export default class PauseMusicAction implements IAction<PauseMusicEvent> {

	public name = COMMANDS.PAUSE

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
		channel.send('!pause')
	}

	public format(_msg: Message): PauseMusicEvent {
		return {}
	}

	public execute(_event: PauseMusicEvent) {
		this.musicPlayerService.pause()
	}
}
