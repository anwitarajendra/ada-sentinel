# Swiftlane 

> Smart Delivery Intelligence Platform

Swiftlane is a proactive last-mile delivery failure prevention engine. It predicts delivery failures before they happen using real-time signals — weather, traffic, and customer history — and autonomously resolves them via WhatsApp with zero dispatcher intervention.

## The Problem

Last-mile delivery accounts for 53% of total logistics costs. Every failed delivery attempt costs ₹80–200 in re-delivery fees. Current systems are reactive — they log failures after they happen. Swiftlane fixes this.

## How It Works

1. Every delivery gets a **Failure Risk Score (0–100%)** calculated from live weather, traffic, and customer data
2. If the score crosses 75%, an automated WhatsApp message is sent to the customer
3. The customer's reply is parsed by AI — driver instructions update instantly
4. Dispatchers monitor all deliveries on a live risk heatmap in real time

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + Tailwind CSS + Mapbox GL |
| Backend | Node.js + Express |
| ML Service | Python + FastAPI + scikit-learn |
| AI / NLP | OpenAI API + LangChain |
| Messaging | Twilio (WhatsApp Business API) |
| Database | PostgreSQL + Redis |
| Infrastructure | Docker + GitHub Actions |

## Project Structure
swiftlane/
├── frontend/     # Next.js dispatcher dashboard
├── backend/      # Node.js orchestrator + REST APIs
└── ml/           # Python risk scoring microservice

## Features

- **Risk Brain** — ML model scoring every delivery for failure probability
- **Autonomous Triage** — AI-powered WhatsApp conversation flow triggered automatically
- **Live Dashboard** — Mapbox heatmap with real-time delivery status and risk indicators
- **Proof of Presence** — GPS geofencing + timestamped photo before marking delivered

## Getting Started

Setup instructions per service coming soon.
Each service runs independently — see individual folders for details.