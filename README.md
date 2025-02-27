## For home-assistant From Zigbee2mqtt
add device/suggested_area to message discovery of zigbee2mqtt.
the friendlyname of zigbee2mqtt message is <suggested_area>--friendlyname
ex:
friendlyname = 'salle--lumiere_chambre_d_ami
this device.suggested_area = salle

In Home assistant it's directly add to "Salle"

Change in zigbee2mqtt, topic to homeassistant by homeassist
zigbeeaddarea write on  topic homeassistant
