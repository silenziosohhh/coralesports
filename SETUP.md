# 🚀 CoralMC Tournaments - Setup Guide

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coralmc_tournaments"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### 2. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Discord OAuth Setup

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "CoralMC Tournaments"
4. Go to "OAuth2" section
5. Add redirect URL: `http://localhost:3000/api/auth/callback/discord`
6. Copy Client ID and Client Secret to `.env`

### 4. Database Setup

#### Option A: Local PostgreSQL

Install PostgreSQL and create a database:

```bash
createdb coralmc_tournaments
```

#### Option B: Docker PostgreSQL

```bash
docker run --name coralmc-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=coralmc_tournaments \
  -p 5432:5432 \
  -d postgres:15
```

#### Option C: Cloud Database (Recommended for Production)

Use services like:
- **Supabase** (Free tier available)
- **Railway** (Free tier available)
- **Neon** (Free tier available)
- **PlanetScale** (Free tier available)

### 5. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
CoralMC Tournaments/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   └── auth/         # NextAuth endpoints
│   │   ├── auth/             # Auth pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── tournaments/      # Tournament pages
│   │   ├── teams/            # Team pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── navbar.tsx       # Navigation
│   │   └── providers.tsx    # Context providers
│   ├── lib/                  # Utilities
│   │   ├── auth.ts          # NextAuth config
│   │   ├── prisma.ts        # Prisma client
│   │   └── utils.ts         # Helper functions
│   ├── types/               # TypeScript types
│   │   └── next-auth.d.ts   # NextAuth types
│   └── middleware.ts        # Route protection
├── .env                      # Environment variables
├── .env.example             # Environment template
├── next.config.mjs          # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
├── Dockerfile               # Docker config
└── package.json             # Dependencies
```

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open Prisma Studio GUI
npx prisma migrate dev   # Create and apply migrations
npx prisma migrate reset # Reset database (WARNING: deletes all data)
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema changes without migration

# Docker
docker build -t coralmc-tournaments .
docker run -p 3000:3000 coralmc-tournaments
```

## 🎨 Key Features Implemented

### ✅ Core Infrastructure
- [x] Next.js 14 with App Router
- [x] TypeScript configuration
- [x] TailwindCSS with custom theme
- [x] Prisma ORM with PostgreSQL
- [x] NextAuth.js with Discord OAuth
- [x] Middleware for route protection

### ✅ UI Components
- [x] Button (with neon variant)
- [x] Card (with glass effect)
- [x] Avatar
- [x] Badge
- [x] Dropdown Menu
- [x] Toast notifications (Sonner)
- [x] Navbar with user menu

### ✅ Pages
- [x] Landing page
- [x] Sign in page
- [x] Dashboard
- [x] Tournaments listing
- [x] Teams listing

### ✅ Authentication
- [x] Discord OAuth integration
- [x] Session management
- [x] Protected routes
- [x] User roles (User, Team Captain, Moderator, Admin, Super Admin)

### ✅ Database Schema
- [x] User model
- [x] Team model
- [x] TeamMember model
- [x] Tournament model
- [x] Match model
- [x] Invitation model
- [x] AuditLog model
- [x] Notification model

## 🚧 Next Steps (To Be Implemented)

### High Priority
- [ ] Tournament creation form
- [ ] Team creation form
- [ ] Tournament bracket generation
- [ ] Match reporting system
- [ ] Team invitation system
- [ ] Admin dashboard

### Medium Priority
- [ ] User profile page
- [ ] Team detail pages
- [ ] Tournament detail pages
- [ ] Leaderboard system
- [ ] Search and filter functionality
- [ ] Real-time notifications

### Low Priority
- [ ] ELO ranking system
- [ ] Match history
- [ ] Player statistics
- [ ] Tournament templates
- [ ] Discord webhook integration
- [ ] Email notifications

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d coralmc_tournaments
```

### Prisma Issues

```bash
# Clear Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
```

### NextAuth Issues

- Ensure `NEXTAUTH_URL` matches your domain
- Verify Discord OAuth redirect URL is correct
- Check that `NEXTAUTH_SECRET` is set

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 🔒 Security Checklist

- [x] Environment variables properly configured
- [x] CSRF protection enabled (NextAuth)
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React)
- [x] Secure session management
- [ ] Rate limiting (to be implemented)
- [ ] Input validation with Zod (to be implemented)

## 📊 Database Migrations

### Create a new migration

```bash
npx prisma migrate dev --name description_of_changes
```

### Apply migrations in production

```bash
npx prisma migrate deploy
```

### Reset database (development only)

```bash
npx prisma migrate reset
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Docker

```bash
# Build
docker build -t coralmc-tournaments .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_URL="your-domain" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e DISCORD_CLIENT_ID="your-client-id" \
  -e DISCORD_CLIENT_SECRET="your-client-secret" \
  coralmc-tournaments
```

### Manual Deployment

```bash
npm run build
npm run start
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random secret key | `generated-secret-key` |
| `DISCORD_CLIENT_ID` | Discord OAuth Client ID | `123456789012345678` |
| `DISCORD_CLIENT_SECRET` | Discord OAuth Secret | `abc123def456` |

## 🎯 Testing

### Test Authentication
1. Start dev server
2. Click "Sign In"
3. Authorize with Discord
4. Check if redirected to dashboard

### Test Database
```bash
npx prisma studio
```

### Test Build
```bash
npm run build
npm run start
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Discord Developer Portal](https://discord.com/developers/docs)

## 🆘 Support

If you encounter issues:
1. Check this setup guide
2. Review error messages carefully
3. Check the main README.md
4. Search for similar issues online
5. Contact the development team

---

**Ready to compete? Start your tournament platform now!** 🏆
