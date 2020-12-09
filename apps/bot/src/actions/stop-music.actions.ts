import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { inject, injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { StopMusicEvent } from './interfaces/events'

@injectable()
export default class StopMusicAction implements IAction<StopMusicEvent> {
	constructor(
		@inject(ActionMessageService) private readonly actionService: ActionMessageService,
		@inject(MusicPlayerService) private readonly musicPlayerService: MusicPlayerService,
	) {
		this.actionService.registerActionMessage('stop', this)
	}

	public doc() {
		return ['!stop', '!stop']
	}

	public help(channel: TextChannel) {
		channel.send('!stop')
	}

	public format(_msg: Message): StopMusicEvent {
		return {}
	}

	public execute(_event: StopMusicEvent) {
		this.musicPlayerService.stop()
	}
}
