import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔧 Inizializzazione impostazioni piattaforma...");

  const defaultSettings = [
    // General Settings
    { key: "platform_name", value: "CoralMC Tournaments", category: "general" },
    { key: "platform_language", value: "it", category: "general" },
    { key: "platform_timezone", value: "Europe/Rome", category: "general" },
    { key: "platform_description", value: "Piattaforma per tornei Minecraft", category: "general" },

    // Tournament Settings
    { key: "default_elo", value: "1000", category: "tournament" },
    { key: "max_teams_per_tournament", value: "64", category: "tournament" },
    { key: "auto_registration", value: "true", category: "tournament" },
    { key: "check_in_required", value: "true", category: "tournament" },
    { key: "check_in_duration_minutes", value: "30", category: "tournament" },

    // Security Settings
    { key: "discord_auth_enabled", value: "true", category: "security" },
    { key: "rate_limit_requests", value: "100", category: "security" },
    { key: "rate_limit_window_minutes", value: "1", category: "security" },
    { key: "ip_whitelist_enabled", value: "false", category: "security" },
    { key: "ip_whitelist", value: "[]", category: "security" },

    // Notification Settings
    { key: "email_notifications_enabled", value: "false", category: "notifications" },
    { key: "discord_notifications_enabled", value: "true", category: "notifications" },
    { key: "push_notifications_enabled", value: "false", category: "notifications" },
    { key: "discord_webhook_url", value: "", category: "notifications" },

    // Database Settings
    { key: "auto_backup_enabled", value: "true", category: "database" },
    { key: "backup_schedule", value: "0 3 * * *", category: "database" },
    { key: "backup_retention_days", value: "30", category: "database" },

    // API Settings
    { key: "public_api_enabled", value: "true", category: "api" },
    { key: "api_rate_limit", value: "1000", category: "api" },
    { key: "api_rate_limit_window_minutes", value: "60", category: "api" },

    // Maintenance
    { key: "maintenance_mode", value: "false", category: "maintenance" },
    { key: "maintenance_message", value: "La piattaforma è in manutenzione. Torneremo presto!", category: "maintenance" },
  ];

  for (const setting of defaultSettings) {
    await prisma.platformSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Impostazioni inizializzate con successo!");
  console.log(`📊 Totale impostazioni: ${defaultSettings.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Errore durante l'inizializzazione:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
