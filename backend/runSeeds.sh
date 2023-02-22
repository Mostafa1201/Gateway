echo "seeding data"
node ./seeds/gateways.js
node ./seeds/devices.js
node ./seeds/addDevicesToGateways.js
exit