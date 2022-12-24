const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = {
  name: "request",
  description: "Request a song to be played from the ATOS Radio.",
  options: [
    {
        name: "id",
        description: "Song ID. Use /search to find a song's ID.",
        required: true,
        type: 4
    }
  ],
  func: async (interaction, organ) => {
    let interactionInput = interaction.options.getInteger("id", true);
    fetch(`https://atosradio.org/samweb/web/request.php?songID=${interactionInput}`).then(res => res.text()).catch((e) => {
      interaction.reply("Error: " + e);
      return;
    }).then(body => {
      let $ = cheerio.load(body);
      let requestMessage = $('#page > h2').text().replace(":", ": ");
      let song = organ.songListData.find((d) => d.id == interactionInput);
      if (!($("#page > h2").attr("class") == "success")) {//$("#page > h2.error").attr("class")
        interaction.reply(`You have requested: \`${song.name}\`. ID: \`${song.id}\`.\n❌ \`\`${requestMessage}\`\` ❌`) 
      } else {
        interaction.reply(`You have requested: \`${song.name}\`. ID: \`${song.id}\`.\n✅ \`\`${requestMessage}\`\` ✅`);
      }
    });
  }
}