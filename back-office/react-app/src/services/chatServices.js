import mqttProvider from 'simple-mqtt-client'
import uuidv1 from 'uuid/v1'
import topics from '../topics'
import config from '../config'
import instructions from './instructions'

// import { t } from 'i18next';
// import '../i18n.js'

// enable debug for browser, if running on it
if (window.localStorage)  {
    window.localStorage.debug = process.env.REACT_APP_DEBUG
} 

if (!process.env.REACT_APP_MQTT_BROKER_HOST) {
    console.error("REACT_APP_MQTT_BROKER_HOST not FOUND!")
    throw new Error("REACT_APP_MQTT_BROKER_HOST var is not set. Please provide a MQTT broker host to connect") 
}

const mqttBrokerHost = process.env.REACT_APP_MQTT_BROKER_HOST || "http://localhost:8081/mqtt"
const mqttBrokerUsername = process.env.REACT_APP_MQTT_USERNAME || ""
const mqttBrokerPassword = process.env.REACT_APP_MQTT_PASSWORD || ""
const baseTopic = process.env.REACT_APP_MQTT_BASE_TOPIC


let chatServices = {
    _ready: false,
    mqttClient: null,
    startService: async (attendantId, onChatReady, onChatAborted) => {

        if (this.mqttClient==null) {
            throw new Error("Cannot start chat because there were problems with the MQTT client config")
        }

        this.mqttClient.subscribe(`${topics.client.attendants.assign}/${attendantId}`, (msg) => {
            console.log('ASSIGNED!!');            
        })
        
        const post = await fetch(`${config.backendEndpoint}/config/attendant`)
        const config = await post.json()

        // configure keep alive
        setInterval(() => {
            this.mqttClient.publish(topics.server.attendants.online, {
                "id": attendantId
            })
        }, config.keepAliveTTL/2)
    }
}

mqttProvider.init(mqttBrokerHost, mqttBrokerUsername, mqttBrokerPassword, baseTopic, (mqttClientParam) => {    
    chatServices._ready = true
    chatServices.mqttClient = mqttClientParam
});

export default chatServices