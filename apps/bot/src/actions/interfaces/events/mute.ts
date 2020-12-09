export type ValuePerUnit = 1 | 60 | 3600

export type MuteEvent = {
    value: number
    valuePerUnit: ValuePerUnit
    channelID: string
    targetID: string
}