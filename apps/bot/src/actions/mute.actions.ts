import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MuteService from '../services/mute.service'
import { MuteEvent, ValuePerUnit } from './interfaces/events/mute'
import DiscordJSService from '../services/discord.service'
import { Right } from './interfaces/rights'
import { MEMBERS } from '../contants/members'
import { COMMANDS } from '../contants/commands'
import { GROUPS } from '../contants/groups'

@injectable()
export default class MuteAction implements IAction<MuteEvent> {
	public name = COMMANDS.MUTE

	public rights: Right = {
		groups: false,
		members: [MEMBERS.MINIPOPOV],
	}

	public voteRights: Right = {
		groups: [GROUPS.MEMBERS, GROUPS.TITS, GROUPS.ADMIN],
		members: false,
	}

	private readonly reAction = /^([0-9]+)([msh]?)$/

	private multTable: Record<string, ValuePerUnit> = {
		s: 1,
		m: 60,
		h: 3600,
	}

	constructor(
		private readonly actionService: ActionMessageService,
		private readonly muteService: MuteService,
		private readonly discordService: DiscordJSService,
	) {
		this.actionService.registerActionMessage(this.name, this)
	}

	public format(msg: Message): MuteEvent {
		const { member } = msg
		if (!member) {
			throw new Error('Failed to get author')
		}
		const { channel } = member.voice
		if (!channel) {
			throw new Error('Member not connected')
		}
		const target = msg.mentions.users.first()
		if (!target) {
			throw new Error('No target')
		}
		const args = msg.content.split(' ').slice(1)
		if (args.length !== 2) {
			throw new Error('Missing parameters')
		}
		const result = args[1].match(this.reAction)
		if (result === null) {
			throw new Error('Unvalid parameter')
		}
		const valuePerUnit = this.multTable[result[2]] || this.multTable['s']
		return {
			valuePerUnit,
			value: Number(result[1]) * valuePerUnit,
			channelID: channel.id,
			targetID: target.id,
		}
	}

	public doc() {
		return [
			`!${this.name} @<member> <time>`,
			`!${this.name} @Bdz 10`,
			`!${this.name} @Bdz 10s`,
			`!${this.name} @Bdz 10m`,
			`!${this.name} @Bdz 24h`,
		]
	}

	public help(channel: TextChannel) {
		channel.send('!mute')
	}

	public async execute(event: MuteEvent) {
		const [target, channel] = await Promise.all([
			this.discordService.getMember(event.targetID),
			this.discordService.getVoiceChannel(event.channelID),
		])
		this.muteService.addMute(target, channel, event.value)
	}
}
