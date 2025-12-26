# FinanceTrackr - Personal Finance Tracker

A modern, responsive personal finance tracker built with Next.js, TypeScript, and Tailwind CSS. Track your expenses, manage budgets, set financial goals, and visualize your financial data with beautiful, interactive charts. Designed for Indian users with INR (₹) currency support and Indian number formatting.

## ✨ Features

### 🎯 Core Features
- **Dashboard Overview**: Real-time financial insights with interactive charts and statistics
- **Transaction Management**: Add, edit, and categorize income and expenses
- **Budget Tracking**: Create and monitor budgets with visual progress indicators
- **Financial Goals**: Set savings goals and track progress with animated progress rings
- **Analytics**: Comprehensive financial analytics with charts and trends

### 🎨 Design & UX
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first approach with perfect tablet and desktop layouts
- **Smooth Animations**: Framer Motion powered micro-interactions and page transitions
- **Modern UI**: Clean, minimalistic design with Tailwind CSS
- **Interactive Charts**: Beautiful data visualizations with Recharts

### 🚀 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Real-time Updates**: Firebase/Firestore integration for live data sync
- **PWA Ready**: Progressive Web App capabilities for mobile installation
- **SEO Optimized**: Next.js App Router with proper meta tags and structure
- **Performance**: Optimized loading with code splitting and lazy loading

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library for data visualization
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend & Database
- **Firebase/Firestore** - Real-time database
- **Firebase Auth** - Authentication with Google OAuth
- **Next.js API Routes** - Server-side functionality

### UI Components
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Headless UI** - Accessible UI components
- **DND Kit** - Drag and drop functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Firebase project (for backend functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/financetrackr.git
   cd financetrackr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Features Overview

### Dashboard
- Financial overview with key metrics
- Interactive expense breakdown charts
- Savings goals progress visualization
- Recent transactions list
- Quick action buttons

### Transactions
- Add income and expense transactions
- Categorize with predefined or custom categories
- Search and filter functionality
- Edit and delete transactions
- Real-time balance updates

### Budgets
- Create monthly, weekly, or yearly budgets
- Visual progress tracking with color-coded alerts
- Budget vs actual spending comparison
- Overspending notifications
- Category-based budget allocation

### Goals
- Set financial savings goals
- Track progress with animated progress rings
- Add money to goals with celebration animations
- Goal completion notifications
- Target date tracking with overdue alerts

### Analytics
- Income vs expenses trends
- Spending patterns analysis
- Category-wise expense breakdown
- Financial health score
- Monthly/yearly comparisons

## 🎨 Design System

### Colors
- **Primary**: Blue (`hsl(221, 83%, 53%)`)
- **Success**: Green (`hsl(142, 76%, 36%)`)
- **Warning**: Orange (`hsl(38, 92%, 50%)`)
- **Danger**: Red (`hsl(0, 84%, 60%)`)
- **Income**: Green variants
- **Expense**: Red variants

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Semibold weights
- **Body**: Regular weight
- **Captions**: Muted foreground color

### Animations
- **Page Transitions**: Smooth fade and slide effects
- **Micro-interactions**: Hover states and button feedback
- **Loading States**: Skeleton screens and spinners
- **Success States**: Celebration animations for goal completion

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics page
│   ├── budgets/           # Budget management
│   ├── goals/             # Financial goals
│   ├── transactions/      # Transaction management
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/            # React components
│   ├── budgets/          # Budget-related components
│   ├── charts/           # Chart components
│   ├── dashboard/        # Dashboard components
│   ├── goals/            # Goal components
│   ├── transactions/     # Transaction components
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── constants/        # App constants
│   └── services/         # API services
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color palette for finance themes
- Dark mode support
- Custom animations and transitions
- Responsive breakpoints

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database
3. Enable Authentication with Google provider
4. Add your domain to authorized domains
5. Copy configuration to environment variables

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Recharts](https://recharts.org/) for beautiful charts
- [Lucide](https://lucide.dev/) for the icon library
- [Firebase](https://firebase.google.com/) for backend services

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

Made with ❤️ by the FinanceTrackr Team
