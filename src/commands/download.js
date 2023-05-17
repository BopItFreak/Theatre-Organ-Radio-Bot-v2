const fs = require('fs');
const fetch = require("node-fetch");
const Discord = require("discord.js");
const { clearInterval } = require('timers');
const { google } = require('googleapis');
const key = require('../../db/service_account.json');
const driveFolder = require("../../db/drive_info.json").folder_id;
const scopes = ['https://www.googleapis.com/auth/drive']; 

const auth = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  scopes
);

const drive = google.drive({
  version: 'v3',
  auth,
});

module.exports = {
  name: "download",
  description: "Requests a song and downloads it when it plays.",
  options: [
    {
        name: "id",
        description: "Song ID. Use /search to find a song's ID.",
        required: true,
        type: 4
    }
  ],
  voiceRequired: false,
  func: async (interaction, organ) => {
    let songId = interaction.options.getInteger("id", true);
    let songName = organ.songListData.find((d) => d.id == parseInt(songId))?.name;

    if (!songName) {
        interaction.reply(`:x: Could not find a song with that ID.`);
        return;
    }

    if (organ.requestedSongs.length > 5) organ.requestedSongs.shift();
    if (!organ.requestedSongs.includes(songId)) {
        interaction.reply(`:x: \`${songName}\` has not been requested recently.`);
        return;
    }

    
    console.log(songId);
    console.log(organ.songListData.find((d) => d.id == parseInt(songId)));
    let ending = false;
    const audioFilePath = `./recordings/${songId}.wav`;
    const audioFileStream = fs.createWriteStream(audioFilePath);

    let songEndEvent = (() => {
        audioFileStream.end();
      
        const fileMetadata = {
          name: `${songId} - ${songName}.wav`,
          parents: [driveFolder]
        };
      
        const media = {
          mimeType: 'audio/wav',
          body: fs.createReadStream(audioFilePath),
        };
      
        drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id',
        }).then(file => {
          console.log('File Id: ', file.data.id);
          const fileUrl = `https://drive.google.com/file/d/${file.data.id}/view?usp=sharing`;
          interaction.channel.send(`<@${interaction.user.id}> Your audio has finished downloading for the song \`${songName}\`.\n You can download the file here: ${fileUrl}.`);
        }).catch(err => {
          console.error(err);
          interaction.reply(err.toString());
        });
      });
    
    let songEventInterval = setInterval(() => {
        fetch("http://atosradio.com:8001/currentsong").then((res) => {
            res.text().then((text) => {
                if (!ending && (text == songName)) {
                    ending = true;
                    fetch('http://atosradio.com:8001/stream/2/')
                        .then(res => {
                            res.body.pipe(audioFileStream);
                        })
                        .catch(err => {
                            console.error(err);
                        });               
                } else if (ending && (text != songName)) {
                    clearInterval(songEventInterval);
                    songEndEvent();
                }
            });
        })
    }, 1000);

    interaction.reply(`✅ Download Request for \`${songName}\` Accepted ✅`);
  }
}