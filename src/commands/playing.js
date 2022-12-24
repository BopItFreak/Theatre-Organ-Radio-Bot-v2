const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = {
  name: "playing",
  description: "View the currently playing song.",
  func: async (interaction, organ) => {
    fetch(`https://atosradio.org/atosradio/songinfo.html`).then(res => res.text()).catch((e) => {
      interaction.reply("Error: " + e);
      return;
    }).then(songInfoBody => {
      let $ = cheerio.load(songInfoBody);
      let songData = {};
      songData.title = $('#page > dl:nth-child(3) > dd:nth-child(2)').text();
      songData.artist = $('#page > dl:nth-child(3) > dd:nth-child(4) > a').text();
      songData.artistURL = $('#page > dl:nth-child(3) > dd:nth-child(4) > a').attr('href');
      songData.album = $('#page > dl:nth-child(3) > dd:nth-child(6) > a').text();
      songData.duration = $('#page > dl:nth-child(3) > dd:nth-child(8)').text();
      songData.info = $('#page > dl:nth-child(3) > dd.broad').text();
      songData.listenersCount = $('#page > dl:nth-child(5) > dd:nth-child(2)').text();
      fetch('https://atosradio.org/atosradio/playing.html').then(res => res.text()).catch((e) => {
        interaction.reply("Error: " + e);
        return;
      }).then(playingBody => {
        let songListData = organ.songListData;
        $ = cheerio.load(playingBody);
        let nextSong = {};
        let nextNextSong = {};
        nextSong.name = $('#coming-up > table > tbody > tr:nth-child(2) > td:nth-child(1) > span').text().split("1 -")[1].trim();
        nextSong.artist = $('#coming-up > table > tbody > tr:nth-child(2) > td:nth-child(2)').text().replace("\n", "").trim();
        nextSong.album = $('#coming-up > table > tbody > tr:nth-child(2) > td:nth-child(3)').text();
        nextNextSong.name = $('#coming-up > table > tbody > tr:nth-child(3) > td:nth-child(1) > span').text().split("2 -")[1].trim();
        nextNextSong.artist = $('#coming-up > table > tbody > tr:nth-child(3) > td:nth-child(2)').text().replace("\n", "").trim();
        nextNextSong.album = $('#coming-up > table > tbody > tr:nth-child(3) > td:nth-child(3)').text();
        interaction.reply({
          embeds: [{
            "title": "Currently Playing Track Information",
            "url": "https://atosradio.org/atosradio/songinfo.html",
            "color": 12291602,
            "timestamp": new Date().toISOString(),
            "footer": {
              "icon_url": interaction.user.avatarURL,
              "text": `Requested by ${interaction.user.username}`
            },
            "thumbnail": {
              "url": songListData.find((d) => d.album === songData.album).pictureUrl
            },
            "fields": [{
                "name": "Title",
                "value": songData.title
              },
              {
                "name": "Artist",
                "value": songData.artist
              },
              {
                "name": "Album",
                "value": songData.album ? songData.album : "No Album",
                "inline": true
              },
              {
                "name": "Duration",
                "value": songData.duration,
                "inline": true
              },
              {
                "name": "Information",
                "value": songData.info ? songData.info : "No Information",
                "inline": true
              },
              {
                "name": "Listeners Count",
                "value": songData.listenersCount,
                "inline": true
              },
              {
                "name": "Coming Up...",
                "value": `**1.** **Name**: ${nextSong.name}, **Artist**: ${nextSong.artist}, **Album**: ${nextSong.album}
                          **2.** **Name**: ${nextNextSong.name}, **Artist**: ${nextNextSong.artist}, **Album**: ${nextNextSong.album}`,
                "inline": true
              }
            ]
          }]
        });
      });
    });
  }
}