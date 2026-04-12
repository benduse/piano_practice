#!/bin/bash

# update-and-commit.sh
# Checks main for updates, then helps you stage + commit changes

set -e # Exit if any command fails

echo "=== Git Update & Commit Helper ==="

# 1. Make sure we're in a git repo
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Error: Not inside a git repository."
  exit 1
fi
echo "✓ Git repository detected"

# 2. Switch to main and check for remote updates
echo "Fetching latest from origin..."
git fetch origin

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH"!= "main" ]; then
  echo "Switching to main branch..."
  git checkout main
fi

# 3. Check if local main is behind remote
LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL"!= "$REMOTE" ]; then
  echo "⚠️ Your main branch is behind origin/main."
  echo "Pulling latest changes..."
  git pull origin main
else
  echo "✓ main branch is up to date with origin/main"
fi

# 4. Show current status
echo ""
echo "=== Git Status ==="
git status

# 5. Check if there are changes to commit
if git diff-index --quiet HEAD --; then
  echo "✓ No changes to commit. Working tree clean."
  exit 0
fi

# 6. Ask to stage changes
echo ""
read -p "Do you want to stage all changes? [y/N]: " STAGE
if [[ "$STAGE" =~ ^[Yy]$ ]]; then
  git add .
  echo "✓ Staged all changes"
  git status --short
else
  echo "Skipping git add. You can manually stage files and rerun."
  exit 0
fi

# 7. Get commit message from user
echo ""
read -p "Enter commit message: " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
  echo "Error: Commit message cannot be empty."
  exit 1
fi

# 8. Commit
git commit -m "$COMMIT_MSG"
echo "✓ Committed successfully"

# 9. Ask to push
echo ""
read -p "Push to origin/main now? [y/N]: " PUSH
if [[ "$PUSH" =~ ^[Yy]$ ]]; then
  git push origin main
  echo "✓ Pushed to origin/main"
else
  echo "Skipped push. Run 'git push origin main' when ready."
fi

echo ""
echo "=== Push complete! Happy Coding! ==="
