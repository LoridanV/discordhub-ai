import { generateChartData } from "./utils";

export function getMockAnalytics(days = 30) {
  return {
    overview: {
      totalMembers: 12847,
      totalMembersChange: 8.4,
      activeMembers: 3291,
      activeMembersChange: 12.1,
      messageCount: 48203,
      messageCountChange: -3.2,
      ticketsThisWeek: 47,
      ticketsChange: 22.3,
      moderationActions: 128,
      moderationActionsChange: -15.6,
      retentionRate: 87.4,
      retentionChange: 2.1,
    },
    memberGrowth: generateChartData(days, 200, 120),
    messageActivity: generateChartData(days, 1600, 800),
    voiceActivity: generateChartData(days, 320, 150),
    ticketActivity: generateChartData(days, 6, 8),
    moderationActivity: generateChartData(days, 4, 6),
    channelBreakdown: [
      { name: "#general", messages: 14320, percentage: 29.7 },
      { name: "#off-topic", messages: 9841, percentage: 20.4 },
      { name: "#help", messages: 7203, percentage: 14.9 },
      { name: "#announcements", messages: 3102, percentage: 6.4 },
      { name: "#introductions", messages: 2876, percentage: 6.0 },
      { name: "Other", messages: 10861, percentage: 22.5 },
    ],
    hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${i.toString().padStart(2, "0")}:00`,
      messages: Math.round(
        100 * (1 + Math.sin((i - 6) * Math.PI / 12) * 0.8) * (Math.random() * 0.3 + 0.85)
      ),
    })),
    retentionCohort: [
      { week: "Week 1", retained: 100 },
      { week: "Week 2", retained: 78 },
      { week: "Week 3", retained: 65 },
      { week: "Week 4", retained: 58 },
      { week: "Week 6", retained: 48 },
      { week: "Week 8", retained: 41 },
    ],
  };
}

export function getMockModerationLogs(count = 20) {
  const actions = ["WARN", "TIMEOUT", "KICK", "BAN", "MESSAGE_DELETE", "MUTE"];
  const categories = ["toxicity", "spam", "scam", "phishing", "hateSpeech"];
  const names = ["ShadowHunter99", "CryptoKing2024", "xXDarkness", "FreeNitro_Bot", "Troll_Master", "SpamBot_v2"];

  return Array.from({ length: count }, (_, i) => {
    const severity = Math.random();
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 43);
    return {
      id: `log-${i}`,
      targetName: names[Math.floor(Math.random() * names.length)],
      targetId: Math.random().toString().slice(2, 18),
      action: actions[Math.floor(Math.random() * actions.length)],
      reason: ["Toxic content detected", "Spam behavior", "Phishing link", "Hate speech", "Scam attempt"][Math.floor(Math.random() * 5)],
      severity,
      aiDetected: Math.random() > 0.3,
      aiCategory: categories[Math.floor(Math.random() * categories.length)],
      createdAt: date.toISOString(),
    };
  });
}

export function getMockTickets(count = 15) {
  const categories = ["SUPPORT", "BUG_REPORT", "FEATURE_REQUEST", "APPEAL", "OTHER"];
  const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
  const statuses = ["OPEN", "IN_PROGRESS", "CLOSED", "RESOLVED"];
  const titles = [
    "Cannot access #announcements channel",
    "Bot not responding to commands",
    "Request to add music bot",
    "Unfair ban appeal",
    "Verification system broken",
    "Nitro role not assigned",
    "Report: harassment in DMs",
    "Invite link expired",
    "Wrong role assigned at join",
    "Feature: custom welcome message",
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - i * 3);
    return {
      id: `ticket-${i}`,
      ticketId: `TKT-${(1000 + i).toString().toUpperCase()}`,
      title: titles[i % titles.length],
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      creatorName: ["JohnDoe#1234", "PixelWarrior", "Nightfall_", "Seren_Dev", "AlphaWolf99"][i % 5],
      creatorAvatar: null,
      messageCount: Math.floor(Math.random() * 12) + 1,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };
  });
}

export function getMockServers() {
  return [
    {
      id: "server-1",
      discordId: "123456789012345678",
      name: "Gaming Paradise",
      icon: null,
      memberCount: 12847,
      plan: "PRO",
      onlineCount: 3291,
    },
    {
      id: "server-2",
      discordId: "234567890123456789",
      name: "Dev Community",
      icon: null,
      memberCount: 4201,
      plan: "FREE",
      onlineCount: 823,
    },
    {
      id: "server-3",
      discordId: "345678901234567890",
      name: "Art & Design Hub",
      icon: null,
      memberCount: 8932,
      plan: "ENTERPRISE",
      onlineCount: 1847,
    },
  ];
}
