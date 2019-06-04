import {
  MB_CREATED_EVENT,
  MB_JOINED_EVENT,
  START_SCREEN_SHARING_EVENT,
  FAIL_SCREEN_SHARING_EVENT
} from 'ec-mediabridge'

const START_CONFERENCE = 'StartConference'
const START_SCREENSHARING = 'StartScreenSharing'
const FAIL_SCREEN_SHARING = 'FailScreenSharing'

export default (mediabridge, analytics) => {
  'ngInject'

  mediabridge.on(MB_CREATED_EVENT, (mb) => {
    mb
      .on(MB_JOINED_EVENT, () => analytics.push(START_CONFERENCE))
      .on(START_SCREEN_SHARING_EVENT, () => analytics.push(START_SCREENSHARING))
      .on(FAIL_SCREEN_SHARING_EVENT, (reason) => analytics.push(FAIL_SCREEN_SHARING, {
        failScreenSharingReason: reason.replace('mediabridge.', '')
      }))
  })
}
