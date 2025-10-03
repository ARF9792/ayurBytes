graph TD
    subgraph "User & Client Layer"
        direction LR
        Users[("Ayurvedic Dietitian<br/>Patient")] --> WebApp["Web/Mobile App<br/>(React.js, React Native)<br/>6. Data Display"]
    end

    subgraph "Application Layer"
        direction TB
        WebApp -->|"1. API Request (HTTPS/REST)"| APIServer["API Server<br/>(NestJS on Node.js)<br/>3. Backend Processing"]
        APIServer --> CoreServices["Core Services<br/>- Patient Management<br/>- Diet Generation<br/>- Nutrient Analysis<br/>- Recipe Management"]
        APIServer -->|"5. API Response (JSON)"| WebApp
    end

    subgraph "Data Layer"
        direction TB
        CoreServices -->|"4. Database Query"| Databases["Databases<br/>(PostgreSQL, MongoDB, Supabase)"]
        Databases --> FoodData[("Food Database<br/>(8,000+ items)")]
        Databases --> PatientData[("Patient Profiles")]
    end

    subgraph "AI/ML Layer (Future)"
        direction TB
        CoreServices -.-> MLService["AI/ML Service<br/>(Python, scikit-learn)"]
        MLService --> AutomatedDiet["Automated Diet Plans"]
    end

    subgraph "Infrastructure & Deployment"
        direction LR
        APIServer -- Deployed on --> Docker["Docker"]
        WebApp -- Deployed on --> Docker
        Docker -- Managed by --> Cloud["AWS/Azure"]
        Docker -- Served by --> Nginx["Nginx"]
        Cloud -- CI/CD --> GitHub["GitHub"]
    end
    
    subgraph "External Integrations"
        APIServer <--> HIS_EHR[("HIS / EHR Systems")]
    end

    %% Modern Color Scheme
    classDef default fill:#1e293b,stroke:#475569,stroke-width:3px,color:#f8fafc,font-size:16px;
    classDef userclient fill:#06b6d4,stroke:#0369a1,stroke-width:4px,color:#ffffff,font-size:18px;
    classDef app fill:#3b82f6,stroke:#1e40af,stroke-width:4px,color:#ffffff,font-size:18px;
    classDef data fill:#8b5cf6,stroke:#6d28d9,stroke-width:4px,color:#ffffff,font-size:18px;
    classDef ml fill:#f59e0b,stroke:#b45309,stroke-width:4px,color:#ffffff,font-size:18px;
    classDef infra fill:#10b981,stroke:#047857,stroke-width:4px,color:#ffffff,font-size:18px;
    classDef external fill:#6b7280,stroke:#374151,stroke-width:4px,color:#ffffff,font-size:18px;

    class Users,WebApp userclient;
    class APIServer,CoreServices app;
    class Databases,FoodData,PatientData data;
    class MLService,AutomatedDiet ml;
    class Docker,Cloud,Nginx,GitHub infra;
    class HIS_EHR external;