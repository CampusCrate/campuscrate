# ── Backend Dockerfile ───────────────────────────────────────────────────────
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps needed by psycopg2-binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Collect static files at build time.
# We provide a dummy SECRET_KEY so Django can initialise without a real .env,
# and set DJANGO_DEBUG=False so WhiteNoise's ManifestStaticFilesStorage works.
# No DB connection is needed for collectstatic.
RUN DJANGO_SECRET_KEY=build-time-dummy \
    DJANGO_DEBUG=False \
    DB_HOST=localhost \
    python manage.py collectstatic --noinput --skip-checks

EXPOSE 8000

# ── Entrypoint ───────────────────────────────────────────────────────────────
# Run DB migrations first (idempotent), then start Gunicorn.
# This ensures the schema is always up-to-date on every deploy.
CMD ["sh", "-c", "python manage.py migrate --noinput && \
     gunicorn marketplace.wsgi:application \
     --bind 0.0.0.0:8000 \
     --workers 4 \
     --timeout 120"]
