import VoteAction from '../../actions/vote.actions'
import { container } from '../../container'
import ActionMessageService from '../../services/action-message.service'
import DiscordJSService from '../../services/discord.service'
import VoteService from '../../services/vote.service'
import { MockActionMessageService } from '../__mocks__/action-message.service'
import { MockDiscordJSService } from '../__mocks__/discord.service'
import { MockVoteService } from '../__mocks__/vote.service'

describe('Vote action', () => {
	let action: VoteAction

	beforeAll(() => {
		container.unbind(ActionMessageService)
		container.unbind(DiscordJSService)
		container.unbind(VoteService)

		container.bind(ActionMessageService).to(MockActionMessageService)
		container.bind(DiscordJSService).to(MockDiscordJSService)
		container.bind(VoteService).to(MockVoteService)
	})

	beforeEach(() => {
		action = container.get(VoteAction)
	})

	describe('Format event', () => {
		const channel = { id: '45', members: [], }
		const voice = { channel, channelID: '45' }
		describe('Throw cases', () => {
			const throwCases = [
				{},
				{ member: { voice: {} } },
				{ member: { voice }, content: 'vote' },
				{ member: { voice }, content: 'vote hoax abc' },
				{
					member: { voice }, content: 'vote vote abc',
					mentions: { everyone: true },
				},
			]
			test.each(throwCases)('Test %j', async (data) => {
				await expect(async () => {
					await action.format(data as any)
				}).rejects.toThrowError()
			})
		})
		describe('Good cases', () => {
			const goodCases = [
				[
					{
						member: { voice }, content: 'vote vote abc',
						mentions: {
							everyone: false,
							users: {
								size: 1,
								first: () => ({
									id: '42',
								})
							},
						},
					},
					{
						nextEventName: 'vote',
						voteNeeded: 0,
						allowedMembersToVote: [],
					}
				]
			]
			test.each(goodCases)('Test %j', async (msg, expected: Record<string, any>) => {
				const res = action.format(msg as any)
				for (const key in expected) {
					expect(JSON.stringify((res as any)[key])).toBe(JSON.stringify(expected[key]))
				}
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
