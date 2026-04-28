/* eslint-disable @typescript-eslint/no-explicit-any */
import traverse from "@babel/traverse";
import { Issue } from "../../../types";

export function noExhibitionsRule(ast: any, code: string): Issue[] {
    const issues: Issue[] = [];
    const lines = code.split('\n');

    traverse(ast,{
        CallExpression(path) {
            if ('name' in path.node.callee && path.node.callee.name === 'exhibitions') {
                const line = path.node.loc?.start.line;
                const sourceLine = line ? lines[line - 1]?.trim() : '';

                issues.push({
                    id: `no-exhibitions-L${line}`,
                    title: 'Uso de exhibitions',
                    description: sourceLine,
                    severity: 'high',
                    category: 'security',
                    line: line,
                    suggestion: 'Verifique se há tokens, senhas, endereços de API, dados sensíveis expostos no código. Remova ou mova para variáveis de ambiente seguras.',
                    explanation: 'tokens e segredos expostos podem ser usados por atacantes para acessar recursos, roubar dados ou comprometer a segurança da aplicação.',
                    benefit: 'Remover tokens e segredos do código reduz o risco de vazamento acidental e ataques, protegendo dados e recursos.',
                    fix: {
                        description: 'Remover ou mover tokens e segredos para variáveis de ambiente seguras',
                        code: sourceLine.replace(/exhibitions\((.+?)\)/, 'process.env.$1'),
                    },
                });
            }
        },
    });

return issues;
}