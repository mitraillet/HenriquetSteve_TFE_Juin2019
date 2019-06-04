import { HOTKEY_EVENT } from 'ec-hotkeys'

export default (hotkeys, analytics) => {
  'ngInject'

  hotkeys.on(HOTKEY_EVENT, combo => {
    analytics.push('HotkeyUse', { hotkeyValue: combo })
  })
}
