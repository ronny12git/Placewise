#!/usr/bin/env node

/**
 * Placewise Rebranding Script
 * Automatically renames "Job Portal" to "Placewise" across the entire project
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        PLACEWISE REBRANDING AUTOMATION SCRIPT             ║
║        From "Job Portal" to "Placewise"                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}\n`);

// Replacement mappings
const replacements = [
  // Brand names
  { find: /Job Portal/g, replace: 'Placewise' },
  { find: /job portal/g, replace: 'Placewise' },
  { find: /JOB PORTAL/g, replace: 'PLACEWISE' },
  { find: /job-portal/g, replace: 'placewise' },
  { find: /job_portal/g, replace: 'placewise' },
  { find: /jobportal/g, replace: 'placewise' },
  { find: /JobPortal/g, replace: 'Placewise' },
  
  // Descriptions
  { find: /A job portal/g, replace: 'A placement platform' },
  { find: /job posting platform/g, replace: 'placement platform' },
  { find: /job board/g, replace: 'placement board' },
  { find: /hiring platform/g, replace: 'placement platform' },
];

// Directories to skip
const skipDirs = ['node_modules', 'build', 'dist', '.git', 'coverage'];

// File extensions to process
const targetExtensions = ['.js', '.jsx', '.json', '.html', '.css', '.md', '.txt', '.env.example'];

let filesProcessed = 0;
let filesChanged = 0;
let totalReplacements = 0;

/**
 * Check if directory should be skipped
 */
function shouldSkipDir(dirPath) {
  const dirName = path.basename(dirPath);
  return skipDirs.includes(dirName);
}

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return targetExtensions.includes(ext);
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    filesProcessed++;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileReplacements = 0;

    // Apply all replacements
    replacements.forEach(({ find, replace }) => {
      const matches = content.match(find);
      if (matches) {
        content = content.replace(find, replace);
        modified = true;
        fileReplacements += matches.length;
      }
    });

    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesChanged++;
      totalReplacements += fileReplacements;
      console.log(`${colors.green}✓${colors.reset} ${filePath} (${fileReplacements} changes)`);
    }
    
  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (!shouldSkipDir(fullPath)) {
        processDirectory(fullPath);
      }
    } else if (stats.isFile()) {
      if (shouldProcessFile(fullPath)) {
        processFile(fullPath);
      }
    }
  });
}

/**
 * Main execution
 */
function main() {
  const targetDir = process.argv[2] || process.cwd();

  if (!fs.existsSync(targetDir)) {
    console.error(`${colors.red}Error: Directory not found: ${targetDir}${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.blue}Starting rebranding process...${colors.reset}`);
  console.log(`Target directory: ${targetDir}\n`);

  const startTime = Date.now();
  
  processDirectory(targetDir);
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.green}✓ Rebranding Complete!${colors.reset}\n`);
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`Files changed: ${filesChanged}`);
  console.log(`Total replacements: ${totalReplacements}`);
  console.log(`Duration: ${duration}s`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

  console.log(`${colors.yellow}Next steps:${colors.reset}`);
  console.log(`1. Review the changes using: git diff`);
  console.log(`2. Test your application thoroughly`);
  console.log(`3. Update your .env files manually if needed`);
  console.log(`4. Commit changes: git add . && git commit -m "Rebrand to Placewise"`);
  console.log(`\n${colors.green}Welcome to Placewise! 🚀${colors.reset}\n`);
}

// Run the script
main();