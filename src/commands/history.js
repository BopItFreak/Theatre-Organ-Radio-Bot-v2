const fetch = require("node-fetch");

module.exports = {
  name: "history",
  description: "Displays the songs that have been played recently on ATOS Radio",
  func: async (interaction, organ) => {
    fetch(`http://atosradio.com:8001/played.html?sid=2`).then(res => res.text()).catch((e) => {
      interaction.reply("Error: " + e);
      return;
    }).then(body => {
      let desc = body.split("<tbody>")[0].split("<b>Current Song</b>")[1].split("</table")[0].replace(/<[^>]*>/g, "bruh").replace(/bruhbruhbruhbruh/g, "\n`").replace(/bruhbruh/g, "` ");
      console.log(desc)
      interaction.reply({
        embeds: [{
          "title": "Song History",
          "url": "http://atosradio.com:8001/played.html?sid=2",
          "color": 12291602,
          "timestamp": new Date().toISOString(),
          "footer": {
            "icon_url": interaction.user.avatarURL(),
            "text": `Requested by ${interaction.user.username}`
          },
          "description": desc
        }]
      }
      )
    });
  }
}