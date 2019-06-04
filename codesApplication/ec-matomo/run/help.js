import { HELP_LOAD_EVENT } from 'ec-help'

export default (help, analytics) => {
  'ngInject'

  help.on(HELP_LOAD_EVENT, uri => {
    const baseName = uri.replace('.json', '')
    if (baseName !== '_index' && baseName !== '_home') {
      analytics.push('HelpPath', { helpPath: baseName })
    }
  })
}
