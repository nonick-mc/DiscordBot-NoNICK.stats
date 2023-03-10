import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, inlineCode } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';

const supportServers = ['The HIVE'];

const infoCommand = new ChatInput(
  {
    name: 'info',
    description: 'このBOTについて',
    dmPermission: true,
  },
  (interaction): void => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(interaction.client.user.username)
          .setDescription([
            '**Minecraftサーバーの統計を表示するBOT**',
            'ミニゲームの戦績等を画像にして表示します！',
          ].join('\n'))
          .setColor(Colors.White)
          .setImage('https://cdn.discordapp.com/attachments/958791423161954445/1059392131644543066/bg.png')
          .setFields({ name: '対応サーバー', value: supportServers.map(v => inlineCode(v)).join(' ') })
          .setFooter({ text: '開発者・nonick-mc#1017', iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png' }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel('サポートサーバー')
            .setURL('https://discord.gg/fVcjCNn733')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setLabel('ドキュメント')
            .setURL('https://docs.nonick-js.com/')
            .setStyle(ButtonStyle.Link),
        ),
      ],
      ephemeral: true,
    });
  },
);

module.exports = [infoCommand];