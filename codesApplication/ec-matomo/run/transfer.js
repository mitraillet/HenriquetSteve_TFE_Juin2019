import {
  ATTENTED_TRANSFER_EVENT,
  BLIND_TRANSFER_EVENT
} from 'ec-softphone-transfer'

export default (transfer, analytics) => {
  'ngInject'

  transfer
    .on(ATTENTED_TRANSFER_EVENT, () => analytics.push('AttentedTransfer'))
    .on(BLIND_TRANSFER_EVENT, () => analytics.push('BlindTransfer'))
}
