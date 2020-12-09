import { Container } from 'inversify'
import ActionMessageService from '../services/action-message.service'
import DiscordJSService from '../services/discord.service'
import LoggerService from '../services/logger.service'
import MusicPlayerService from '../services/music-player.service'

import PauseMusicAction from '../actions/pause-music.actions'
import PlayMusicAction from '../actions/play-music.actions'
import SkipMusicAction from '../actions/skip-music.actions'
import StopMusicAction from '../actions/stop-music.actions'
import UnpauseMusicAction from '../actions/unpause-music.actions'
import VolumeMusicAction from '../actions/volume-music.actions'
import VoteAction from '../actions/vote.actions'
import VoteService from '../services/vote.service'
import MuteAction from '../actions/mute.actions'
import MuteService from '../services/mute.service'

export const container = new Container()

container.bind<DiscordJSService>(DiscordJSService).to(DiscordJSService).inSingletonScope()
container.bind<MusicPlayerService>(MusicPlayerService).to(MusicPlayerService).inSingletonScope()
container.bind<ActionMessageService>(ActionMessageService).to(ActionMessageService).inSingletonScope()
container.bind<LoggerService>(LoggerService).to(LoggerService).inSingletonScope()
container.bind<VoteService>(VoteService).to(VoteService).inSingletonScope()
container.bind<MuteService>(MuteService).to(MuteService).inSingletonScope()

container.bind<PauseMusicAction>(PauseMusicAction).to(PauseMusicAction).inSingletonScope()
container.bind<PlayMusicAction>(PlayMusicAction).to(PlayMusicAction).inSingletonScope()
container.bind<SkipMusicAction>(SkipMusicAction).to(SkipMusicAction).inSingletonScope()
container.bind<StopMusicAction>(StopMusicAction).to(StopMusicAction).inSingletonScope()
container.bind<UnpauseMusicAction>(UnpauseMusicAction).to(UnpauseMusicAction).inSingletonScope()
container.bind<VolumeMusicAction>(VolumeMusicAction).to(VolumeMusicAction).inSingletonScope()
container.bind<VoteAction>(VoteAction).to(VoteAction).inSingletonScope()
container.bind<MuteAction>(MuteAction).to(MuteAction).inSingletonScope()
