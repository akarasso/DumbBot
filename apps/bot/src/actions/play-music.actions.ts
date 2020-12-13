import 'reflect-metadata'
import { Message, TextChannel } from 'discord.js'
import { injectable } from 'inversify'
import { IAction } from './interfaces/actions'
import ActionMessageService from '../services/action-message.service'
import MusicPlayerService from '../services/music-player.service'
import { PlayMusicEvent } from './interfaces/events'
import DiscordJSService from '../services/discord.service'
import { Right } from './interfaces/rights'
import { GROUPS } from '../contants/groups'
import { COMMANDS } from '../contants/commands'

@injectable()
export default class PlayMusicAction implements IAction<PlayMusicEvent[]> {

	public name = COMMANDS.PLAY

	public rights: Right = {
		groups: [
			GROUPS.ADMIN,
			GROUPS.TITS,
			GROUPS.MEMBERS,
		],
		members: false,
	}

	public voteRights: Right = {
		groups: true,
		members: true,
	}

	constructor(
		private readonly actionService: ActionMessageService,
		private readonly musicPlayerService: MusicPlayerService,
		private readonly discordService: DiscordJSService,
	) {
		this.actionService.registerActionMessage(this.name, this)
	}

	public doc() {
		return [
			`!${ this.name } http://url/file.mp3`,
			`!${ this.name } https://cdn.discordapp.com/attachments/785220938102734898/785491052961595412/mpk49.mp3`,
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
