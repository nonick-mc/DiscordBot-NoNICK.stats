import { PermissionFlagsBits, EmbedBuilder, Colors, ApplicationCommandOptionType, Guild } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { adminGuild, adminUser } from '../../../../config.json';

const guildCheck = new ChatInput(
  {
    name: 'reload',
    description: 'π§ ε₯εγγγ΅γΌγγΌIDγ«BOTγζε±γγ¦γγγη’Ίθͺ',
    options: [
      {
        name: 'guildid',
        description: 'γ΅γΌγγΌID',
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
            .setDescription('`β` ζ¨©ιγγγγΎγγ')
            .setColor(Colors.Red),
        ],
        ephemeral: true });
      return;
    }

    const guild = interaction.client.guilds.cache.find(v => v.id == interaction.options.getString('guildid'));
    interaction.reply({ content: guild instanceof Guild ? '`β` εε γγ¦γγΎγ' : '`β` εε γγ¦γγΎγγ', ephemeral: true });
  },
);

module.exports = [guildCheck];