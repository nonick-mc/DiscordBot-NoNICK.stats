import { ActionRowBuilder, ApplicationCommandOptionType, Colors, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { beMinecraftIdRegExp } from '../../module/Regexps';
import { lock } from '../../../config.json';
import MinecraftIDs from '../../schemas/MinecraftIDs';
import Emojies from '../../module/Emojies';
import axios from 'axios';
import { createHiveStatsCard } from '../../module/canvas/hive';

const API = new Map([
  [ 'month', 'https://api.playhive.com/v0/game/monthly/player' ],
  [ 'all', 'https://api.playhive.com/v0/game/all' ],
]);

const hiveCommand = new ChatInput(
  {
    name: 'hive',
    description: 'HIVEサーバーの統計情報を表示',
    options: [
      {
        name: 'stats',
        description: 'HIVEサーバーのミニゲームの統計を表示',
        options: [
          {
            name: 'game',
            description: 'ゲーム',
            choices: [
              { name: 'Treasure Wars ', value: 'wars' },
              { name: 'Death Run ', value: 'dr' },
              { name: 'Hide And Seek ', value: 'hide' },
              { name: 'Survival Games ', value: 'sg' },
              { name: 'Murder Mystery ', value: 'murder' },
              { name: 'Sky Wars', value: 'sky' },
              { name: 'Capture The Flag ', value: 'ctf' },
              { name: 'Block Drop ', value: 'drop' },
              { name: 'Ground Wars ', value: 'ground' },
              { name: 'Just Build ', value: 'build' },
            ],
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'timeframe',
            description: '統計の期間',
            choices: [
              { name: '月間', value: 'month' },
              { name: 'すべての期間', value: 'all' },
            ],
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'gamertag',
            description: 'ゲーマータグ',
            maxLength: 18,
            minLength: 3,
            type: ApplicationCommandOptionType.String,
          },
        ],
        type: ApplicationCommandOptionType.Subcommand,
      },
      // {
      //   name: 'levels',
      //   description: 'ミニゲームのレベルを表示',
      //   options: [
      //     {
      //       name: 'gamertag',
      //       description: 'ゲーマータグ',
      //       maxLength: 18,
      //       minLength: 3,
      //       type: ApplicationCommandOptionType.String,
      //     },
      //   ],
      //   type: ApplicationCommandOptionType.Subcommand,
      // },
    ],
    dmPermission: false,
  },
  { coolTime: 15_000 },
  async (interaction): Promise<void> => {
    const minecraftId = interaction.options.getString('gamertag') ?? (await MinecraftIDs.findOne({ userId: interaction.user.id }))?.be;

    if (lock.hive) {
      interaction.reply({ content: '`😖` 現在APIサーバーに接続できません。復旧までお待ちください', ephemeral: true });
      return;
    }
    else if (!minecraftId) {
      interaction.reply({ content: '`❌` ゲーマータグを入力してください。`/myid`コマンドを使用して入力を省略することも出来ます。', ephemeral: true });
      return;
    }
    else if (beMinecraftIdRegExp.test(minecraftId)) {
      interaction.reply({ content: '`❌` 無効なゲーマータグが入力されました。', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    if (interaction.options.getSubcommand() == 'stats') {
      const game = interaction.options.getString('game', true);
      const timeFrame = interaction.options.getString('timeframe', true);

      const gameSelect = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId('nonick-stats:hive-stats-game')
          .setOptions(
            { label: 'Treasure Wars', value: 'wars', emoji: Emojies.hive.wars, default: game == 'wars' },
            { label: 'Death Run', value: 'dr', emoji: Emojies.hive.dr, default: game == 'dr' },
            { label: 'Hide And Seek', value: 'hide', emoji: Emojies.hive.hide, default: game == 'hide' },
            { label: 'Survival Games', value: 'sg', emoji: Emojies.hive.sg, default: game == 'sg' },
            { label: 'Murder Mystery', value: 'murder', emoji: Emojies.hive.murder, default: game == 'murder' },
            { label: 'Sky Wars', value: 'sky', emoji: Emojies.hive.sky, default: game == 'sky' },
            { label: 'Capture The Flag', value: 'ctf', emoji: Emojies.hive.ctf, default: game == 'ctf' },
            { label: 'Block Drop', value: 'drop', emoji: Emojies.hive.drop, default: game == 'drop' },
            { label: 'Ground Wars', value: 'ground', emoji: Emojies.hive.ground, default: game == 'ground' },
            { label: 'Just Build', value: 'build', emoji: Emojies.hive.build, default: game == 'build' },
          ),
      );

      const timeFrameSelect = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
        new StringSelectMenuBuilder()
          .setCustomId('nonick-stats:hive-stats-timeFrame')
          .setOptions(
            { label: '月間', value: 'month', default: timeFrame == 'month' },
            { label: 'すべての期間', value: 'all', default: timeFrame == 'all' },
          ),
      );

      axios.get(`${API.get(timeFrame)}/${game}/${minecraftId}`, { timeout: 10000 })
        .then(async (res): Promise<void> => {
          interaction.followUp({
            content: `${minecraftId}の統計を表示します`,
            files: [await createHiveStatsCard(res?.data as BaseGameStats, minecraftId, game)],
            components: [gameSelect, timeFrameSelect],
          });
        })
        .catch((err): void => {
          if (err.response?.status === 404) {
            interaction.followUp({
              content: `${minecraftId}の統計を表示します`,
              embeds: [
                new EmbedBuilder()
                .setDescription('`❌` 選択した期間にプレイヤーが一回もこのゲームを遊んでいません')
                .setColor(Colors.Red),
              ],
              components: [gameSelect, timeFrameSelect],
            });
            return;
          }
          interaction.followUp('`❌` APIサーバーに接続できませんでした');
        });
    }
    // else if (interaction.options.getSubcommand() == 'levels') {
    //   const Games = new Map([
    //     ['basic', ['wars', 'dr', 'hide', 'sg', 'murder', 'sky', 'build']],
    //     ['arcade', ['ctf', 'drop', 'ground']],
    //   ]);

    //   const gameCategorySelect = new ActionRowBuilder().setComponents(
    //     new SelectMenuBuilder()
    //       .setCustomId('nonick-stats:hive-level-category')
    //       .setOptions(
    //         { label: 'Basic Game', value: 'basic', emoji: emojis.hive.hub, default: true },
    //         { label: 'Arcade Game', value: 'arcade', emoji: emojis.hive.arcade },
    //       ),
    //   );

    //   Promise.all(Games.get('basic').map(async v => ({ [v]: (await axios.get(`https://api.playhive.com/v0/game/all/${v}/${gamerTag}`, { timeout: 10000 }))?.data })))
    //     .then(async res => {
    //       interaction.followUp({
    //         content: `${gamerTag}のHIVE上でのレベルを表示します`,
    //         files: [await createHiveLevelsCard(Object.assign(...res), gamerTag, 'basic')],
    //         components: [gameCategorySelect],
    //       });
    //     })
    //     .catch(err => {
    //       if (err.response?.status === 404) return interaction.followUp({ content: '`❌` このプレイヤーはHIVEで一回もログインしていません' });
    //       interaction.followUp('`❌` 何らかの原因でAPIサーバーに接続できませんでした');
    //     });
    // }
  },
);

module.exports = [hiveCommand];