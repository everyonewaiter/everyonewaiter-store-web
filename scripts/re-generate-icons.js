import { transform } from "@svgr/core";
import { program } from "commander";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const SVG_DIR = path.join(process.cwd(), "src/assets/icons");
const COMPONENT_DIR = path.join(process.cwd(), "src/components/icons/__svgs__");

program.option("-c, --current-color", "SVG 색상을 currentColor로 변환").parse(process.argv);

const options = program.opts();

async function regenerateSvgComponents() {
  try {
    const inputDir = options.src ? path.resolve(process.cwd(), options.src) : SVG_DIR;
    const outputDir = options.out ? path.resolve(process.cwd(), options.out) : COMPONENT_DIR;

    await fs.mkdir(outputDir, { recursive: true });

    const files = await fs.readdir(inputDir);
    const svgFiles = files.filter((file) => file.endsWith(".svg"));

    console.log(`\n🔍 Found ${svgFiles.length} SVG file(s) in ${path.basename(inputDir)}\n`);
    console.log("🔄 Regenerating all icons...\n");

    const componentNames = [];

    for (const file of svgFiles) {
      const componentName = path
        .basename(file, ".svg")
        .replaceAll(/[^a-zA-Z0-9-]/g, "-")
        .replaceAll(/-+/g, "-")
        .replaceAll(/(^-|-$)/g, "")
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

      const svgContent = await fs.readFile(path.join(inputDir, file), "utf-8");

      const componentCode = await transform(
        svgContent,
        {
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
          typescript: true,
          exportType: "default",
          jsxRuntime: "automatic",
          namedExport: componentName,
          svgoConfig: {
            multipass: true,
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              {
                name: "convertColors",
                params: {
                  currentColor: options.currentColor ?? true,
                },
              },
              {
                name: "removeDimensions",
              },
            ],
          },
        },
        {
          componentName,
        }
      );

      let processedCode = componentCode
        .replace(
          /(import\s+type\s+\{[^}]*SVGProps[^}]*\}\s+from\s+['"]react['"])/,
          "$1\nimport cn from '@/lib/utils'"
        )
        .replace(
          /const\s+(\w+)\s*=\s*\([^)]*SVGProps<SVGSVGElement>[^)]*\)\s*=>/,
          "const $1 = ({ className, ...props }: Readonly<SVGProps<SVGSVGElement>>) =>"
        )
        .replace(
          /<svg([^>]*)\{\.\.\.props\}([^>]*)>/,
          "<svg$1className={cn(className)} {...props}$2>"
        )
        .replaceAll(/(import[^\n]*\n)(?!\n|import)/g, "$1\n")
        .replaceAll(/(\n)(function\s+\w+)/g, "\n\n$2")
        .replaceAll(/export\s+{\s*(\w+)\s*}/g, "export default $1")
        .replaceAll(/\n{3,}/g, "\n\n");

      const prettier = await import("prettier");
      let formattedCode = await prettier.format(processedCode, {
        parser: "typescript",
        semi: false,
        singleQuote: true,
        trailingComma: "all",
        plugins: [],
      });

      formattedCode = formattedCode.replaceAll(
        /const\s+(\w+)\s*=\s*\([^)]*:\s*Readonly<SVGProps<SVGSVGElement>>\)\s*=>\s*\(/g,
        (match) => {
          const componentName = match.match(/const\s+(\w+)\s*=/)?.[1];
          const params = match.match(/\(([^)]+)\)\s*=>/)?.[1] || "";
          return `function ${componentName}(${params}) {\n  return (`;
        }
      );

      formattedCode = formattedCode.replaceAll(
        /(\n\s*\))\s*(\n\s*export\s+default)/g,
        (match, closingParen, exportPart) => {
          const beforeExport = match.substring(0, match.indexOf(exportPart));
          if (!beforeExport.includes("}")) {
            return `${closingParen}\n  }${exportPart}`;
          }
          return match;
        }
      );

      formattedCode = formattedCode.replaceAll(/export\s+{\s*(\w+)\s*}/g, "export default $1");

      formattedCode = await prettier.format(formattedCode, {
        parser: "typescript",
        semi: false,
        singleQuote: true,
        trailingComma: "all",
        plugins: [],
      });

      formattedCode = formattedCode.replaceAll(
        /(function\s+\w+\s*\([^)]*:\s*)SVGProps<SVGSVGElement>(\))/g,
        "$1Readonly<SVGProps<SVGSVGElement>>$2"
      );

      await fs.writeFile(path.join(outputDir, `${componentName}.tsx`), formattedCode);

      componentNames.push(componentName);
    }

    const indexPath = path.join(outputDir, "index.ts");
    const exportStatements = componentNames
      .map((name) => `export { default as ${name} } from './${name}'`)
      .join("\n");

    await fs.writeFile(indexPath, exportStatements + "\n");

    console.log("\n✅ Regenerated components:");
    componentNames.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    console.log(`\nTotal: ${componentNames.length} component(s)\n`);
  } catch (error) {
    console.error("\n❌ Error:", error.message || error);
    process.exit(1);
  }
}

await regenerateSvgComponents();
