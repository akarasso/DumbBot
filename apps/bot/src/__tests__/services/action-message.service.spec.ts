import { buildContainer } from "../../container"
import ActionMessageService from "../../services/action-message.service"
import DiscordJSService from "../../services/discord.service"
import { MockDiscordJSService } from "../__mocks__/discord.service"

describe('Action message service', () => {    
    it('registerActionMessage: Should register action', () => {
        const container = buildContainer()
        container.rebind(DiscordJSService).to(MockDiscordJSService)
        const service: ActionMessageService = container.get(ActionMessageService)
        service.registerActionMessage('jest_action2', {} as any)
        expect(service.actionsMessage['jest_action2']).toBeDefined()
    })

    describe('proccessEvent', () => {
        const container = buildContainer()
        container.rebind(DiscordJSService).to(MockDiscordJSService)
        const service: ActionMessageService = container.get(ActionMessageService)
        const format = jest.fn((msg) => Promise.resolve(msg))
        const execute = jest.fn()
        const newAction = { format, execute }
        const casesProccessEvent = [
            { name: 'test' },
            { name2: 'test2' },
            { name3: 'test3' },
        ]
        it.each(casesProccessEvent)('Test', async (event: any) => {
            service.registerActionMessage('jest_action', newAction as any)
            await service.proccessEvent('jest_action', event)
            expect(format.call.length).toBe(1)
            expect(execute.call.length).toBe(1)
            expect(JSON.stringify(format.mock.calls[0][0])).toBe(JSON.stringify(event))
            format.mockReset()
            execute.mockReset()
        })
    })

    describe('proccessMessage', () => {
        describe('Bad cases', () => {
            const container = buildContainer()
            container.rebind(DiscordJSService).to(MockDiscordJSService)
            const service: ActionMessageService = container.get(ActionMessageService)
            const badCases = [
                {},
                { guild: false },
                { guild: 'oui', channel: { type: 'voice' }, content: 'LAA' },
                { guild: 'oui', channel: { type: 'text' }, content: 'LAA' },
                { guild: 'oui', channel: { type: 'text' }, content: '!' },
            ]
            const mockProccessEvent = jest.fn()
            jest.spyOn(service, 'proccessEvent').mockImplementation(mockProccessEvent)
            it.each(badCases)('Test %j', (msg: any) => {
                service.proccessMessage(msg)
                expect(mockProccessEvent.mock.calls.length).toBe(0)
                mockProccessEvent.mockReset()
            })
        })
        describe('Good cases', () => {
            const container = buildContainer()
            container.rebind(DiscordJSService).to(MockDiscordJSService)
            const service: ActionMessageService = container.get(ActionMessageService)
            const goodCases = [
                { guild: 'oui', channel: { type: 'text' }, content: '!action' },
            ]
            const mockProccessEvent = jest.fn()
            jest.spyOn(service, 'proccessEvent').mockImplementation(mockProccessEvent)
            it.each(goodCases)('Test %j', (msg: any) => {
                service.proccessMessage(msg)
                expect(mockProccessEvent.mock.calls.length).toBe(1)
                mockProccessEvent.mockReset()
            })
        })

    })
})