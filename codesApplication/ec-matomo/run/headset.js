import {
  HEADSET_ACCEPT_CALL,
  HEADSET_REJECT_CALL,
  HEADSET_END_CALL
} from 'ec-jabra'

export default function (headset, analytics) {
  'ngInject'

  headset
    .on(HEADSET_ACCEPT_CALL, () => analytics.push('UseOfHeadsetJabra'))
    .on(HEADSET_REJECT_CALL, () => analytics.push('UseOfHeadsetJabra'))
    .on(HEADSET_END_CALL, () => analytics.push('UseOfHeadsetJabra'))
}
