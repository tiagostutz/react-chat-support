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
        
        manuh.subscribe(topics.chatStation.sessionList.selected, "ChatModel", session => {      

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

            this.session = globalState.sessions.filter(s => s.sessionTopic === session.sessionTopic)[0]        

            // connect to this chat session topic messages
            chatServices.connectToChatSession(session, "ChatModel-Singleton", sessionUpdated => {                
                this.session = sessionUpdated //refresh session data (even messages)
            })
        })

    }
    initializeAttributes() {
        this.loggedUser = globalState.loggedUser
        this.session = null
        this.showCustomerDetails = false
    }

    sendMessage(data) {
        //update customer to all those listening to changes on it
        chatServices.sendMessage(this.session, {
            from: globalState.loggedUser,
            to: this.customer,
            timestamp: new Date().getTime(),
            content: data
        })
    }

    toggleCustomerDetails() {
        this.showCustomerDetails = !this.showCustomerDetails
    }
}