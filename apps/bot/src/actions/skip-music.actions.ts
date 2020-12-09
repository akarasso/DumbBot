import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { inject, injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { SkipMusicEvent } from './interfaces/events'

@injectable()
export default class SkipMusicAction implements IAction<SkipMusicEvent> {
	constructor(
		@inject(ActionMessageService) private readonly actionService: ActionMessageService,
		@inject(MusicPlayerService) private readonly musicPlayerService: MusicPlayerService,
	) {
		this.actionService.registerActionMessage('skip', this)
	}

	public doc() {
		return ['!skip', '!skip']
	}

	public help(channel: TextChannel) {
		channel.send('!skip')
	}

	public format(_msg: Message): SkipMusicEvent {
		return {}
	}

	public execute(_event: SkipMusicEvent) {
		this.musicPlayerService.skip()
	}
}
