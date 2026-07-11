# 🏆 CoralMC Tournaments

A premium, production-ready esports tournament management platform built with Next.js 14, TypeScript, and modern web technologies.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)

## ✨ Features

### 🔐 Authentication
- Discord OAuth integration with NextAuth.js
- Secure session management
- Role-based access control (User, Team Captain, Moderator, Admin, Super Admin)
- Protected routes with middleware

### 🎮 Tournament System
- Multiple bracket formats:
  - Single Elimination
  - Double Elimination
  - Round Robin
- Automatic bracket generation
- Tournament status tracking (Upcoming, Live, Finished)
- Match scheduling and reporting
- Live score updates
- Team check-in system

### 👥 Team Management
- Create and manage teams
- Shareable invite links
- Public/private team visibility
- Team logo uploads
- Team statistics dashboard
- Role-based team permissions

### 🎯 Advanced Features
- ELO ranking system
- Real-time notifications
- Player statistics and analytics
- Match history tracking
- Leaderboards
- Search and filter system

### 🛡️ Admin Dashboard
- Complete tournament management
- User moderation tools
- Team oversight
- Ban system
- Match editing capabilities
- Analytics and statistics
- Audit logs
- Granular permissions system

### 🎨 UI/UX
- Dark futuristic gaming aesthetic
- Glassmorphism effects
- Neon accents and gradients
- Smooth animations with Framer Motion
- Fully responsive design
- Mobile-first approach
- Loading skeletons
- Toast notifications

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with Discord OAuth
- **UI Components:** shadcn/ui + Radix UI
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod validation
- **Notifications:** Sonner

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Discord OAuth application

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd "CoralMC Tournaments"
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure environment variables**

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coralmc_tournaments"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Discord OAuth
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

4. **Set up Discord OAuth**

- Go to [Discord Developer Portal](https://discord.com/developers/applications)
- Create a new application
- Add OAuth2 redirect URL: `http://localhost:3000/api/auth/callback/discord`
- Copy Client ID and Client Secret to `.env`

5. **Initialize the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

6. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗂️ Project Structure

```
CoralMC Tournaments/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── admin/            # Admin panel
│   │   ├── tournaments/      # Tournament pages
│   │   ├── teams/            # Team pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── navbar.tsx       # Navigation
│   ├── lib/                  # Utilities
│   │   ├── auth.ts          # NextAuth config
│   │   ├── prisma.ts        # Prisma client
│   │   └── utils.ts         # Helper functions
│   ├── types/               # TypeScript types
│   └── middleware.ts        # Route protection
├── .env.example             # Environment template
├── next.config.mjs          # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev  # Run migrations
npx prisma generate  # Generate Prisma Client

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `NEXTAUTH_SECRET` | NextAuth secret key | ✅ |
| `DISCORD_CLIENT_ID` | Discord OAuth Client ID | ✅ |
| `DISCORD_CLIENT_SECRET` | Discord OAuth Secret | ✅ |

## 📊 Database Schema

The platform uses Prisma with PostgreSQL. Key models include:

- **User** - User accounts with Discord integration
- **Team** - Team information and settings
- **TeamMember** - Team membership with roles
- **Tournament** - Tournament configuration
- **Match** - Individual matches
- **Invitation** - Team invite system
- **AuditLog** - Admin action tracking
- **Notification** - User notifications

## 🎨 Design System

### Colors
- **Primary:** Neon Blue (#00D9FF)
- **Secondary:** Neon Purple (#B026FF)
- **Accent:** Neon Pink (#FF006B)
- **Background:** Dark (#0A0A0F)

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, gradient text effects
- **Body:** Regular weight, high contrast

### Components
All UI components follow the shadcn/ui design system with custom gaming-themed modifications.

## 🔒 Security Features

- CSRF protection
- SQL injection prevention (Prisma)
- XSS protection
- Secure session management
- Rate limiting ready
- Input validation with Zod
- Role-based access control

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
# Build image
docker build -t coralmc-tournaments .

# Run container
docker run -p 3000:3000 coralmc-tournaments
```

### Manual Deployment

```bash
npm run build
npm run start
```

## 📝 API Routes

- `POST /api/auth/[...nextauth]` - Authentication
- `GET /api/tournaments` - List tournaments
- `POST /api/tournaments` - Create tournament
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team
- `POST /api/teams/[id]/invite` - Generate invite

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🎯 Roadmap

- [ ] Real-time match updates with WebSockets
- [ ] Mobile app (React Native)
- [ ] Tournament streaming integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Tournament templates
- [ ] Automated tournament scheduling
- [ ] Prize pool management
- [ ] Sponsor integration
- [ ] Public API with rate limiting

## 👏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Vercel for hosting solutions
- Discord for OAuth integration

---

Built with ❤️ for the CoralMC community
