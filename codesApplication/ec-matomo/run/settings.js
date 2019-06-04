import {
  INTERNAL_SETTINGS_NAVIGATION_EVENT,
  EXTERNAL_SETTINGS_NAVIGATION_EVENT
} from 'ec-settings'

export default (ui, settings, analytics) => {
  'ngInject'

  analytics.push(null, { themeValue: ui.theme, backgroundValue: ui.background })

  settings
    .on(INTERNAL_SETTINGS_NAVIGATION_EVENT, path => {
      path = path.replace('/settings/', '')
      analytics.push('SettingPath', { settingPath: path })
    })
    .on(EXTERNAL_SETTINGS_NAVIGATION_EVENT, name => {
      analytics.push('OutsideNavigation', { outsideDestination: name })
    })
}
