import { OPEN_SEARCH_NAVIGATION_EVENT } from 'ec-search'

export default (search, analytics) => {
  'ngInject'

  search.on(OPEN_SEARCH_NAVIGATION_EVENT, (mode) => {
    analytics.push('MethodSearchContact', { methodSearchContactMode: mode })
  })
}
