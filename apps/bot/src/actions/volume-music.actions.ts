import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { VolumeMusicEvent } from './interfaces/events'
import { Right } from './interfaces/rights'
import { GROUPS } from '../contants/groups'
import { COMMANDS } from '../contants/commands'

@injectable()
export default class VolumeMusicAction implements IAction<VolumeMusicEvent> {

	public name = COMMANDS.VOLUME

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
			`!${ this.name } <0-2>`,
			`!${ this.name } 0.1`,
			`!${ this.name } 2`,
		]
	}

	public help(channel: TextChannel) {
		channel.send('!volume <number>')
	}

	public format(msg: Message): VolumeMusicEvent {
		const args = msg.content.split(' ').slice(1)
		if (args.length !== 1) {
			throw new Error('Unvalid count of parameters')
		}
		const value = Number(args[0])
		if (value < 0 || value > 2) {
			throw new Error('Unvalid parameters')
		}
		return {
			value,
		}
	}

	public execute(event: VolumeMusicEvent) {
		this.musicPlayerService.setVolumne(event.value)
	}
}
