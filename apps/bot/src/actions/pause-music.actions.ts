import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { inject, injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { PauseMusicEvent } from './interfaces/events'

@injectable()
export default class PauseMusicAction implements IAction<PauseMusicEvent> {
	constructor(
		@inject(ActionMessageService) private readonly actionService: ActionMessageService,
		@inject(MusicPlayerService) private readonly musicPlayerService: MusicPlayerService,
	) {
		this.actionService.registerActionMessage('pause', this)
	}

	public doc() {
		return ['!pause', '!pause']
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
