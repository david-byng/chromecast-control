var Client                = require('castv2-client').Client;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;
var mdns                  = require('mdns');
const prompt = require("prompt");

var browser = mdns.createBrowser(mdns.tcp('googlecast'));

browser.on('serviceUp', function(service) {
    if (service.name === "ByngAudioCast") {
        console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
        ondeviceup(service.addresses[0]);
        browser.stop();
    }
});

browser.start();

function ondeviceup(host) {

    var client = new Client();

    client.connect(host, function() {
        console.log('connected, launching app ...');

        client.getVolume((err, val) => console.log(err, val));

        const newVolume = parseFloat(process.env.VOL);
        if (Number.isNaN(newVolume) || newVolume < 0 || newVolume > 1) {
            console.log("VOL must be a decimal between 0 and 1.");
        } else {
            console.log("Setting to " + newVolume);
            client.setVolume({ level: 0.20 }, (err, val) => console.log(err, val));
        }
    });

    client.on('error', function(err) {
        console.log('Error: %s', err.message);
        client.close();
    });

    client.on('status', function(msg) {
        console.log(msg);
    });

}
