# Allowed Tools Configuration

Ferramentas que Claude pode usar sem pedir permissão neste projeto:

## CLI Commands
- `npm` — instalação, build, dev, test, lint
- `sqlite3` — consultas ao banco de dados
- `git` — versionamento (commits, push, status)
- `curl` — requisições HTTP

## Playwright (MCP)
- `mcp__playwright__browser_snapshot` — screenshot
- `mcp__playwright__browser_click` — cliques
- `mcp__playwright__browser_scroll` — scroll
- `mcp__playwright__browser_fill` — preencher campos
- `mcp__playwright__browser_type` — digitar texto
- `mcp__playwright__navigate` — navegar URLs
- `mcp__playwright__get_page_text` — extrair texto
- `mcp__playwright__read_page` — ler HTML

## File Operations
- `Read` — ler arquivos
- `Write` — criar/sobrescrever arquivos
- `Edit` — editar arquivos
- `Glob` — buscar arquivos por padrão
- `Grep` — buscar conteúdo em arquivos
- `Bash` — executar comandos shell

## Code Review & Testing
- `code-review` — revisar código
- `simplify` — simplificar código
- `verify` — verificar changes funcionam
- `npm test` — rodar testes

---

**Objetivo:** Acelerar iterações reduzindo permission prompts em operações comuns.
