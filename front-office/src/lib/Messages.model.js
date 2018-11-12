import { RhelenaPresentationModel, globalState } from 'rhelena';
import manuh from 'manuh'
import topics from './services/topics'

export default class MessagesModel extends RhelenaPresentationModel {
    constructor() {
        super();

        this.session = globalState.session
        this.userData = globalState.userData
        
        manuh.unsubscribe(topics.sessions.updates, "MessagesModel")
        manuh.subscribe(topics.sessions.updates, "MessagesModel", session => {
            console.log(' U P D A T E S   O N   T H E');
            
            session.lastMessages = this.session.lastMessages
            this.session = session            
        })        

        manuh.unsubscribe(`${this.session.sessionTopic}/messages`, "MessagesModel")
        manuh.subscribe(`${this.session.sessionTopic}/messages`, "MessagesModel", payload => {
            const mixSession = this.session                
            const sessionWithMessages = payload.sessionInfo
            mixSession.lastMessages.push(sessionWithMessages.lastMessages[sessionWithMessages.lastMessages.length-1])
            this.session = mixSession
        })
    }

    clearListeners() {
        manuh.unsubscribe(topics.sessions.updates, "MessagesModel")
        manuh.unsubscribe(`${this.session.sessionTopic}/messages`, "MessagesModel")
    }
}