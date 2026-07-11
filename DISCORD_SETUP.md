# Discord OAuth Setup

## Setup Login Discord

Per far funzionare il login Discord, devi configurare correttamente l'applicazione Discord:

### 1. Discord Developer Portal
1. Vai su https://discord.com/developers/applications
2. Seleziona la tua applicazione (ID: 1506338164187599061)
3. Vai su **OAuth2** → **General**
4. Aggiungi questi **Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/discord
   ```
5. Salva le modifiche

### 2. Database Setup
Prima di usare il login, devi inizializzare il database:

```bash
# Genera il client Prisma
npx prisma generate

# Esegui le migrazioni
npx prisma db push

# (Opzionale) Apri Prisma Studio per verificare
npx prisma studio
```

### 3. Verifica Variabili d'Ambiente
Assicurati che nel file `.env` ci siano:
- `DISCORD_CLIENT_ID` ✓
- `DISCORD_CLIENT_SECRET` ✓
- `NEXTAUTH_URL` ✓
- `NEXTAUTH_SECRET` (genera uno nuovo con: `openssl rand -base64 32`)
- `DATABASE_URL` ✓

### 4. Riavvia il Server
Dopo aver configurato tutto:
```bash
npm run dev
```

### 5. Test Login
1. Vai su http://localhost:3000/auth/signin
2. Clicca "Sign in with Discord"
3. Autorizza l'applicazione
4. Dovresti essere reindirizzato alla dashboard

## Troubleshooting

### Errore: "redirect_uri_mismatch"
- Verifica che l'URI nel Discord Developer Portal corrisponda esattamente
- Deve essere: `http://localhost:3000/api/auth/callback/discord`

### Errore: "Database connection failed"
- Verifica che il DATABASE_URL sia corretto
- Esegui `npx prisma db push` per creare le tabelle

### Errore: "Invalid client secret"
- Rigenera il client secret nel Discord Developer Portal
- Aggiorna il valore in `.env`
