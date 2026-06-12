export const DISCORD_API = "https://discord.com/api/v10";
export const DISCORD_CDN = "https://cdn.discordapp.com";

export const PERMISSIONS = {
  ADMINISTRATOR: BigInt("8"),
  MANAGE_GUILD: BigInt("32"),
  MANAGE_CHANNELS: BigInt("16"),
  KICK_MEMBERS: BigInt("2"),
  BAN_MEMBERS: BigInt("4"),
  MANAGE_MESSAGES: BigInt("8192"),
  MODERATE_MEMBERS: BigInt("1099511627776"),
};

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

export interface DiscordGuildDetails {
  id: string;
  name: string;
  icon: string | null;
  banner: string | null;
  description: string | null;
  member_count: number;
  approximate_presence_count?: number;
  owner_id: string;
  features: string[];
  channels?: DiscordChannel[];
  roles?: DiscordRole[];
}

export interface DiscordChannel {
  id: string;
  type: number;
  name: string;
  position: number;
  parent_id: string | null;
}

export interface DiscordRole {
  id: string;
  name: string;
  color: number;
  position: number;
  permissions: string;
  managed: boolean;
}

export function hasPermission(permissions: string, permission: bigint): boolean {
  const perms = BigInt(permissions);
  return (perms & PERMISSIONS.ADMINISTRATOR) !== BigInt(0) ||
         (perms & permission) !== BigInt(0);
}

export function isAdmin(permissions: string): boolean {
  return hasPermission(permissions, PERMISSIONS.ADMINISTRATOR);
}

export function getGuildIconUrl(guildId: string, icon: string | null): string {
  if (!icon) return `https://cdn.discordapp.com/embed/avatars/0.png`;
  const ext = icon.startsWith("a_") ? "gif" : "png";
  return `${DISCORD_CDN}/icons/${guildId}/${icon}.${ext}?size=128`;
}

export function getUserAvatarUrl(userId: string, avatar: string | null, discriminator: string = "0"): string {
  if (!avatar) {
    const defaultIndex = parseInt(discriminator) % 5;
    return `${DISCORD_CDN}/embed/avatars/${defaultIndex}.png`;
  }
  const ext = avatar.startsWith("a_") ? "gif" : "png";
  return `${DISCORD_CDN}/avatars/${userId}/${avatar}.${ext}?size=128`;
}

export async function fetchUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch guilds");
  return res.json();
}

export async function fetchGuildDetails(guildId: string): Promise<DiscordGuildDetails | null> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return null;

  const res = await fetch(`${DISCORD_API}/guilds/${guildId}?with_counts=true`, {
    headers: { Authorization: `Bot ${botToken}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchGuildChannels(guildId: string): Promise<DiscordChannel[]> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return [];

  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${botToken}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export function getAdminGuilds(guilds: DiscordGuild[]): DiscordGuild[] {
  return guilds.filter((guild) => isAdmin(guild.permissions));
}
