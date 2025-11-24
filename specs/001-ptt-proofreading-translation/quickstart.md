# Quickstart Guide

**Feature**: PTT Post Proofreading and Translation
**Date**: 2025-11-15

This guide provides instructions for setting up and running the project using Docker.

---

## Prerequisites

- Docker
- Docker Compose

---

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Configure Environment Variables**:
    - Create a `.env` file in the `backend/` directory.
    - Add the API key for the chosen generative AI service:
      ```
      GEMINI_API_KEY=your_api_key_here
      ```

---

## Running the Application

1.  **Build and Run the Containers**:
    ```bash
    docker-compose up --build
    ```
    This command will build the images for the frontend and backend services and start the containers.

2.  **Access the Application**:
    - The frontend application will be available at `http://localhost:3000`.
    - The backend API will be running on `http://localhost:3001`.

---

## Testing the Feature

1.  **Open the application** in your browser at `http://localhost:3000`.
2.  **Find a PTT post URL**, for example, from the "Gossiping" board.
3.  **Paste the URL** into the input field on the web page and click the "Analyze" button.
4.  **Verify the output**:
    - The left panel should display the original content of the PTT post.
    - The right panel should display the translated, more formal version of the text.
    - The annotations panel should list any identified issues (slang, informalities, etc.).
    - Clicking on an annotation should highlight the corresponding text in both the original and translated views.

---

## Stopping the Application

- To stop the containers, press `Ctrl+C` in the terminal where `docker-compose` is running, or run:
  ```bash
  docker-compose down
  ```
