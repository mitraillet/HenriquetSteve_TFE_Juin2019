import {
  USER_FRONT_END_CHANGE_STATUS_EVENT,
  USER_FRONT_END_CHANGE_IDENTITY_EVENT
} from 'ec-user-status'

import { USER_UPDATED_EVENT } from 'ec-user-parameters'

import {
  USER_LOGIN_EVENT,
  USER_LOGOUT_EVENT
} from 'ec-user'

export default (userManager, analytics) => {
  'ngInject'

  userManager
    .on(USER_LOGIN_EVENT, user => user
      .on(USER_FRONT_END_CHANGE_STATUS_EVENT, value => analytics.push('StatusChange', { statusValue: value }))
      .on(USER_FRONT_END_CHANGE_IDENTITY_EVENT, value => analytics.push('IdentityChange', { identityValue: value }))
      .on(USER_UPDATED_EVENT, name => analytics.push('SettingsServerUpdate', { settingsServerValue: name }))
    )
    .on(USER_LOGOUT_EVENT, () => analytics.push('Logout'))
}
