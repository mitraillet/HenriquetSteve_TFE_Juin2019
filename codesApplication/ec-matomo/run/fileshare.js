export default (fileShare, analytics) => {
  'ngInject'

  fileShare.onCompleteAll = () => analytics.push('FileUpload')
}
