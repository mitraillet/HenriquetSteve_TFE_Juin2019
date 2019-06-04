import {
  OUTGOING_SESSION_EVENT,
  INCOMING_SESSION_EVENT,
  SESSION_ACCEPTED_EVENT,
  SESSION_HOLD_EVENT,
  SESSION_MUTED_EVENT
} from 'ec-dialer'

const EMITTED_CALL = 'EmittedCall'
const HOLD_CALL = 'ChangingToHoldCall'
const MUTE_CALL = 'ChangingToMutedCall'

export default (softphone, analytics) => {
  'ngInject'

  softphone
    .on(OUTGOING_SESSION_EVENT, () => analytics.push(EMITTED_CALL, { emittedCallType: 'outgoing' }))
    .on(INCOMING_SESSION_EVENT, () => analytics.push(EMITTED_CALL, { emittedCallType: 'incoming' }))
    .on(SESSION_ACCEPTED_EVENT, session => session
      .on(SESSION_HOLD_EVENT, () => analytics.push(HOLD_CALL, { callStatus: 'hold' }))
      .on(SESSION_MUTED_EVENT, () => analytics.push(MUTE_CALL, { callStatus: 'muted' }))
    )
}
