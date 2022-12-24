const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");

module.exports = {
  name: "search",
  description: "Search the ATOS Radio database for a song.",
  options: [
    {
        name: "query",
        description: "Search query. Both artists and song names supported.",
        required: true,
        type: 3
    }
  ],
  func: async (interaction, organ) => {
    let interactionInput = interaction.options.getString("query", true);
    let searchResults = organ.songListData.filter((d) => d.name.toLowerCase().includes(interactionInput.toLowerCase()));
    let searchPageChunks = searchResults.chunk(10);

    if (searchResults.length > 0) {
      //buttons
      const searchButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('⬅️')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('➡️')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('delete')
          .setLabel('❎')//❌
          .setStyle(ButtonStyle.Danger)
      )

      //reply to interaction
      interaction.reply({
        embeds: [organ.makeSearchMessage(interaction, 0, searchPageChunks)],
        components: [searchButtons]
      }).then(async () => {        
        interaction.searchPageIndex = 0;
        interaction.searchPageChunks = searchPageChunks;
        interaction.input = interactionInput;
        organ.lastSearchMessages[interaction.channel.id] ? organ.lastSearchMessages[interaction.channel.id].deleteReply() : {};
        organ.lastSearchMessages[interaction.channel.id] = interaction;
      })     
    } else {
      interaction.reply(`No Results for \`${interactionInput}\`.`);
      return;
    }
  }
}
