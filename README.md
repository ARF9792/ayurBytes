# AyurBytes: Ayurvedic Diet Planner (Proof of Concept)

![AyurBytes App Screenshot](./public/images/1.png)

## 🚀 Live Demo
🔗 [Click here to visit AyurPOC](https://ayurpoc.vercel.app/)

## 🌟 Introduction

`ayurBytes` is a Proof of Concept (POC) for an Ayurvedic Diet Management Software. This initial application demonstrates the core functionality of generating a personalized Ayurvedic diet plan based on a user's `Prakriti` (body constitution), age, and other basic health parameters.

The goal of this POC is to showcase the feasibility and potential of integrating ancient Ayurvedic wisdom with modern technology to provide personalized dietary recommendations.

## ✨ Features (Current POC)

* **Comprehensive Patient Management:** Detailed health profiling with 11+ parameters including:
  - Physical measurements (Height, Weight, Auto-calculated BMI)
  - Medical conditions and allergies tracking
  - Dietary habits and meal frequency
  - Lifestyle factors (Activity level, sleep, stress)
  - Ayurvedic assessment (Bowel movements, digestion quality)
  - Patient data persistence (localStorage)

* **Advanced Nutritional Analysis:** Scientific calculations including:
  - Daily caloric requirements (Mifflin-St Jeor Equation)
  - Macro nutrients tracking (Protein, Carbs, Fats, Fiber)
  - Micro nutrients structure (Vitamins, Minerals)
  - Progress tracking with visual indicators
  - Percentage of daily requirements met

* **Ayurvedic Intelligence:**
  - Prakriti-Based Diet Generation (Vata, Pitta, Kapha)
  - Six Tastes (Rasa) balance visualization
  - Personalized Ayurvedic guidelines based on health profile
  - Meal timing recommendations aligned with digestive fire (Agni)

* **Age-Group Customization:** Diet plans adapted for different age groups (Child, Adult, Elderly)

* **Multilingual Support:** Available in 7 Indian languages:
  - English, Hindi, Bengali, Telugu, Marathi, Tamil, Sanskrit

* **Dual Form System:**
  - Quick Form: Basic prakriti assessment
  - Comprehensive Assessment: Full patient profiling

* **Modern UI:** Built with Next.js 15, TypeScript, and Tailwind CSS for a responsive and aesthetically pleasing experience

## 🚀 Technologies Used

This POC leverages a modern web development stack:

* **Frontend:**
    * [**Next.js**](https://nextjs.org/) (React Framework)
    * [**TypeScript**](https://www.typescriptlang.org/)
    * [**Tailwind CSS**](https://tailwindcss.com/)
    * [**Lucide React**](https://lucide.dev/) (for icons)
* **Backend:**
    * [**Next.js API Routes**](https://nextjs.org/docs/api-routes/introduction) (for serverless API endpoints)
* **Data:**
    * `foods.json` (Local JSON file serving as a mock database for Ayurvedic food properties)

## 💡 How it Works (Core Logic)

1.  **Patient Data Input:** The user provides their age, gender, and selected Prakriti through the frontend form.
2.  **API Call:** This data is sent to a Next.js API route.
3.  **Food Filtering:** The API filters the `foods.json` database based on:
    * **Prakriti Compatibility:** Foods are selected or excluded based on their `Virya` (potency) and `Guna` (qualities) to balance the chosen Prakriti.
    * **Age Suitability:** Further refinement ensures foods are appropriate for the specified age group (e.g., easier-to-digest foods for children/elderly).
4.  **Meal Assembly:** A simple algorithm then attempts to select diverse foods for Breakfast, Lunch, and Dinner from the filtered list.
5.  **Diet Plan Display:** The generated diet plan is returned to the frontend and displayed to the user.

## ⚙️ Getting Started

Follow these steps to set up and run the `ayurBytes` POC locally on your machine.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ARF9792/ayurBytes.git
    cd ayurBytes
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

1.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  **Open in browser:**
    Navigate to `http://localhost:3000` in your web browser.
