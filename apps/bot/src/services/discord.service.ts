import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { Client, Guild, GuildChannel, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js'

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
					this.logger.info('Ready')
					resolve(true)
				}
			})
			this.client.login(process.env.BOT_TOKEN)
		})
	}

	public async joinVoiceChannel(channel: VoiceChannel) {
		this.voiceConnection = await channel.join()
		this.logger.info(`Bot joined ${channel.name}`)
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

	public isVoiceChannel(channel: GuildChannel): channel is VoiceChannel {
		return channel.isText() === false && channel.type === 'voice'
	}

	public isTextChannel(channel: GuildChannel): channel is TextChannel {
		return channel.isText() && channel.type === 'text'
	}

	public async getVoiceChannel(id: string): Promise<VoiceChannel> {
		const channel = await this.getChannel(id)
		if (!this.isVoiceChannel(channel)) {
			throw new Error('This channel was not voice channel')
		}

		return channel as VoiceChannel
	}

	public async send(id: string, content: string) {
		const channel = await this.getChannel(id)
		if (this.isTextChannel(channel)) {
			channel.send(content)
		}
	}
}
