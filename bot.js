require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Contoare temporare per server
const dailyStats = new Map();

function getStats(guildId) {
  if (!dailyStats.has(guildId)) {
    dailyStats.set(guildId, {
      messageCount: 0,
      activeMembers: new Set(),
      voiceMinutes: 0,
      newMembers: 0,
      leftMembers: 0,
    });
  }
  return dailyStats.get(guildId);
}

// Bot gata
client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot online: ${c.user.tag}`);
  console.log(`📡 Conectat la ${c.guilds.cache.size} servere`);

  // Trimite statistici la fiecare 5 minute
  setInterval(() => syncStats(), 5 * 60 * 1000);
});

// Numără mesajele
client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const stats = getStats(message.guild.id);
  stats.messageCount++;
  stats.activeMembers.add(message.author.id);
});

// Urmărește membrii noi
client.on(Events.GuildMemberAdd, (member) => {
  const stats = getStats(member.guild.id);
  stats.newMembers++;
  console.log(`➕ Membru nou în ${member.guild.name}: ${member.user.tag}`);
});

// Urmărește membrii care pleacă
client.on(Events.GuildMemberRemove, (member) => {
  const stats = getStats(member.guild.id);
  stats.leftMembers++;
  console.log(`➖ Membru plecat din ${member.guild.name}: ${member.user.tag}`);
});

// Urmărește activitatea vocală
const voiceJoinTimes = new Map();

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  const userId = newState.member?.id;
  const guildId = newState.guild.id;
  const key = `${guildId}-${userId}`;

  // A intrat în voice
  if (!oldState.channelId && newState.channelId) {
    voiceJoinTimes.set(key, Date.now());
  }

  // A ieșit din voice
  if (oldState.channelId && !newState.channelId) {
    const joinTime = voiceJoinTimes.get(key);
    if (joinTime) {
      const minutes = Math.round((Date.now() - joinTime) / 60000);
      const stats = getStats(guildId);
      stats.voiceMinutes += minutes;
      voiceJoinTimes.delete(key);
    }
  }
});

// Trimite statisticile la API
async function syncStats() {
  for (const [guildId, stats] of dailyStats.entries()) {
    if (stats.messageCount === 0 && stats.activeMembers.size === 0) continue;

    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) continue;

      const payload = {
        discordId: guildId,
        messageCount: stats.messageCount,
        activeMembers: stats.activeMembers.size,
        voiceMinutes: stats.voiceMinutes,
        newMembers: stats.newMembers,
        leftMembers: stats.leftMembers,
        memberCount: guild.memberCount,
      };

      const res = await fetch(`${API_URL}/api/bot/stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log(`📊 Stats trimise pentru ${guild.name}`);
        // Reset contoare
        stats.messageCount = 0;
        stats.activeMembers.clear();
        stats.voiceMinutes = 0;
        stats.newMembers = 0;
        stats.leftMembers = 0;
      }
    } catch (e) {
      console.error(`Eroare sync stats:`, e);
    }
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);