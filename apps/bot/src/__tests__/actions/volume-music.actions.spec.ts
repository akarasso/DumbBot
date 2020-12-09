import VolumeMusicAction from '../../actions/volume-music.actions'
import { container } from '../../container'
import ActionMessageService from '../../services/action-message.service'
import DiscordJSService from '../../services/discord.service'
import MusicPlayerService from '../../services/music-player.service'
import { MockActionMessageService } from '../__mocks__/action-message.service'
import { MockDiscordJSService } from '../__mocks__/discord.service'
import MockMusicPlayerService from '../__mocks__/music-player.service'

describe('Stop action', () => {
	let action: VolumeMusicAction

	beforeAll(() => {
		container.unbind(ActionMessageService)
		container.unbind(DiscordJSService)
		container.unbind(MusicPlayerService)

		container.bind(ActionMessageService).to(MockActionMessageService)
		container.bind(DiscordJSService).to(MockDiscordJSService)
		container.bind(MusicPlayerService).to(MockMusicPlayerService)
	})

	beforeEach(() => {
		action = container.get(VolumeMusicAction)
	})

	describe('Format event', () => {
		describe('Throw cases', () => {
			const throwCases = [{ content: '!volume' }, { content: '!volume 10' }, { content: '!volume -10' }]
			test.each(throwCases)('Test %j', async (data) => {
				await expect(async () => {
					await action.format(data as any)
				}).rejects.toThrowError()
			})
		})
		describe('Good cases', () => {
			const buildGoodMessage = (content: string): any => ({
				content,
			})
			const goodCases = [
				[buildGoodMessage('!volume 0.5'), 0.5],
				[buildGoodMessage('!volume 1'), 1],
				[buildGoodMessage('!volume 0'), 0],
				[buildGoodMessage('!volume 2'), 2],
			]
			test.each(goodCases)('Test %j', async (msg, expectedValue) => {
				expect(action.format(msg).value).toBe(expectedValue)
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
