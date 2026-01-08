# Deploying PredictAll to Google Cloud Run

This project is configured for containerization using Docker and Nginx, making it ready for Google Cloud Run.

## Prerequisites

1. **Google Cloud SDK (`gcloud`)** installed and authenticated.
2. **Docker** installed and running locally (if you want to build locally).
3. A **Google Cloud Project** with billing enabled.

## Deployment Steps

### Method 1: Direct Source Deploy (Easiest)

Google Cloud Run can build your Dockerfile automatically without needing Docker locally.

1. **Authenticate**
   ```bash
   gcloud auth login
   gcloud config set project [YOUR_PROJECT_ID]
   ```

2. **Deploy**
   Run this command from the project root (`/Users/shaun/AI/predictall`):
   ```bash
   gcloud run deploy predictall --source=.
   ```

3. **Prompts**
   - **Region**: Choose a region near you (e.g., `us-central1`).
   - **Allow unauthenticated invocations?**: Choose **y (Yes)** to make it a public website.

4. **Done!**
   Cloud Run will build the container, push it to Artifact Registry, and deploy it. You'll get a URL like `https://predictall-xyz-uc.a.run.app`.

---

### Method 2: Manual Build & Push (Advanced)

If you prefer to build the image yourself:

1. **Enable Artifact Registry API**
   ```bash
   gcloud services enable artifactregistry.googleapis.com run.googleapis.com
   ```

2. **Build Image (using Cloud Build)**
   ```bash
   gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/predictall
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy predictall \
     --image gcr.io/[YOUR_PROJECT_ID]/predictall \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## Configuration Details

- **Port**: The application serves on port `8080` (Cloud Run default) via Nginx.
- **Routing**: `nginx.conf` handles Single Page Application (SPA) routing, creating a fallback to `index.html` for client-side routes.
