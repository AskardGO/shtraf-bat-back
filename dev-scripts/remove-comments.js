#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { parse, print } = require('recast');
const { globby } = require('globby');
const { parse: babelParse } = require('@babel/parser');
const recast = require('recast');

const babelOptions = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'jsx',
    'classProperties',
    'decorators-legacy',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom'
  ]
};

async function removeComments() {
  try {
    console.log('🔍 Searching for TypeScript and JavaScript files...');
    
    const files = await globby([
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!node_modules/**',
      '!dist/**',
      '!build/**'
    ]);

    console.log(`📁 Found ${files.length} files to process`);

    let processedCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        console.log(`🔧 Processing: ${file}`);
        
        const code = fs.readFileSync(file, 'utf8');
        
        // Parse the code using @babel/parser
        const ast = parse(code, {
          parser: {
            parse: (source) => babelParse(source, babelOptions)
          }
        });

        recast.types.visit(ast, {
          visitNode(path) {
            const node = path.value;

            if (node.comments) {
              node.comments = [];
            }
            if (node.leadingComments) {
              node.leadingComments = [];
            }
            if (node.trailingComments) {
              node.trailingComments = [];
            }
            
            this.traverse(path);
          },
        });

        const output = print(ast, {
          tabWidth: 2,
          useTabs: false,
          quote: 'single',
          trailingComma: true,
          arrowParens: 'always'
        }).code;
        
        fs.writeFileSync(file, output, 'utf8');
        console.log(`✅ Comments removed: ${file}`);
        processedCount++;
        
      } catch (fileError) {
        console.error(`❌ Error processing ${file}:`, fileError.message);
        errorCount++;
      }
    }

    console.log('\n🎉 Comment removal completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Files processed: ${processedCount}`);
    console.log(`   - Files with errors: ${errorCount}`);
    console.log(`   - Total files found: ${files.length}`);

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

removeComments().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
