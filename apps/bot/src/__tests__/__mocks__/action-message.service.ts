import { Message } from 'discord.js'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'
import { IAction } from '../../actions/interfaces/actions'
import ActionMessageService from '../../services/action-message.service'
import DiscordJSService from '../../services/discord.service'
import LoggerService from '../../services/logger.service'

@injectable()
export class MockActionMessageService implements ActionMessageService {
	public actionsMessage: Record<string, IAction> = {}
	public logger: Logger

	constructor(
		@inject(DiscordJSService) public discordJSService: DiscordJSService,
		@inject(LoggerService) loggerService: LoggerService,
	) {
		this.logger = loggerService.get()
	}

	public async updateHelp() {
		return Promise.resolve()
	}

	public registerActionMessage(_name: string, _actionService: IAction) {}

	public async proccessEvent(_actionName: string, _msg: Message) {
		return Promise.resolve()
	}

	public proccessMessage(_msg: Message) {}
}
