#!/bin/bash

# ralph.sh - Automated Claude agent for Flappy Bird development
# Usage: ./plans/ralph.sh <iterations>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for iteration argument
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide number of iterations${NC}"
    echo "Usage: ./plans/ralph.sh <iterations>"
    exit 1
fi

ITERATIONS=$1
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Ralph - Flappy Bird Development Agent${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Project directory: ${PROJECT_DIR}"
echo -e "Planned iterations: ${ITERATIONS}"
echo ""

# The prompt for Claude
PROMPT='You are working on a Flappy Bird browser game project. Your task is to implement features from the PRD.

INSTRUCTIONS:
1. Read @prd.json to see all features and their status
2. Read @progress.txt to see current progress
3. Find the NEXT feature where "passes": false (in priority order). This should be the one YOU decide has the highest priority order - not necessarily the first item.
4. Implement that feature completely:
   - Write/modify the necessary code files
   - Write unit tests for the feature (in tests/ directory using Jest)
   - Update prd.json to set "passes": true for the completed feature
   - Append a progress update to progress.txt with what you did and leave a note for the next person working in the codebase.
5. Run tests to verify your implementation:
   - Run "npm test" for Jest unit tests
   - For visual/browser features, use Puppeteer MCP tools to test in browser but only use this if it calls for it in the PRD. We only run this once every 10 tasks:
     a. Start local server: "npx serve -p 3000 &" (if not already running)
     b. Use mcp__puppeteer__browser_navigate to go to http://localhost:3000
     c. Use mcp__puppeteer__browser_screenshot to verify visual rendering
     d. Use mcp__puppeteer__browser_click or browser_type for interaction tests
6. Make a git commit of that feature. ONLY WORK ON ONE FEATURE.
7. If while implementing the feature, you notice the PRD is complete, output <promise>COMPLETE</promise>

IMPORTANT RULES:
- Only implement ONE feature per iteration
- Always write tests for your implementation
- Update both prd.json and progress.txt after completing a feature
- Keep code simple and focused
- For visual features (rendering, styling), verify with browser screenshot

BROWSER TESTING (via Puppeteer MCP):
- mcp__puppeteer__browser_navigate: Navigate to URL
- mcp__puppeteer__browser_screenshot: Take screenshot to verify visuals
- mcp__puppeteer__browser_click: Click elements (use for flap testing)
- mcp__puppeteer__browser_console_messages: Check for JS errors

COMPLETION CHECK:
After implementing, check if ALL features in prd.json have "passes": true.
- If there are still features with "passes": false, end your response normally
- If ALL features have "passes": true (project complete), you MUST end your response with exactly:
  <promise>COMPLETE</promise>

Now read the PRD and progress files, then implement the next incomplete feature.'

# Run the loop
for ((i=1; i<=ITERATIONS; i++)); do
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}  Iteration $i of $ITERATIONS${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    echo -e "${BLUE}Running Claude... (this may take a few minutes)${NC}"
    echo ""

    # Run Claude and capture output
    OUTPUT=$(cd "$PROJECT_DIR" && claude --dangerously-skip-permissions --print "$PROMPT" 2>&1)

    # Display the output
    echo "$OUTPUT"
    echo ""

    # Check for completion marker
    if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  PROJECT COMPLETE!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo -e "All features have been implemented."
        echo -e "Total iterations used: $i"
        exit 0
    fi

    echo -e "${BLUE}Iteration $i complete. Moving to next...${NC}"
    echo ""

    # Small delay between iterations
    sleep 2
done

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Iterations Complete${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "Completed $ITERATIONS iterations."
echo -e "Project may not be fully complete - check progress.txt for status."
exit 0
