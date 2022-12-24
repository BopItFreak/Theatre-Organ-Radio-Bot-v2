//PS. PLEASE ignore this file. It's an example of what works, but is terrible (old code).
const Discord = require("discord.js")

module.exports = {
  name: "eval",
  description: "Evaluates JavaScript code.",
  options: [
    {
        name: "code",
        description: "The Code to evaluate.",
        required: true,
        type: 3
    }
  ],
  voiceRequired: true,
  func: async (interaction, organ) => {
    let interactionInput = interaction.options.getString("code", true);
    var input = interactionInput;
      if (interaction.user.id == "246799235775725569") {
        if (input.startsWith('```js\n')) {
          input = input.split('```js\n')[1];
        }
        if (input.endsWith('```')) {
          input = input.split('```')[0];
        }
        let trued = false;
        let ofo = false;
        const prettyMs = require("pretty-ms");
        var typeOf = require("typeof");
        //{split:{prepend:unescape("%60%60%60js%0A"),append:unescape("%0A%60%60%60")}}
        //console.log(input)
        try {
          global.disdate = Date.now();
          let eaa = await eval(input);
          disdate = Number.isFinite((Date.now() - global.disdate)) == true ? (Date.now() - global.disdate) : 0
          /*eaa.then((a) => {
            disdate = Number.isFinite((Date.now() - global.disdate)) == true ? (Date.now() - global.disdate) : 0
            eaa = a
          })*/
          if (require("util").inspect(eaa).startsWith("[Function: ")) {
            eaa = eaa.toString();
            ofo = true;
          }
          let tonq = eaa;
          let tonq2 = eaa;
          if (!ofo) {
            eaa = require("util").inspect(eaa, {
              depth: 1
            }) //.replace(/undefined/g, "unduhfinded")
            eaa = eaa.split(/\r?\n|\r/g).slice(0, 100).join("\n")



            if (eaa.length >= 1750) {
              eaa = require("util").inspect(tonq2, {
                depth: 0
              }) //.replace(/undefined/g, "unduhfinded")
              eaa = eaa.split(/\r?\n|\r/g).slice(0, 100).join("\n")
            }
            if (eaa.startsWith("<ref")) eaa = eaa.split("<ref")[1].split("> ")[1];

          }

          //handle promis parse
          if (tonq instanceof Promise) {
            tonq.then(async function (qwer) {
              trued = true;
              qwer = require("util").inspect(qwer, {
                depth: 1
              }) //replace(/undefined/g, "unduhfinded");
              qwer = qwer.split(/\r?\n|\r/g).slice(0, 100).join("\n");

              if (qwer.length >= 1750) {
                qwer = require("util").inspect(tonq, {
                  depth: 0
                }) //.replace(/undefined/g, "unduhfinded")
                qwer = qwer.split(/\r?\n|\r/g).slice(0, 100).join("\n")
              }
              if (qwer.startsWith("<ref")) qwer = qwer.split("<ref")[1].split("> ")[1];
              //console.log(disdate)
              await interaction.reply('```js\n' + '-> ' + Discord.escapeMarkdown(qwer) + '\n``````arm\n' + typeOf(tonq) + "```" + "`success`" + ":clock:" + " " + prettyMs(disdate), {
                split: {
                  prepend: "\x60\x60\x60js\n",
                  append: "\n\x60\x60\x60"
                }
              });

            })
          } else {
            if (!trued) {
              //console.log(disdate)
              await interaction.reply('```js\n' + '-> ' + Discord.escapeMarkdown(eaa) + '``````arm\n' + typeOf(tonq) + "``` " + "`success`" + ":clock:" + " " + prettyMs(disdate), {
                split: {
                  prepend: "\x60\x60\x60js\n",
                  append: "\n\x60\x60\x60"
                }
              });
            }
          }


        } catch (e) {
          disdate = Number.isFinite((Date.now() - global.disdate)) == true ? (Date.now() - global.disdate) : 0
          //console.log(global.disdate)
          e = e.message.split(/\r?\n|\r/g).slice(0, 100).join("\n");
          await interaction.reply('```diff\n' + '-> ' + Discord.escapeMarkdown(e) + '\n```' + "`FAIL!!!`" + " " + ":clock:" + " " + prettyMs(disdate));
        }
      } else {
        interaction.reply("⛔");
      }
  }
}