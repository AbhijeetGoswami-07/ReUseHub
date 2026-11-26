# 🌱 ReUseHub — Circular Economy & Zero-Waste Upcycling Platform

> **Accelerating the circular economy by identifying sustainable alternatives for unwanted items, connecting local communities, and calculating real-world ecological impact.**

---

## 🚀 Overview

**ReUseHub** is an environmental studies web platform that bridges product material diagnostics, AI recommendation engines, circular exchange marketplaces, and interactive visual DIY repair/upcycling blueprints. It empowers everyday consumers, students, makers, and businesses to keep physical materials alive and divert waste from landfills.

---

## ✨ Key Features

### 1. 🔍 AI Product Diagnostics & Recommendation Engine
- **Material Analysis**: Input any household item, textile, container, or electronic device.
- **Categorization & Condition Evaluation**: Dynamic material filtering (Cotton, Glass, Polymers, Timber, Electronic Components / PCBs).
- **Five Pathways to Prevent Waste**:
  1. **Reuse**: Direct repurposing without alteration.
  2. **Repair**: Restoring damaged goods to service.
  3. **Upcycle**: Transforming discarded materials into higher utility.
  4. **Donate**: Passing functional items to local non-profits or community members.
  5. **Recycle**: Verified municipal and specialized material reclamation.

### 2. 📐 Visual Step-by-Step DIY Blueprints
- **Custom 2D Technical Vector Diagrams**: Every single step of every project is illustrated with high-fidelity, responsive SVG technical diagrams.
- **Visual Guides**: Action callouts, cut lines, fold lines, seam indicators, drill pilot marks, and safety warnings.
- **Craft Projects Included**:
  - *Old Jeans to Heavy-Duty Reinforced Denim Market Tote* (5 illustrated steps)
  - *Glass Jars to Airtight Bulk Food Pantry Canisters* (5 illustrated steps)
  - *Plastic Bottles to Capillary Self-Watering Planters* (5 illustrated steps)
  - *Corrugated Cardboard to Modular Desk Drawer Organizer* (4 illustrated steps)
  - *Reclaimed Wooden Pallet to Outdoor Lounge Furniture* (5 illustrated steps)
  - *Worn Cotton T-Shirt to Macramé Hanging Plant Basket* (4 illustrated steps)
  - *Rusty Cast Iron Skillet to Mirror-Patina Seasoned Cookware* (4 illustrated steps)
  - *Steel Tin Cans to Rustic Leather-Handle Craft Caddy* (4 illustrated steps)
  - *HDPE Milk & Detergent Jugs to Indestructible Garden Scoops* (3 illustrated steps)

### 3. 🛒 Second-Hand Circular Marketplace
- Zero-waste free and affordable listings.
- Community exchange for offcuts, raw materials, tools, and refurbished items.
- In-app inquiry messaging between circular makers.

### 4. 👥 Community Maker Network
- Post verified upcycling stories, project blueprints, and material lists.
- Interactive likes, bookmarks, and maker discussions.

### 5. 📊 EcoScore & Verified LCA Impact Tracking
- Personal zero-waste dashboard.
- Verified carbon avoidance calculations ($\text{kg CO}_2\text{e}$ prevented).
- Landfill mass diverted ($\text{kg}$ diverted) and community milestone badges.

### 6. 🛡️ Administrative Governance & Moderation
- Real-time moderation for community blueprints, marketplace listings, and user reports.
- Immutable administrative audit logs.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Circular Design System tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations**: Custom Tailwind transitions, BlurText, ShinyText, CountUp
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Storage Buckets, Auth) + Instant Offline Interactive Demo Fallback

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AbhijeetGoswami-07/ReUseHub.git
   cd ReUseHub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: ReUseHub runs out-of-the-box in **Interactive Demonstration Mode** if Supabase keys are omitted, with complete local state and full UI functionality.*

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Run Quick One-Click Startup (Windows)**:
   Double-click `run.bat` or `start.bat`.

---

## 🧪 Build & Verification

To verify TypeScript types and create an optimized production bundle:
```bash
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
