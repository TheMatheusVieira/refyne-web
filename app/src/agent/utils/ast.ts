import { parse } from '@babel/parser';

export function parseCode(code: string) {
  return parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
    errorRecovery: true,
  });
}
