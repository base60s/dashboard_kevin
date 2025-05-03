# Real Estate Dashboard - Edificio Corporativo Zenith

This project is a web-based dashboard designed to monitor the progress and key metrics of the "Edificio Corporativo Zenith" real estate project.

## Features

*   **Main Dashboard:** Provides a summary view of key project indicators (KPIs) like overall progress, units sold, etc.
*   **KPIs Section:** Displays Key Performance Indicators related to project progress, sales, budget, etc.
*   **Imágenes de Progreso:** Shows a gallery of progress images related to construction areas (Foundation, Structure, Facade, Interior).
*   **Unidades Section:** Lists and details the different units (offices, commercial spaces) within the building, including their status (Available, Sold, Reserved).
*   **Panel de Administración (`/administracion`):** A dedicated section (accessible via the footer link or direct URL) for managing the data displayed in the other sections:
    *   General project settings (Name, Address)
    *   KPI configuration
    *   Image management (upload, edit, delete - *Note: Upload currently managed here*)
    *   Unit management (add, edit, delete unit details)

## Technologies Used

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui (built on Radix UI)
*   **State Management:** Zustand
*   **Charting:** Recharts
*   **Package Manager:** pnpm

## Prerequisites

*   Node.js (LTS version recommended)
*   pnpm (You can install it via `npm install -g pnpm` if you don't have it)

## Installation

1.  **Clone the repository (Optional):**
    ```bash
    git clone <repository-url>
    cd real-estate-dashboard
    ```
2.  **Install dependencies:** Navigate to the project's root directory (`real-estate-dashboard`) in your terminal and run:
    ```bash
    pnpm install
    ```
    This command reads the `package.json` and `pnpm-lock.yaml` files to install all necessary libraries and tools.

## Running Locally

1.  **Start the development server:**
    ```bash
    pnpm dev
    ```
2.  **Open the application:** Open your web browser and navigate to `http://localhost:3000` (or the address shown in your terminal).

## Accessing the Admin Panel

The administration section, where you can update project data, is accessible by:

1.  Clicking the "Administración" link in the footer of the application.
2.  Navigating directly to `http://localhost:3000/administracion`.

There is no login required for the admin panel in the current setup. 