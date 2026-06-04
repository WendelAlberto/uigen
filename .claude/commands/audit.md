# Audit UIGen

Checklist de auditoria do projeto UIGen. Execute regularmente para manter saúde do codebase.

**Data última execução:** —  
**Próxima execução recomendada:** Antes de cada deploy ou sprint

---

## Segurança

- [ ] Nenhuma chave de API commitada em `git` (verificar `.env`, `.env.local`, etc.)
- [ ] `.env` no `.gitignore` e não versionado
- [ ] `ANTHROPIC_API_KEY` e `JWT_SECRET` não expostos em logs públicos
- [ ] Senhas em banco de dados são hash bcrypt (conferir `src/lib/auth.ts`)
- [ ] JWT token em cookie httpOnly (não acessível via JavaScript)
- [ ] CORS configurado corretamente em `next.config.ts` (se aplicável)
- [ ] Middleware verifica sessão antes de rotas protegidas
- [ ] SQL injection impossível (usando Prisma, não raw SQL)

## Qualidade de Código

- [ ] Sem `console.log()` ou `debugger` em código de produção
- [ ] TypeScript types definidos (sem `any` desnecessário)
- [ ] Imports não usados removidos
- [ ] Sem duplicação de código em contexts ou utils
- [ ] Funções respeitam limite de complexidade (max 15 linhas para lógica simples)
- [ ] Comentários explicam "por quê", não "o quê"
- [ ] Nomes de variáveis/funções em português ou inglês consistentemente

## Testes

- [ ] `npm test` passa sem erros
- [ ] Testes cobrem fluxos críticos (auth, chat streaming, file system)
- [ ] Mock provider testado isoladamente
- [ ] Contextos testados com valores iniciais e updates
- [ ] Cobertura mínima 70% em camadas críticas (`lib/`, `components/chat`)

## Dependências

- [ ] `npm audit` verificado (aceitar apenas vulnerabilidades low/info em dev)
- [ ] **Não rodar `npm audit fix`** — dependências fixadas para compatibilidade
- [ ] `package-lock.json` atualizado e commitado
- [ ] Versões de `next`, `react`, `prisma` estão atualizadas (ou travadas intencionalmente)

## Banco de Dados

- [ ] Nenhuma migração pendente: `npx prisma migrate status` sem warning
- [ ] Schema Prisma sincronizado com realidade do BD: `npx prisma validate`
- [ ] Índices em colunas `email` e `id` (performance de queries)
- [ ] Backup atualizado (backup `dev.db` antes de grandes mudanças)

## Documentação

- [ ] `CLAUDE.md` atualizado com últimas mudanças de arquitetura
- [ ] `README.md` contém setup correto e exemplos funcionar
- [ ] JSDoc comentários em funções públicas (`src/lib/`, `src/actions/`)
- [ ] Nenhum `TODO` ou `FIXME` obsoleto no código
- [ ] Instruções de debug atualizadas em `CLAUDE.md`

## Performance

- [ ] Chat API não excede 120 segundos (timeout configurado em `src/app/api/chat/route.ts`)
- [ ] Mock provider limita `maxSteps` a 4 (real Claude: 40)
- [ ] VirtualFileSystem serializa sem lags (testar com 50+ arquivos)
- [ ] Preview iframe (@babel/standalone) transpila em <3 segundos
- [ ] Nenhuma chamada N+1 em Prisma (verificar `prisma studio`)

## Monitoramento & Logs

- [ ] Erros de streaming logados com contexto (não apenas mensagem genérica)
- [ ] Auth failures logados (tentativas falhadas)
- [ ] Performance de geração de componentes monitorada (duração dos steps)
- [ ] BD queries lentas identificadas via slow query log

## Deployment Readiness

- [ ] Build local sucede: `npm run build`
- [ ] Servidor pode iniciar em modo produção: `npm start`
- [ ] Variáveis de env em produção estão configuradas (verificar `.env.production`)
- [ ] Mock provider desabilitado em produção (require `ANTHROPIC_API_KEY`)
- [ ] Nenhuma referência a `localhost` ou paths locais no código
- [ ] Cookies configurados para domínio correto (não `localhost` em prod)

---

## Checklist de Recém-Alterado

Use quando terminou mudança significativa:

### Após adicionar nova feature:
- [ ] Testes adicionados para nova lógica
- [ ] CLAUDE.md atualizado (se afeta arquitetura)
- [ ] Tipos TypeScript completos (sem `any`)
- [ ] Segurança verificada (inputs validados, outputs sanitizados)

### Após atualizar dependência:
- [ ] Testes passam pós-update
- [ ] APIs descontinuadas não mais usadas
- [ ] `package-lock.json` atualizado

### Após editar auth ou banco:
- [ ] Schema Prisma válido
- [ ] Migrations executadas localmente
- [ ] Testes de auth rodados

---

## Notas

- **Vulnerabilidades conhecidas:** 21 total (5 low, 8 moderate, 6 high, 2 critical) — aceitável em dev, review antes de prod
- **Turbopack warning:** `root` option em turbopack pode não ser reconhecida em algumas versões Next.js — seguro ignorar
- **Prisma version:** Atualmente 6.10.1; versão 7.8.0 disponível (major upgrade — avaliar antes de atualizar)

---

**Executar:** `npm test && npm run lint && npx prisma validate && npm run build`
