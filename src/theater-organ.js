const Discord = require('discord.js');
const fs = require("fs/promises");

class TheaterOrgan {
  constructor() {
    this.client = new Discord.Client({
      intents: 32767
    });
    this.songListData = require("../db/radio-track-data.json");
    this.commands = [];
    this.lastSearchMessages = [];
    this.requestedSongs = [];
    this.player = require("./audio.js");
    this.init();
  }

  async OnInteractionCreate(interaction) {
    if (interaction.isCommand()) {
      let command = this.commands.find((c) => c.name == `${interaction.commandName}`);
      if (command) {
        await command.func(interaction, this);
      }
    }
    
    if (interaction.isButton()) {
      let searchPageIndex = 0;
      let lastSearchInteraction = this.lastSearchMessages[interaction.channel.id];
      if (lastSearchInteraction) {
        searchPageIndex = lastSearchInteraction.searchPageIndex;
        this.editSearchMessage(lastSearchInteraction, interaction, searchPageIndex, lastSearchInteraction.searchPageChunks)
      }   
    }
  }
  
  async OnReady() {
    console.log(`Theater Organ Bot Ready. Logged in as ${this.client.user.tag}!`);
    for (let guild of this.client.guilds.cache.toJSON()) {
      this.commands = await this.LoadCommands(guild.id);
    }
  }

  async LoadCommands(guildID) {
    let cmdModules = await fs.readdir("./src/commands");
    let cmds = [];
    for (let cmd of cmdModules) {
      cmds.push(require(`./commands/${cmd}`));
    }
    for (let cmd of cmds) {
      this.client.application.commands.set([]);
      this.client.application.commands.create(cmd, guildID).catch(err => {
        console.log(err.message);
      });
    }
    return cmds;
  }

  makeSearchMessage(interaction, newPageNum, searchChunks) {
    let interactionInput;
    if (interaction.isCommand()) {
      interactionInput = interaction.options.getString("query", true);
    } else {
      interactionInput = interaction.message.content;
    }

    let generateSearchTemplate = (id, name) => {
      return `**ID**: ${id}, **Name**: ${name}\n`
    };
    let generateShortSearchTemplate = (length) => {
      return `**Length**: ${length}\n`
    }
    let searchTemplate = "";
    let lengthTemplate = "";
    for (let i = 0; i < (searchChunks[newPageNum].length >= 10 ? 10 : searchChunks[newPageNum].length); i++) {
      let result = searchChunks[newPageNum][i];
      let name = truncate(result.name, 49, "…");
      searchTemplate = searchTemplate.concat(generateSearchTemplate(result.id, name));
      lengthTemplate = lengthTemplate.concat(generateShortSearchTemplate(result.songLength));
    }
    return {
      "title": `Search Results for "${interactionInput}"`,
      "url": `http://atosradio.org/samweb/web/playlist.php?search=${encodeURIComponent(interactionInput)}&limit=10`,
      "color": 12291602,
      "timestamp": new Date().toISOString(),
      "footer": {
        "icon_url": interaction.user.avatarURL(),
        "text": `Requested by ${interaction.user.username}`
      },
      "fields": [{
          "name": `Page (${newPageNum + 1}/${searchChunks.length})`, //"󠀀󠀀",
          "value": searchTemplate,
          "inline": true
        },
        {
          "name": "󠀀󠀀",
          "value": lengthTemplate,
          "inline": true
        }
      ]

    }
  }

  async editSearchMessage(interaction, buttonInteraction, newPageNum, searchChunks) {
    switch (buttonInteraction.customId) {
      case "next": {
        if (searchChunks[newPageNum + 1]) {
          ++interaction.searchPageIndex;
          buttonInteraction.update({embeds: [this.makeSearchMessage(interaction, ++newPageNum, searchChunks)]});
        } else {
          buttonInteraction.update({embeds: [this.makeSearchMessage(interaction, newPageNum, searchChunks)]});
        }
        break;
      }
      case "previous": {
        if (searchChunks[newPageNum - 1]) {
          --interaction.searchPageIndex;
          buttonInteraction.update({embeds: [this.makeSearchMessage(interaction, --newPageNum, searchChunks)]});
        } else {
          buttonInteraction.update({embeds: [this.makeSearchMessage(interaction, newPageNum, searchChunks)]});
        }
        break;
      }
      case "delete": {
        buttonInteraction.update({embeds: [], components: [], content: ":boom:"}); 
        setTimeout(() => {
          buttonInteraction.deleteReply();
        }, 3000);
        break;
      }
    }
  }

  init() {
    fs.readFile("./db/token.txt", "utf8").then(token => {
      this.client.login(token);
    });
    this.client.on('ready', this.OnReady.bind(this))
    this.client.on('interactionCreate', this.OnInteractionCreate.bind(this));
    this.client.on("error", e => {
      console.log(e);
    })
  }
}
module.exports = TheaterOrgan;