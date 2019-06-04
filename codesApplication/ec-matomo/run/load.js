import {
  REVISION,
  VERSION
} from 'ec-connect-me-config'

export default (ecDialog, analytics) => {
  'ngInject'

  analytics.ready.then(() => {
    if (analytics.enabled) {
      analytics.push('Login')
      analytics.push(null, { versionNumber: VERSION, revisionNumber: REVISION })
    } else if (analytics.enabled === null) {
      // Ask user if we can track and enable tracking if user answers positively
      ecDialog.confirm({
        title: 'cookiepolicy.ANALYTICS_QUERY',
        textContent: 'cookiepolicy.ANALYTICS_CONFIRMATION'
      }).then(() => {
        analytics.enabled = true
        analytics.push('Login')
        analytics.push(null, { versionNumber: VERSION, revisionNumber: REVISION })
      }).catch(() => {
        analytics.enabled = false
      })
    }
  })
}
