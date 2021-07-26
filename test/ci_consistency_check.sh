#!/bin/bash
#
# Check that a newly built version of ecflow-shell.tmLanguage.json is the same
# as the checked-in version.
#
# Assumptions
#   This script is designed to be run from a CI system where the repository is
#   always in a clean state when this script is run.
#   It is further assumed that the repository clone is transient and as such
#   this script does no cleanup.
#
set -eu

readonly SYNTAX_FILE="syntaxes/ecflow-shell.tmLanguage.json"

# Exit immediately if the repository (specifically the ecflow-shell syntax file)
# is not in a clean state. The check won't work if there are local modifications.
if ! git diff --quiet -- "$SYNTAX_FILE"; then
  echo "The selfcheck can only be run when the repository is in a clean state" 1>&2
  exit 2
fi

# Run the build to generate the up-to-date syntax file
npm run build &> /dev/null

# Check with git to see if the syntax file has changed as a result of the build
if ! git diff --quiet -- "$SYNTAX_FILE"; then
    echo "Generated vs. checked-in ecflow-syntax.tmLanguage.json are not the same:"
    git --no-pager diff -- "$SYNTAX_FILE"
    exit 1
else
    echo "Consistency check OK"
    exit 0
fi
