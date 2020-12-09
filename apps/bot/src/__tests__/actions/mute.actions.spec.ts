import MuteAction from '../../actions/mute.actions'
import { container } from '../../container'
import ActionMessageService from '../../services/action-message.service'
import DiscordJSService from '../../services/discord.service'
import { MockActionMessageService } from '../__mocks__/action-message.service'
import { MockDiscordJSService } from '../__mocks__/discord.service'

describe('Mute action', () => {
	let action: MuteAction

	beforeAll(() => {
		container.unbind(ActionMessageService)
		container.unbind(DiscordJSService)
		container.bind(ActionMessageService).to(MockActionMessageService)
		container.bind(DiscordJSService).to(MockDiscordJSService)
	})

	beforeEach(() => {
		action = container.get(MuteAction)
	})

	describe('Format event', () => {
		const channel = { id: '45' }
		const voice = { channel }
		describe('Throw cases', () => {
			const throwCases = [
				{},
				{ member: { voice: {} } },
				{ member: { voice } },
				{ member: { voice }, mentions: { users: { first: () => undefined } } },
				{ member: { voice }, mentions: { users: { first: () => 'user1' } }, content: 'ok' },
				{ member: { voice }, mentions: { users: { first: () => 'user1' } }, content: 'mute hoax abc' },
			]
			test.each(throwCases)('Test %j', async (data) => {
				await expect(async () => {
					await action.format(data as any)
				}).rejects.toThrowError()
			})
		})
		describe('Good cases', () => {
			const buildGoodMessage = (content: string): any => ({
				member: { voice },
				mentions: { users: { first: () => ({ id: content.split(' ')[1] }) } },
				content,
			})
			const goodCases = [
				[buildGoodMessage('mute hoax1 22'), 1, 22, '45', 'hoax1'],
				[buildGoodMessage('mute hoax1 22s'), 1, 22, '45', 'hoax1'],
				[buildGoodMessage('mute hoax2 1s'), 1, 1, '45', 'hoax2'],
				[buildGoodMessage('mute hoax3 1m'), 60, 60, '45', 'hoax3'],
				[buildGoodMessage('mute hoax4 1h'), 3600, 3600, '45', 'hoax4'],
			]
			test.each(goodCases)('Test %j', (msg, valuePerUnit, value, channelID, targetID) => {
				const res = action.format(msg)
				expect(res.valuePerUnit).toBe(valuePerUnit)
				expect(res.value).toBe(value)
				expect(res.channelID).toBe(channelID)
				expect(res.targetID).toBe(targetID)
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
