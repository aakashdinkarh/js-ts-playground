/**
 * Transpiles TypeScript code to JavaScript by removing type annotations and transforming TypeScript-specific features
 */
export const transpileTypeScript = (code: string): string => {
  let output = code;

  // First pass: Remove type-only constructs
  output = output
    // Remove interface declarations
    .replace(/interface\s+\w+\s*{[^}]*}/g, '')
    // Remove type aliases
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, '');

  // Remove type annotations
  output = output
    // Remove parameter type annotations
    .replace(/:\s*[A-Za-z_$][A-Za-z0-9_$]*(\[\])*(?=\s*[,);=])/g, '')
    // Remove function return types (including union types)
    .replace(/\)(?:\s*:\s*[A-Za-z_$][A-Za-z0-9_$<>[\]]*(?:\s*\|\s*[A-Za-z_$][A-Za-z0-9_$<>[\]]*)*)?(?=\s*{)/g, ') ')
    // Remove generic type parameters
    .replace(/<[^>]+>/g, '')
    // Remove implements clauses
    .replace(/implements\s+[A-Za-z_$][A-Za-z0-9_$]*/g, '')
    // Remove type assertions
    .replace(/as\s+[A-Za-z_$][A-Za-z0-9_$]*/g, '')
    // Remove variable type annotations (including union types)
    .replace(/:\s*(?:[A-Za-z_$][A-Za-z0-9_$<>[\]]*(?:\s*\|\s*[A-Za-z_$][A-Za-z0-9_$<>[\]]*)*)/g, '');

  // Handle class features
  output = output
    .replace(/constructor\s*\(([\s\S]*?)\)\s*{/g, (match, params) => {
      const cleanParams = params
        .split(',')
        .map((p: string) => p.trim())
        .map((p: string) => p.replace(/public\s+/, ''))
        .map((p: string) => p.replace(/:\s*[^,)]+/, ''))
        .filter(Boolean)
        .join(', ');

      const assignments = params
        .split(',')
        .map((p: string) => p.trim())
        .map((p: string) => p.replace(/public\s+/, ''))
        .map((p: string) => p.replace(/:\s*[^,)]+/, ''))
        .filter(Boolean)
        .map((p: string) => `this.${p} = ${p};`)
        .join(' ');

      return `constructor(${cleanParams}) { ${assignments}`;
    });

  // Remove modifiers
  output = output.replace(/(private|protected|public|readonly)\s+/g, '');

  return output;
}; 