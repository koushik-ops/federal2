# PulseKin: AI-Powered Healthcare Platform

PulseKin is a premium, privacy-preserving, and federated AI healthcare platform designed to connect patients, doctors, and system administrators through a seamless, state-of-the-art interface. Built on Next.js 16 with Tailwind CSS, PulseKin features rich glassmorphism layouts, dynamic audio-synthesized notifications, real-time simulated AI diagnostics, and robust dashboard portals.

---

## 🚀 Key Features

### 1. Interactive Landing Page
* **Visual Experience**: Autoplaying background video overlays combined with smooth text animations highlighting the core philosophy: `YOU. MATTER.`
* **Aesthetic Fallbacks**: Automatic, low-opacity rotating DNA helix graphics (`/download.jpeg`) that ensure premium visual continuity during buffering or asset load delays.
* **Role Selection**: Easy, direct navigation gates for **Patient**, **Doctor**, and **Admin** portals.

### 2. Patient Dashboard
* **AI Chat Assistant**: An interactive chat terminal to consult with virtual medical specialists.
* **Health Prediction & Reports**: Upload and review diagnostic medical records.
* **Specialist Directory**: Browse available doctors, specialties, and schedule visits.
* **Prescriptions Tracking**: View active medication routines, dosages, and refill history.
* **Dynamic Profiles**: Light-theme toggle support across patient profile dashboards.

### 3. Doctor Dashboard
* **Case Management**: Priority-coded case views detailing patient vitals, diagnosis predictions, and AI feature explainability (SHAP).
* **Telehealth Consultations**: Schedule and launch simulated face-to-face video calls.
* **Interactive Profiles**: Comprehensive profiles highlighting experience metrics, clinical affiliations, active board certifications, and research focuses.
* **Brand Harmonization**: Unified brand aesthetic utilizing the custom gradient SVG heartbeat pulse logo.

### 4. Dynamic Notification & Web Audio Chime System
* **Real-time Simulation**: Built-in 10-second client-side simulator that showcases new patient events and alerts.
* **Interactive Controls**: Dropdown panels allowing single-click dismissal, mark-as-read toggles, and "Mark all as read" controls.
* **Synthesized Audio Chime**: Uses the browser's native **Web Audio API** to dynamically synthesize a warm, dual-frequency audio alert (frequency ramp from D5 to A5) whenever a new notification lands—eliminating dependency on heavy audio asset files.

### 5. Premium Styling & Design Tokens
* **Glassmorphism**: Border treatments with translucent white overlays and high-radius blurs (`backdrop-blur-2xl`).
* **Sleek Dark Mode**: Tailored dark backgrounds matching deep purple/indigo gradients for doctors and pink/rose gradients for patients.
* **Shine Animations**: Dynamic hover styling including button shine highlights (`.shine-button`) and rotating DNA nodes.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16.2.6 (using React 19 and Turbopack)
* **Styling**: Tailwind CSS 4.2.0 (configured with PostCSS)
* **Icons**: Lucide React
* **State & Context**: React Context APIs for unified user role sessions and notification states
* **Language**: TypeScript

---

## 💻 Getting Started

### Prerequisites

Make sure you have Node.js (version 18 or above) installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/koushik-ops/pulsekin.git
   cd pulsekin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📦 Build & Deployment

To generate an optimized production bundle:

```bash
npm run build
```

The built pages will be generated inside the `.next` directory and can be launched locally using:

```bash
npm run start
```
