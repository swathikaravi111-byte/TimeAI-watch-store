#!/bin/bash

# ===========================
# Database Restore Script
# ===========================
# Restores PostgreSQL database from backup

set -e

# Configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-timeai_db}
DB_USER=${DB_USER:-postgres}

# Check if backup file is provided
if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file>"
  echo "Example: ./restore.sh backups/backup_timeai_db_20240101_120000.sql.gz"
  exit 1
fi

BACKUP_FILE=$1

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "🔄 Starting database restore..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"

# Ask for confirmation
read -p "⚠️  This will overwrite the database. Continue? (yes/no) " -n 3 -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "❌ Restore cancelled"
  exit 1
fi

# Drop existing database
echo "Dropping existing database..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

# Create new database
echo "Creating new database..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

# Restore from backup
echo "Restoring from backup..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip -c "$BACKUP_FILE" | pg_restore \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose
else
  pg_restore \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    "$BACKUP_FILE"
fi

echo "✅ Database restore completed successfully!"
