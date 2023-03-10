import { PermissionFlagsBits, EmbedBuilder, Colors } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { adminGuild, adminUser } from '../../../../config.json';

const reloadCommand = new ChatInput(
  {
    name: 'reload',
    description: '๐ง BOTใๅ่ตทๅ',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
  },
  { guildId: adminGuild },
  async (interaction): Promise<void> => {
    // PM2็ฐๅขๅใงใฎใฟๅไฝ

    if (!adminUser.includes(interaction.user.id)) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('`โ` ๆจฉ้ใใใใพใใ')
            .setColor(Colors.Red),
        ],
        ephemeral: true });
      return;
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription('`๐ง` ๅ่ตทๅใใพใ...')
          .setColor(Colors.Green),
      ],
      ephemeral: true,
    });

    process.exit();
  },
);

module.exports = [reloadCommand];