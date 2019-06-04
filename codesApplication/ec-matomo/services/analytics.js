import {
  USER_LOGIN_EVENT,
  USER_LOGOUT_EVENT
} from 'ec-user'

import {
  USER_PARAMETERS_EVENT
} from 'ec-user-parameters'

const URL_ANALYTICS = 'https://webstat.connect.fuzer.net/js/container_IF7gtGDM.js'

const METRICS_PARAMETER = 'uep.Metrics'

const START_EVENT = 'mtm.Start'
const START_TIME = 'mtm.startTime'

export default function AnalyticsFactory ($q, userManager) {
  'ngInject'

  function isAnalyticsLoaded () {
    const scripts = Array.from(document.getElementsByTagName('script'))
    return scripts.some(script => script.src === URL_ANALYTICS)
  }

  function loadAnalytics () {
    window._mtm.push(Object.assign({ event: START_EVENT }, { [START_TIME]: (new Date().getTime()) }))
    const scriptElement = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      async: true,
      defer: true,
      src: URL_ANALYTICS
    })
    document.head.appendChild(scriptElement)
  }

  // Initialize the Matomo array variable
  window._mtm = window._mtm || []
  let ready = $q.defer()

  class Analytics {
    constructor () {
      userManager.on(USER_LOGIN_EVENT, user => {
        user.on(USER_PARAMETERS_EVENT, () => {
          this.user = user
          if (this.enabled) {
            this.addAnalyticsCode()
          } else {
            this.supressAnalyticsCode()
          }
          ready.resolve()
        })
        user.on(USER_LOGOUT_EVENT, () => {
          this.user = null
          ready = $q.defer()
        })
      })
    }

    get ready () {
      return ready.promise
    }

    get enabled () {
      if (!this.user) {
        return null
      }
      switch (this.user.parameters[METRICS_PARAMETER]) {
        case '1':
          return true
        case '0':
          return false
        default:
          return null
      }
    }

    set enabled (isEnabled) {
      return this.user.setParameter(METRICS_PARAMETER, isEnabled ? '1' : '0', true)
        .then(() => userManager.clearStorage())
        .then(() => isEnabled ? this.addAnalyticsCode() : this.supressAnalyticsCode())
    }

    supressAnalyticsCode () {
      if (isAnalyticsLoaded()) {
        userManager.clearStorage()
        document.location.reload(true)
      }
    }

    addAnalyticsCode () {
      if (!isAnalyticsLoaded()) {
        loadAnalytics()
      }
    }

    push (event, data = {}) {
      if (event) {
        window._mtm.push(Object.assign({ event }, data))
      } else {
        window._mtm.push(data)
      }
    }
  }

  return new Analytics()
}
