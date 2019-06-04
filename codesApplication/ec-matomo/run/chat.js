import {
  MESSAGE_SENT_EVENT,
  CONVERSATION_CREATED_EVENT
} from 'ec-chat'

export default (chat, analytics) => {
  'ngInject'

  chat.on(CONVERSATION_CREATED_EVENT, conversation => {
    conversation.on(MESSAGE_SENT_EVENT, () => analytics.push('SendMessage'))
  })
}
