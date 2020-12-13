import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import LoggerService from './logger.service'
import { Logger } from 'winston'
import DiscordJSService from './discord.service'
import { IAction } from '../actions/interfaces/actions'
import { Message } from 'discord.js'
import { CHANNELS } from '../contants/channels'
import { Right } from '../actions/interfaces/rights'

@injectable()
export default class ActionMessageService {
	
	public actionsMessage: Record<string, IAction> = {}
	public logger: Logger

	public channelsWatched: Array<string>

	constructor(
		@inject(DiscordJSService) public discordJSService: DiscordJSService,
		@inject(LoggerService) loggerService: LoggerService,
	) {
		this.logger = loggerService.get()
		this.discordJSService.client.on('message', this.proccessMessage.bind(this))
		if (process.env.ENV === 'prod') {
			this.updateHelp()
			this.channelsWatched = [
				CHANNELS.BOT,
			]
		} else {
			this.channelsWatched = [
				CHANNELS.ADMIN_BOT,
			]
		}
	}

	public async updateHelp() {
		// Added await to register actions. To be improve
		await new Promise((resolve) => setTimeout(resolve, 1000))
		await this.discordJSService.isReady
		const help = await this.discordJSService.guild.channels.cache.get(CHANNELS.HELP)
		if (!help) {
			return
		}
		if (help.isText() && help.type === 'text') {
			const messages = await help.messages.fetch()
			await Promise.all(messages.map((msg) => msg.delete()))
			let doc = 'Commandes:\n'
			for (const actionName in this.actionsMessage) {
				const lines = this.actionsMessage[actionName].doc()
				doc += '**' + lines.shift() + '**'
				doc += '```' + lines.join('\n') + '```'
				doc += '\n'
			}
			await help.send(`${doc}`)
		}
	}

	public registerActionMessage(name: string, actionService: IAction) {
		this.logger.debug(`Register message action ${name}`)
		this.actionsMessage[name] = actionService
	}

	public checkRight(
		right: Right,
		msg: Message,
	) {
		let groupCheck
		let userCheck

		if (typeof right.groups === 'boolean') {
			groupCheck = right.groups
		} else {
			for(const group in right.groups) {
				if (msg.member?.roles.cache.has(group)) {
					groupCheck = true
					break
				}
			}
			groupCheck = false
		}

		if (typeof right.members === 'boolean') {
			userCheck = right.groups
		} else {
			// No need typeguard because any user can type..
			userCheck = right.members.includes(msg.member?.id ?? '' as any)
		}
		return userCheck || groupCheck
	}

	public async proccessEvent(
		actionName: string,
		msg: Message,
		isVoted = false,
	) {
		try {
			const action = this.actionsMessage[actionName]
			if (action) {
				const right = isVoted
					? action.voteRights
					: action.rights
				if (this.checkRight(right, msg)) {
					const event = await action.format(msg)
					await action.execute(event)
				} else {
					msg.reply('You are not allowed to use with command. Try to use it by "!vote" command or contact a moderator')
				}
			}
		} catch (err) {
			this.logger.error('Failed to execute message', err)
		}
	}

	public proccessMessage(msg: Message) {
		const channel = msg.channel
		const guild = msg.guild
		if (!guild || channel.type !== 'text') {
			return
		}
		if (!this.channelsWatched.includes(channel.id)) {
			return
		}
		if (!msg.content.startsWith('!')) {
			return
		}
		const args = msg.content.split(' ')
		const actionName = args.shift()?.slice(1)
		if (!actionName) {
			return
		}

		this.proccessEvent(actionName, msg)
	}
}
