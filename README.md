# IOTA Water Tracker

A simple hydration tracking application that stores daily water intake logs on **IOTA EVM Testnet** and uses **Google Gemini AI** to provide smart health suggestions based on the user’s drinking habits.

![banner](./screenshot.png) <!-- optional image -->

---

## 🚀 Features
- Track daily water intake
- Persist logs on IOTA-EVM using on-chain transactions
- Health insights powered by Gemini AI
- Daily statistics & charts with Recharts
- Modern frontend stack (React 19 + Vite + TypeScript)

---

## 🧩 Tech Stack

| Component | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Blockchain | IOTA-EVM Testnet |
| Wallet | TanglePay / MetaMask |
| AI | Google Gemini |
| Language | TypeScript |

---

## 🔗 Wallet Support (Important)

This app **does NOT connect directly to IOTA Desktop / Firefly**, because Firefly does not expose a Web3/EVM provider.

Supported wallets:
- ✔ TanglePay Browser Extension (recommended)
- ✔ MetaMask

Not supported:
- ✘ IOTA Desktop / Firefly  
(no injected Web3 provider)

---

## 🛠 Installation

```bash
npm install
npm run dev
