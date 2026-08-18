# Technology Stack
**Repository:** `tannerusridhar18-pixel/HV2026-0075-POWERHOUSE`

---

## 1. Frontend & Visualization
| Component | Technology | Version / Spec |
| :--- | :--- | :--- |
| **Framework** | Next.js / React | 14+ (App Router) |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS + Radix UI / Shadcn | - |
| **State Management** | Zustand / TanStack Query | - |
| **Charts & Visuals** | Recharts / Apache ECharts | Real-time timeseries rendering |

---

## 2. Backend & Ingestion API
| Component | Technology | Details |
| :--- | :--- | :--- |
| **Primary Runtime** | Node.js / Python FastApi | REST & WebSocket server |
| **API Framework** | Express / FastAPI | Async high-throughput routing |
| **Authentication** | JWT / OAuth2 | Role-based token access |
| **Task Queue** | Celery / BullMQ + Redis | Background telemetry processing |

---

## 3. Database & Storage
| Layer | Engine | Purpose |
| :--- | :--- | :--- |
| **Relational DB** | PostgreSQL | Users, assets, alerts, configurations |
| **Timeseries DB** | TimescaleDB / InfluxDB | High-frequency telemetry streams |
| **Cache & Pub/Sub** | Redis | Session state, caching, live socket events |

---

## 4. Machine Learning & Analytics
| Component | Framework | Purpose |
| :--- | :--- | :--- |
| **Model Serving** | Python / ONNX Runtime | Anomaly detection & load forecasting |
| **Libraries** | Scikit-learn, Prophet, Pandas | Time-series forecasting & analysis |

---

## 5. DevOps & Infrastructure
| Tool | Purpose |
| :--- | :--- |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Prometheus & Grafana |