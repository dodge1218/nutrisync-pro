#!/bin/bash
# Cleanup Script - Remove Old Status Files
# Run this from the project root: bash cleanup-old-files.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 NutriWell Codebase Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count files before
BEFORE=$(ls -1 *.md 2>/dev/null | wc -l)

echo "📋 Removing old status and completion documentation files..."
echo ""

# Remove old status/completion files
rm -fv AUTH-FIX-SUMMARY.md \
      CLOUD-SYNC-GUIDE.md \
      COMPLETION-SUMMARY.md \
      CURRENT-PHASE-STATUS.md \
      ENV-CONFIG-COMPLETE.md \
      ENV-SETUP-COMPLETE.md \
      ENV-SETUP-STATUS.md \
      GET-SUPABASE-KEY.md \
      IMPLEMENTATION-COMPLETE.md \
      IMPLEMENTATION-STATUS.md \
      NET-CALORIES-AND-CLOUD-SYNC-COMPLETE.md \
      NEXT-PHASE-TODOS.md \
      NEXT-STEPS.md \
      PHASE-7J-7K-7L-FINAL-STATUS.md \
      PHASE-7J-7K-COMPLETION.md \
      PHASE-7K-SUMMARY.md \
      PHASE-8-COMPLETION-FINAL.md \
      PHASE-8CDE-SUMMARY.md \
      PHASE-9-COMPLETION.md \
      PRD-COMPLETION-STATUS.md \
      PRD-UPDATE-COMPLETION.md \
      PRODUCTION-READY-SUMMARY.md \
      PRODUCTION-READY.md \
      PROJECT-SUMMARY.md \
      QUICK-FIX-AUTH.md \
      TASK-COMPLETION-SUMMARY.md \
      USER-TODO-AUTH-SUMMARY.md

# Count files after
AFTER=$(ls -1 *.md 2>/dev/null | wc -l)
DELETED=$((BEFORE - AFTER))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   • Removed: $DELETED old documentation files"
echo "   • Kept: All important documentation"
echo ""
echo "📁 Important files preserved:"
echo "   ✓ README.md (project overview)"
echo "   ✓ PRD.md (product requirements)"
echo "   ✓ SECURITY.md (security policy)"
echo "   ✓ USER-TODO-DEPLOYMENT.md (deployment guide)"
echo "   ✓ USER-TODO-SUPABASE-SETUP.md (setup guide)"
echo "   ✓ CODE-ORGANIZATION.md (code structure guide)"
echo "   ✓ CLEANUP-COMPLETE.md (cleanup summary)"
echo "   ✓ QUICK-START-CLEANUP.md (quick reference)"
echo ""
echo "🎉 Your project root is now clean and organized!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Next steps:"
echo "  1. Run 'npm run dev' to test the app"
echo "  2. Verify UI improvements (black text, condensed tables)"
echo "  3. Check CODE-ORGANIZATION.md for codebase guide"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
