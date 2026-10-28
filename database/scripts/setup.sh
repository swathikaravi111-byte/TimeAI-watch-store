#!/bin/bash

# ===========================
# Database Setup Script
# ===========================
# Sets up PostgreSQL database from scratch

set -e

# Configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-timeai_db}
DB_USER=${DB_USER:-timeai_user}
DB_PASSWORD=${DB_PASSWORD:-timeai_password}

echo "🚀 Setting up TimeAI Watch Store Database"
echo "=========================================="
echo "Host: $DB_HOST:$DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
  echo "❌ Error: PostgreSQL is not installed or not in PATH"
  exit 1
fi

# Connect to postgres (default) database
PSQL_CMD="psql -h $DB_HOST -p $DB_PORT -U postgres -d postgres"

# Check connection
echo "🔌 Testing database connection..."
if ! $PSQL_CMD -c "SELECT 1" > /dev/null 2>&1; then
  echo "❌ Error: Cannot connect to PostgreSQL"
  echo "Make sure PostgreSQL is running and accessible"
  exit 1
fi

echo "✅ Connected to PostgreSQL"

# Create database user
echo "👤 Creating database user..."
$PSQL_CMD -c "DROP USER IF EXISTS $DB_USER;" || true
$PSQL_CMD -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
echo "✅ User created"

# Create database
echo "📦 Creating database..."
$PSQL_CMD -c "DROP DATABASE IF EXISTS $DB_NAME;"
$PSQL_CMD -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
echo "✅ Database created"

# Grant privileges
echo "🔐 Setting up privileges..."
$PSQL_CMD -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
$PSQL_CMD -d "$DB_NAME" -c "GRANT SCHEMA public TO $DB_USER;"
$PSQL_CMD -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
$PSQL_CMD -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"
echo "✅ Privileges granted"

# Run migrations
echo "📝 Running migrations..."
MIGRATION_FILE="./database/migrations/001_create_initial_schema.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Error: Migration file not found: $MIGRATION_FILE"
  exit 1
fi

PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_FILE"
echo "✅ Migrations completed"

echo ""
echo "✨ Database setup completed successfully!"
echo "=========================================="
echo ""
echo "Connection string:"
echo "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "Next steps:"
echo "1. Update .env with the connection string"
echo "2. Run: npm run db:seed (to seed sample data)"
echo "3. Start your application"
