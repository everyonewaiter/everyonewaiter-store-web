import { transform } from '@svgr/core';
import { program } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';

const SVG_DIR = path.join(process.cwd(), 'src/assets/icons');
const COMPONENT_DIR = path.join(
  process.cwd(),
  'src/components/icons/svgs',
);

program
  .option('-c, --current-color', 'SVG 색상을 currentColor로 변환')
  .parse(process.argv);

const options = program.opts();

async function generateSvgComponents() {
  try {
    const inputDir = options.src
      ? path.resolve(process.cwd(), options.src)
      : SVG_DIR;
    const outputDir = options.out
      ? path.resolve(process.cwd(), options.out)
      : COMPONENT_DIR;

    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(inputDir);
    const svgFiles = files.filter((file) => file.endsWith('.svg'));

    console.log(`\n🔍 Found ${svgFiles.length} SVG file(s) in ${path.basename(inputDir)}\n`);

    const componentNames = [];

    for (const file of svgFiles) {
      const componentName = path
        .basename(file, '.svg')
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

      const svgContent = await fs.readFile(path.join(inputDir, file), 'utf-8');

      const componentPath = path.join(outputDir, `${componentName}.tsx`);

      const fileExists = await fs
        .access(componentPath)
        .then(() => true)
        .catch(() => false);

      if (fileExists && !options.force) {
        continue;
      }

      const componentCode = await transform(
        svgContent,
        {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          typescript: true,
          exportType: 'default',
          jsxRuntime: 'automatic',
          namedExport: componentName,
          svgoConfig: {
            multipass: true,
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              {
                name: 'convertColors',
                params: {
                  currentColor: options.currentColor,
                },
              },
            ],
          },
        },
        {
          componentName,
        },
      );

      let processedCode = componentCode
        .replace(
          /(import\s+type\s+\{[^}]*SVGProps[^}]*\}\s+from\s+['"]react['"])/,
          "$1\nimport cn from '@/lib/utils'",
        )
        .replace(
          /const\s+(\w+)\s*=\s*\(props:\s*SVGProps<SVGSVGElement>\)/,
          "const $1 = ({ className, ...props }: SVGProps<SVGSVGElement>)",
        )
        .replace(
          /<svg([^>]*)\{\.\.\.props\}([^>]*)>/,
          '<svg$1className={cn(className)} {...props}$2>',
        )
        .replace(
          /const\s+(\w+)\s*=\s*\(\{\s*className,\s*\.\.\.props\s*\}:\s*SVGProps<SVGSVGElement>\)\s*=>\s*\(/s,
          'function $1({ className, ...props }: SVGProps<SVGSVGElement>) {\n  return (',
        )
        .replace(/\n\)\s*$/m, '\n)\n}\n')
        .replace(/(import[^\n]*\n)(?!\n|import)/g, '$1\n')
        .replace(/(\n)(function\s+\w+)/g, '\n\n$2')
        .replace(/export\s+{\s*(\w+)\s*}/g, 'export default $1')
        .replace(/\n{3,}/g, '\n\n');

      const prettier = await import('prettier');
      let formattedCode = await prettier.format(processedCode, {
        parser: 'typescript',
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
        plugins: [],
      });

      formattedCode = formattedCode.replace(
        /const\s+(\w+)\s*=\s*\((\{[^}]*className[^}]*\}:\s*SVGProps<SVGSVGElement>)\)\s*=>\s*\(/s,
        (_, componentName, params) => {
          return `function ${componentName}(${params}) {\n  return (`;
        },
      );
      formattedCode = formattedCode.replace(/(\n\))(\s*)(?=export|\n*$)/m, '\n)\n}\n');
      formattedCode = formattedCode.replace(/export\s+{\s*(\w+)\s*}/g, 'export default $1');

      formattedCode = await prettier.format(formattedCode, {
        parser: 'typescript',
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
        plugins: [],
      });

      await fs.writeFile(
        path.join(outputDir, `${componentName}.tsx`),
        formattedCode,
      );

      componentNames.push(componentName);
    }

    const indexPath = path.join(outputDir, 'index.ts');
    let existingContent = '';

    try {
      existingContent = await fs.readFile(indexPath, 'utf-8');
    } catch {
      existingContent = '';
    }

    if (!componentNames.length) {
      console.log('\n⚠️  No new icons to generate.\n');
      return;
    }

    const exportStatements = componentNames
      .map((name) => `export { default as ${name} } from './${name}'`)
      .join('\n');

    const existingExports = existingContent.split('\n').filter(Boolean);
    const newExports = exportStatements
      .split('\n')
      .filter((line) => !existingExports.includes(line));

    if (newExports.length > 0) {
      const updatedContent = [...existingExports, ...newExports, ''].join('\n');

      await fs.writeFile(indexPath, updatedContent);

      console.log('\n✅ Generated components:');
      componentNames.forEach((name, index) => {
        console.log(`${index + 1}. ${name}`);
      });
      console.log(`\nTotal: ${componentNames.length} component(s)\n`);
    } else {
      console.log('\n✓ All components are up to date.\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message || error);
    process.exit(1);
  }
}

generateSvgComponents();