import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { GuildMember, VoiceChannel, VoiceState } from 'discord.js'

import LoggerService from './logger.service'
import DiscordJSService from './discord.service'

@injectable()
export default class MuteService {
	public logger: Logger
	public muteTable: {
		[voiceChannel: string]: { [idMember: string]: boolean }
	} = {}

	constructor(
		@inject(LoggerService) private readonly loggerService: LoggerService,
		@inject(DiscordJSService)
		private readonly discordJSService: DiscordJSService,
	) {
		this.logger = this.loggerService.get()
		this.discordJSService.client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this))
	}

	public async addMute(member: GuildMember, channel: VoiceChannel, seconds: number) {
		if (member.voice.channel?.id == channel.id) {
			member.voice.setMute(true)
		}
		if (this.muteTable[channel.id] === undefined) {
			this.muteTable[channel.id] = {}
		}
		this.muteTable[channel.id][member.id] = true
		setTimeout(async () => {
			const updateMember = await member.fetch(true)
			delete this.muteTable[channel.id][member.id]
			if (updateMember) {
				if (updateMember.voice.channel?.id == channel.id) {
					member.voice.setMute(false)
				}
			}
		}, seconds * 1000)
	}

	private async onVoiceStateUpdate(_oldState: VoiceState, newState: VoiceState) {
		const channelID = newState.channelID
		const memberId = newState.member?.id
		if (!memberId) {
			return
		}
		const member = await this.discordJSService.guild?.members.fetch(memberId)
		if (!member) {
			return
		}
		if (!member.voice.channel) {
			return
		}
		if (
			channelID !== null &&
			memberId !== undefined &&
			this.muteTable[channelID] !== undefined &&
			this.muteTable[channelID][memberId]
		) {
			if (member !== undefined && member.voice.serverMute !== true) {
				member.voice.setMute(true)
			}
		} else if (member.voice.serverMute !== false) {
			member.voice.setMute(false)
		}
	}
}
