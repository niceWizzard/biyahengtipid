# 🚐 Biyaheng Tipid

> A travel cost optimizer app that helps travelers plan their trips efficiently and within budget. Visit [Biyaheng Tipid](https://biyahengtipid.vercel.app)

## 🌟 Overview

**Biyaheng Tipid** (meaning "Budget Trip") is designed to help users calculate the most cost-effective travel routes. It provides detailed distance calculations, realistic time estimates, and route optimization to simplify your journey and minimize costs.

### ⚙️ Under the Hood

The application utilizes reliable routing engines to deliver accurate estimates:
- **[OpenRouteService API](https://openrouteservice.org/)**: Powers the robust routing calculations.
- **[OSRM (Open Source Routing Machine)](https://project-osrm.org/)**: The high-performance backend routing engine for rapid travel time and distance computations.

## ✨ Key Features

- 🗺️ **Distance Calculation**: Accurately measures the distance between your starting point and destination.
- ⏱️ **Time Estimation**: Provides realistic travel time estimates based on trusted routing data.
- 💰 **Cost Minimization**: Helps you identify travel routes that minimize overall transportation costs.
- 🚦 **Route Optimization**: Seamlessly maps out the most efficient path for your journey.

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with `create-next-app` and configured to run with `bun`.

First, make sure to install dependencies (if you haven't already):
```bash
bun install
```

Then, run the development server:
```bash
bun dev
```

*(Alternatively, you can use `npm run dev`, `yarn dev`, or `pnpm dev`)*

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript
- **Package Manager**: [Bun](https://bun.sh/)
- **Routing API**: OpenRouteService / OSRM