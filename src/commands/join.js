const { VoiceConnectionStatus, joinVoiceChannel, entersState } = require("@discordjs/voice");

module.exports = {
  name: "join",
  description: "Connects the bot to the voice channel you're in.",
  func: async (interaction, organ) => {
    let voiceChannel = interaction.member.voice.channel;
    let subscription;
    if (voiceChannel) {
      //join voice channel
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      //reply to interaction once connected
      connection.once(VoiceConnectionStatus.Ready, () => {
        subscription = connection.subscribe(organ.player);
        interaction.reply(`Playing The ATOS Radio in ${voiceChannel.toString()}`);
      });

      //error check connection
      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 2_000)
      } catch (error) {
        interaction.reply(`Failed to join the voice channel. Perhaps there is a permissions issue?`);
        connection.destroy();
      }  
      
      //handle disconnects
      connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          // Seems to be a real disconnect which SHOULDN'T be recovered from
          subscription.unsubscribe();
          connection.destroy();
        }       
      });

    } else {
      interaction.reply(":x: You must be in a voice channel to use this command.");
    }
  }
}