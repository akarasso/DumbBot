import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { inject, injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { VolumeMusicEvent } from './interfaces/events'

@injectable()
export default class VolumeMusicAction implements IAction<VolumeMusicEvent> {
	constructor(
		@inject(ActionMessageService) private readonly actionService: ActionMessageService,
		@inject(MusicPlayerService) private readonly musicPlayerService: MusicPlayerService,
	) {
		this.actionService.registerActionMessage('volume', this)
	}

	public doc() {
		return ['!volume <0-2>', '!volume 0.1', '!volume 2']
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
