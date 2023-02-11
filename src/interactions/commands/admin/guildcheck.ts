import { PermissionFlagsBits, EmbedBuilder, Colors, ApplicationCommandOptionType, Guild } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { adminGuild, adminUser } from '../../../../config.json';

const guildCheck = new ChatInput(
  {
    name: 'reload',
    description: '🔧 入力したサーバーIDにBOTが所属しているか確認',
    options: [
      {
        name: 'guildid',
        description: 'サーバーID',
        type: ApplicationCommandOptionType.String,
        maxLength: 19,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
  },
  { guildId: adminGuild },
  async (interaction): Promise<void> => {
    if (!adminUser.includes(interaction.user.id)) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('`❌` 権限がありません')
            .setColor(Colors.Red),
        ],
        ephemeral: true });
      return;
    }

    const guild = interaction.client.guilds.cache.find(v => v.id == interaction.options.getString('guildid'));
    interaction.reply({ content: guild instanceof Guild ? '`✅` 参加しています' : '`❌` 参加していません', ephemeral: true });
  },
);

module.exports = [guildCheck];