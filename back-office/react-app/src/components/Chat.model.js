import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import chatServices from '../services/chatServices'
import topics from '../topics'

export default class ChatModel extends RhelenaPresentationModel {
    constructor() {
        super();
        this.loggedUser = globalState.loggedUser
        this.session = null
        this.showCustomerDetails = false
        
        manuh.unsubscribe(topics.chatStation.sessionList.selected, "ChatModel")
        manuh.subscribe(topics.chatStation.sessionList.selected, "ChatModel", msg => {    
            const lastActiveSession = globalState.sessions.filter(s => s.sessionTopic === msg.sessionTopic)[0]  
            this.plugSession(lastActiveSession)
        })

        manuh.unsubscribe(topics.sessions.updates, "ChatModel")
        manuh.subscribe(topics.sessions.updates, "ChatModel", updatedSession => {
            if (this.session 
                && this.session.sessionTopic === updatedSession.sessionTopic
                && this.session.sessionId !== updatedSession.sessionId) {
                    
                this.plugSession(updatedSession)    
            }
        })

        manuh.unsubscribe(topics.chatStation.window.visibility, "MessagesModel")
        manuh.subscribe(topics.chatStation.window.visibility, "MessagesModel", msg => {
            if (this.session && this.session.lastMessages && msg.status === "visible") {
                chatServices.markAllMessagesAsRead(this.session, globalState.loggedUser)
            }
        })

    }

    plugSession(session) {
        if (!session) {
            return;
        }
        // check whether this ViewModel was used for this customerId. If not, initialize and persist the data for this customer
        // this is done so you don't have to instantiate the Chat Component for each selected customer, you just load a different model for the same view 
        // you must keep the state because the interaction state for each customer must be tracked and kept individually. For example, if you open the 
        // details pane for Customer A but don't open for Customer B, when you click to chat with Customer A the details pane must be opened and
        // when you click to chat with Customer B it must be closed
        // So we have 1 view instance attached to 1 model instance but with many states interchanged
        if (!this.isStateKept("chatModels", session.sessionTopic)) {
            this.keepState("chatModels", session.sessionTopic);
            this.initializeAttributes()
        }else{
            this.loadState("chatModels", session.sessionTopic);                   
        }
        
        // connect to this chat session topic messages        
        chatServices.connectToChatSession(session, "ChatModel-Singleton", 
            updatedSession => {
                this.session = updatedSession            
                globalState.lastActiveSession = this.session                
                if (globalState.windowFocused) {
                    chatServices.markAllMessagesAsRead(this.session, globalState.loggedUser)
                }
            }, 
            payload => {   
                this.session = payload.sessionInfo //receive messages (with bundled session)
                if (globalState.windowFocused) {
                    chatServices.markAllMessagesAsRead(this.session, globalState.loggedUser)
                }
            },
            messagesViewed => {
                messagesViewed.readMessages.forEach(m => {
                    let msgIndex = this.session.lastMessages.findIndex(lm => lm.timestamp === m.timestamp && lm.from.id === m.from.id)
                    if(msgIndex !== -1) {
                        this.session.lastMessages[msgIndex] = m
                    }
                }, "MessagesModel")
                
                this.session = this.session
            }
        )
        
    }

    initializeAttributes() {
        this.loggedUser = globalState.loggedUser
        this.session = null
        this.showCustomerDetails = false
    }

    sendMessage(data) {
        //update customer to all those listening to changes on it
        chatServices.sendMessage(this.session, {
            "from": globalState.loggedUser,
            "timestamp": new Date().getTime(),
            "content": data,
            "readAt": null
        })
    }

    toggleCustomerDetails() {
        this.showCustomerDetails = !this.showCustomerDetails
    }
}