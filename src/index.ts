import { ZigbeeAddArea } from "./zigbeeaddarae"

//const cl = new ZigbeeConnection('mqtt://localhost:1883','didier','G2filles','homeassistant/#')
var serv = process.env.MQTT_SERVER
var user = process.env.MQTT_USERNAME || ''
var passwd = process.env.MQTT_PASSWORD || ''
var inpref = process.env.MQTT_IN_PREFIX
var outpref = process.env.MQTT_OUT_PREFIX
const cl = new ZigbeeAddArea(serv as string,user,passwd,inpref as string,outpref as string)
function handleQuit() {
    cl.stop()
    process.exit(0);
}
process.on('SIGINT', handleQuit);
process.on('SIGTERM', handleQuit);
cl.start();
export function dev() { console.log('Developpements') }
