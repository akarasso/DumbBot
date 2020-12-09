import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { inject, injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { UnpauseMusicEvent } from './interfaces/events'

@injectable()
export default class UnpauseMusicAction implements IAction<UnpauseMusicEvent> {
	constructor(
		@inject(ActionMessageService) private readonly actionService: ActionMessageService,
		@inject(MusicPlayerService) private readonly musicPlayerService: MusicPlayerService,
	) {
		this.actionService.registerActionMessage('unpause', this)
	}

	public doc() {
		return ['!unpause', '!unpause']
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
