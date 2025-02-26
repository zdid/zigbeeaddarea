import * as mqtt from 'mqtt';

import {MqttClient , IClientOptions }  from 'mqtt';
import logger from './logger';

let log = logger
log.setLevel('debug')

declare type QoS = 0 | 1 | 2

interface Options { username?:string, password?:string, qos?: QoS, retain?: boolean }
export class ZigbeeAddArea {
  private _client?: MqttClient;
  private _topicIn: string;
 
  private  serverAddress: string;
  private  options : Options;
  private _topicOut: string;

  constructor(serverAddress: string, username : string, password: string , topicIn: string , topicOut: string) {
    this.options = {username : username, password : password, qos: 0, retain : false}
    this.serverAddress = serverAddress
    this._topicIn = topicIn;
    this._topicOut = topicOut;

  }
  connect(): Promise<void> {
     return new Promise((resolve, reject) => {
      log.info(`connect to ${this.serverAddress}`)
        this._client = mqtt.connect(this.serverAddress , this.options);
        log.info("connect")
        // MQTT Connect
        this._client.on('connect',async () => {
          logger.info('connected: declar on message');
          this._client?.on('message',(topic: string, message:Buffer)=> {this._traitMessage(topic,message)});
          let topin = this._topicIn+"/#"
          logger.info(`'Connected to MQTT: subscribe' ${topin}`);
          this._client?.subscribe(topin, (error)=>{log.info(`subscribe error: ${error?error:'aucune'}`)});
          resolve();
        });
    })
  }
  unsubscribe(): void {
    this._client?.unsubscribe(this._topicIn+"/#");
  }


  
  async start(): Promise<void> {
    await this.connect();
  }
  
  stop(): void {
    this.unsubscribe();
  }
  
  private _traitMessage(topic: string, message: Buffer): void {
    log.debug(`traitmessage, topic: ${topic}`)
    let  objectId : string | undefined = undefined;
    let suggestedArea : string = "";
    if(! message.toString().includes('zigbee')) {
        log.debug(`ce n'est pas un message zigbee`)
        return
    }
 
    const jsonMessage: any  = JSON.parse(message.toString());
    log.debug(`${typeof jsonMessage}, ${JSON.stringify(jsonMessage)}`)
    if (! jsonMessage.suggested_area 
        && ! jsonMessage.device?.suggested_area
         && jsonMessage.object_id 
         && jsonMessage.object_id.includes('--')) {
      log.debug('first if')
      suggestedArea = jsonMessage.object_id.split('--')[0]
      if(suggestedArea) {
         jsonMessage.device.suggested_area = suggestedArea;
      }
    }
    const topicParts = topic.split('/');
    topicParts[0]=this._topicOut;
    let topout = topicParts.join('/')
    log.debug(`topicIn ${topic}, topout ${topout} `)
    this._client?.publish(topout, JSON.stringify(jsonMessage), {qos: 0, retain:true})
  }
}
  