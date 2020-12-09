import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Client, Guild, GuildChannel, VoiceChannel, VoiceConnection } from 'discord.js'

import LoggerService from './logger.service'
import { GUILDS } from '../contants/guilds'

@injectable()
export default class DiscordJSService {
	public client: Client
	public guild!: Guild
	public isReady: Promise<boolean>
	public voiceConnection?: VoiceConnection
	public logger: Logger

	constructor(@inject(LoggerService) loggerService: LoggerService) {
		this.logger = loggerService.get()
		this.client = new Client()
		this.isReady = new Promise((resolve, rejects) => {
			this.client.on('ready', async () => {
				this.guild = await this.client.guilds.fetch(GUILDS.TAVERNE)
				if (this.guild === undefined) {
					rejects("unable to find 'La taverne'")
				} else {
					console.error('i m ready')
					this.logger.info('Ready')
					resolve(true)
				}
			})
			this.client.login(process.env.BOT_TOKEN)
		})
	}

	public async joinVoiceChannel(channel: VoiceChannel) {
		this.voiceConnection = await channel.join()
	}

	public async getMember(id: string) {
		const member = await this.guild.members.resolve(id)
		if (!member) {
			throw new Error('Failed to fetch member')
		}

		return member
	}

	public async getChannel(id: string) {
		const channel = await this.guild.channels.resolve(id)
		if (!channel) {
			throw new Error('Failed to get channel')
		}

		return channel
	}

	public isVoiceChannel(channel: GuildChannel) {
		return channel.isText() === false && channel.type === 'voice'
	}

	public async getVoiceChannel(id: string): Promise<VoiceChannel> {
		const channel = await this.getChannel(id)
		if (!this.isVoiceChannel(channel)) {
			throw new Error('This channel was not voice channel')
		}

		return channel as VoiceChannel
	}
}
