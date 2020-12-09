import PauseMusicAction from '../../actions/pause-music.actions'
import { container } from '../../container'
import ActionMessageService from '../../services/action-message.service'
import DiscordJSService from '../../services/discord.service'
import MusicPlayerService from '../../services/music-player.service'
import { MockActionMessageService } from '../__mocks__/action-message.service'
import { MockDiscordJSService } from '../__mocks__/discord.service'
import MockMusicPlayerService from '../__mocks__/music-player.service'

describe('Pause action', () => {
	let action: PauseMusicAction

	beforeAll(() => {
		container.unbind(ActionMessageService)
		container.unbind(DiscordJSService)
		container.unbind(MusicPlayerService)

		container.bind(ActionMessageService).to(MockActionMessageService)
		container.bind(DiscordJSService).to(MockDiscordJSService)
		container.bind(MusicPlayerService).to(MockMusicPlayerService)
	})

	beforeEach(() => {
		action = container.get(PauseMusicAction)
	})

	describe('Format event', () => {
		const channel = { id: '45' }
		const voice = { channel }
		describe('Good cases', () => {
			const buildGoodMessage = (content: string): any => ({
				member: { voice },
				mentions: { users: { first: () => ({ id: content.split(' ')[1] }) } },
				content,
			})
			const goodCases = [[buildGoodMessage('!pause')]]
			test.each(goodCases)('Test %j', async (msg) => {
				expect(JSON.stringify(action.format(msg))).toBe('{}')
			})
		})
	})

	describe('Documentation', () => {
		test('return something', () => {
			expect(Array.isArray(action.doc())).toBe(true)
		})
	})

	describe('Help', () => {
		test('Should send help', () => {
			const send = jest.fn()
			const channel: any = { send }
			action.help(channel)
			expect(send.mock.calls.length).toBe(1)
			expect(Array.isArray(action.doc())).toBe(true)
		})
	})
})
