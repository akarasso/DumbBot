import PlayMusicAction from '../../actions/play-music.actions'
import { container } from '../../container'
import ActionMessageService from '../../services/action-message.service'
import DiscordJSService from '../../services/discord.service'
import MusicPlayerService from '../../services/music-player.service'
import { MockActionMessageService } from '../__mocks__/action-message.service'
import { MockDiscordJSService } from '../__mocks__/discord.service'
import MockMusicPlayerService from '../__mocks__/music-player.service'

describe('Play action', () => {
	let action: PlayMusicAction

	beforeAll(() => {
		container.unbind(ActionMessageService)
		container.unbind(DiscordJSService)
		container.unbind(MusicPlayerService)

		container.bind(ActionMessageService).to(MockActionMessageService)
		container.bind(DiscordJSService).to(MockDiscordJSService)
		container.bind(MusicPlayerService).to(MockMusicPlayerService)
	})

	beforeEach(() => {
		action = container.get(PlayMusicAction)
	})

	describe('Format event', () => {
		const channel = { id: '45' }
		const voice = { channel }
		describe('Throw cases', () => {
			const throwCases = [{}, { member: { voice: {} } }, { member: { voice } }, { member: { voice }, content: '!play' }]
			test.each(throwCases)('Test %j', async (data) => {
				await expect(async () => {
					await action.format(data as any)
				}).rejects.toThrowError()
			})
		})
		describe('Good cases', () => {
			const buildGoodMessage = (content: string): any => ({
				member: { voice },
				content,
			})
			const goodCases = [[buildGoodMessage('!play url'), { channelID: '45', url: 'url' }]]
			test.each(goodCases)('Test %j', (msg, ...urls) => {
				const results = action.format(msg)
				expect(results.length).toBe(urls.length)
				results.forEach((result, index) => {
					expect(result.channelID).toBe(urls[index].channelID)
					expect(result.url).toBe(urls[index].url)
				})
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
