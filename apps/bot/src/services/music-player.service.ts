import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import LoggerService from './logger.service'
import { Logger } from 'winston'
import DiscordJSService from './discord.service'
import { Message, StreamDispatcher, VoiceChannel } from 'discord.js'
import ytdl from 'ytdl-core'

@injectable()
export default class MusicPlayerService {
	public logger: Logger
	public queue: Array<{ channel: VoiceChannel; url: string }> = []

	public volume: number = 0.5

	public dispatcher?: StreamDispatcher

	constructor(
		@inject(DiscordJSService) public discordJSService: DiscordJSService,
		@inject(LoggerService) loggerService: LoggerService,
	) {
		this.logger = loggerService.get()
		this.discordJSService.client.on('message', this.proccessMessage.bind(this))
		setInterval(this.proccessEvent.bind(this), 1000)
	}

	public push(channel: VoiceChannel, url: string) {
		this.logger.debug(`Push sound event to list`, url)
		this.queue.push({
			channel,
			url,
		})
	}

	public async proccessMessage(msg: Message) {
		const urls = msg.attachments.map((msgAttachement) => msgAttachement.url).filter((url) => url.endsWith('.mp3'))
		const member = msg.member
		if (!member || !member.voice.channel) {
			return
		}
		const channel = member.voice.channel
		if (channel !== null) {
			urls.forEach((url) => this.push(channel, url))
		}
	}

	public async proccessEvent() {
		if (this.dispatcher !== undefined) {
			return
		}
		const event = this.queue.shift()
		if (!event) {
			return
		}
		await this.discordJSService.joinVoiceChannel(event.channel)
		if (this.discordJSService.voiceConnection) {
			if (/youtube/.test(event.url)) {
				this.dispatcher = this.discordJSService.voiceConnection.play(ytdl(event.url), {
					volume: this.volume,
				})
			} else {
				this.dispatcher = this.discordJSService.voiceConnection.play(event.url, {
					volume: this.volume,
				})
			}
			this.dispatcher.on('finish', () => (this.dispatcher = undefined))
			this.dispatcher.on('close', () => (this.dispatcher = undefined))
			this.dispatcher.on('error', () => (this.dispatcher = undefined))
		}
	}

	public async stop() {
		this.queue = []
		this.dispatcher?.end()
	}

	public async pause() {
		this.dispatcher?.pause(true)
	}

	public async unpause() {
		this.dispatcher?.resume()
	}

	public async skip() {
		this.dispatcher?.end()
	}

	public async setVolumne(value: number) {
		this.volume = value
		this.dispatcher?.setVolume(this.volume)
	}
}
