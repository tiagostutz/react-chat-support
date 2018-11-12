import React  from 'react'
import { 
    MessageList, 
    MessageGroup,
    Message,
    MessageText
} from '@livechat/ui-kit'

import moment from 'moment'
import { withI18n } from "react-i18next";
import './i18n.js'

const component = ({session, userId, t}) => {

    let messages = []
    
    if (session) {
        let groupMessage = null
        session.lastMessages.forEach(m => {
            if (!groupMessage || groupMessage.userId !== m.from.id) {
                groupMessage = {
                    userId: m.from.id,
                    avatarURL: m.from.avatarURL,
                    messages: []
                }
                messages.push(groupMessage)
            }
            if (m.timestamp) {
                groupMessage.messages.push(m)
            }
        })
    }
  
    return (
        <MessageList  active containScrollInSubtree>
        { 
            messages.map((g,idx) => {
                return (
                    <MessageGroup key={idx} onlyFirstWithMeta>
                    {
                        g.messages.map((m, ix) => {
                            return (
                                <Message key={"gr_" + ix} date={moment(new Date(m.timestamp)).fromNow()} isOwn={m.from.id === userId} authorName={m.from.id === userId ? t("You") : m.from.name}>
                                    <MessageText>
                                        {m.content}
                                    </MessageText>
                                </Message>
                            )
                        })
                    }
                    </MessageGroup>
                    )
                })
        }
        </MessageList>
    )
}

export default withI18n()(component)