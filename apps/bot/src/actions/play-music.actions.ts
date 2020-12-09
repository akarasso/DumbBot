import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { inject, injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { PlayMusicEvent } from './interfaces/events'
import DiscordJSService from '../services/discord.service'

@injectable()
export default class PlayMusicAction implements IAction<PlayMusicEvent[]> {
	constructor(
		@inject(ActionMessageService) private readonly actionService: ActionMessageService,
		@inject(MusicPlayerService) private readonly musicPlayerService: MusicPlayerService,
		@inject(DiscordJSService) private readonly discordService: DiscordJSService,
	) {
		this.actionService.registerActionMessage('play', this)
	}

	public doc() {
		return [
			'!play http://url/file.mp3',
			'!play https://cdn.discordapp.com/attachments/785220938102734898/785491052961595412/mpk49.mp3',
		]
	}

	public help(channel: TextChannel) {
		channel.send('!play <url> <url2>...')
	}

	public format(msg: Message): PlayMusicEvent[] {
		const member = msg.member
		if (!member) {
			throw new Error('Failed to get member')
		}
		const channel = member.voice.channel
		if (!channel) {
			throw new Error('Member not connected')
		}
		const args = msg.content.split(' ').slice(1)
		if (!args.length) {
			throw new Error('No url provided')
		}
		const events: PlayMusicEvent[] = []
		args.map((url) => {
			events.push({
				channelID: channel.id,
				url,
			})
		})

		return events
	}

	public async execute(events: PlayMusicEvent[]) {
		for (const event of events) {
			const channel = await this.discordService.getVoiceChannel(event.channelID)
			this.musicPlayerService.push(channel, event.url)
		}
	}
}
