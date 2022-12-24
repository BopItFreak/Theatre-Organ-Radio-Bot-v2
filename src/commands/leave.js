const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: "leave",
  description: "Disconnects the bot from the voice channel it's in.",
  voiceRequired: true,
  func: async (interaction, organ) => {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      interaction.reply(":x: I'm not in a voice channel.");
      return;
    }
    connection.disconnect();
    interaction.reply(":wave:");
  }
}
