import { Client, Guild, GuildChannel, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import DiscordJSService from '../../services/discord.service'
import LoggerService from '../../services/logger.service'

@injectable()
export class MockDiscordJSService implements DiscordJSService {
	public client: Client = new Client()
	public guild: Guild = {} as any
	public isReady: Promise<boolean> = {} as any
	public voiceConnection?: VoiceConnection = {} as any
	public logger: Logger

	constructor(@inject(LoggerService) loggerService: LoggerService) {
		this.logger = loggerService.get()
		this.client.destroy()
	}

	public async joinVoiceChannel(_channel: VoiceChannel) {}

	public async getMember(id: string) {
		return id as any
	}

	public async getChannel(id: string) {
		return id as any
	}

	public isVoiceChannel(channel: GuildChannel): channel is VoiceChannel {
		return !!channel
	}

	public isTextChannel(channel: GuildChannel): channel is TextChannel {
		return !!channel
	}

	public async getVoiceChannel(id: string): Promise<VoiceChannel> {
		return id as any
	}

	public async send(_id: string, _content: string) {
		
	}
}
