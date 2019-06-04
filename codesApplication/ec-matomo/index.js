import { module } from 'ng'

import ecChat from 'ec-chat'
import ecDialer from 'ec-dialer'
import ecHotkeys from 'ec-hotkeys'
import ecJabra from 'ec-jabra'
import ecMediabridge from 'ec-mediabridge'
import ecSettings from 'ec-settings'
import ecSoftphone from 'ec-softphone'
import ecSoftphoneTransfer from 'ec-softphone-transfer'
import ecUser from 'ec-user'
import ecUserStatus from 'ec-user-status'

import analytics from './services/analytics'

import chatRun from './run/chat'
import fileshareRun from './run/fileshare'
import headsetRun from './run/headset'
import helpRun from './run/help'
import hotkeysRun from './run/hotkeys'
import loadRun from './run/load'
import mediabridge from './run/media-bridge'
import searchRun from './run/search'
import settingsRun from './run/settings'
import softphoneRun from './run/softphone'
import transferRun from './run/transfer'
import userManagerRun from './run/user-manager'

export default module('ecMatomo', [ ecChat, ecDialer, ecHotkeys, ecJabra, ecMediabridge, ecSettings, ecSoftphone, ecSoftphoneTransfer, ecUser, ecUserStatus ])
  .service('analytics', analytics)
  .run(chatRun)
  .run(fileshareRun)
  .run(headsetRun)
  .run(helpRun)
  .run(hotkeysRun)
  .run(loadRun)
  .run(mediabridge)
  .run(searchRun)
  .run(settingsRun)
  .run(softphoneRun)
  .run(transferRun)
  .run(userManagerRun)
  .name
