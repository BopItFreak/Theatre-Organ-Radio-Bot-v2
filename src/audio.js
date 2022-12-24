const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const player = createAudioPlayer();

const resource = createAudioResource('http://atosradio.com:8001/stream/2/', {
	metadata: {
		title: 'ATOS Radio',
	},
});

player.play(resource, {
  filter: "audioonly",
  quality: 'highestaudio'
});

player.on('error', error => {
	console.error(error);
});

module.exports = player;