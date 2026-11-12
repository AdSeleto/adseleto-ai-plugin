# Prevenção de deploy

Problemas que já passaram para a revisão do diretório do Claude ou para quem usa o plugin e que dava para pegar antes. Antes de abrir PR, confira os itens que se aplicam ao diff. Cada entrada vem de um caso real.

Ao corrigir algo que a revisão do diretório, o QA, o PO ou produção pegou, acrescente uma entrada aqui no mesmo PR da correção. Use o formato abaixo e mantenha só o que vale para o próximo PR, sem histórico da investigação.

```
## Título curto
- **Sintoma:** o que a pessoa viu
- **Causa:** por que aconteceu
- **Conferir:** o que olhar no diff antes do PR
- **Origem:** task, data
```

## O diretório do Claude recusa script e arquivo fora dos tipos aceitos
- **Sintoma:** o plugin ficou em "Needs changes" em claude.ai/directory/manage, com "Files outside the allowed types accepted only from Verified organizations" (`LOCAL_CODE_FILE_TYPE`), e saiu da fila de publicação.
- **Causa:** o repositório tinha o `scripts/check-coverage.mjs`, um script com `#!`. De organização não verificada, o diretório só aceita Markdown, texto, JSON, YAML e imagem PNG, JPEG, GIF, WebP ou ICO.
- **Conferir:** rode `git ls-files` e confirme que todo arquivo é de um desses tipos e que nenhum começa com `#!`. Dentro de `.claude-plugin/` só cabem o `plugin.json`, imagem e o `marketplace.json` com campos conhecidos. Sem arquivo de gerenciador de pacote, sem pasta `.claude/skills` e sem `hooks.json`, `.lsp.json` ou `monitors.json` soltos. Ferramenta de manutenção fica fora do versionamento (a pasta `scripts/` está no `.gitignore`).
- **Origem:** [17tqamf3ntp](https://app.clickup.com/t/17tqamf3ntp), 12/11/2026

## Commit novo na main derruba o pedido de publicação em andamento
- **Sintoma:** o pedido de publicação feito para um commit aprovado deixou de valer, e o plugin ficou semanas parado sem ninguém perceber.
- **Causa:** o diretório checa sozinho cada commit novo da `main`. Um merge feito depois do pedido de publicação virou a versão mais nova, com a mesma `version`, e essa versão falhou no check.
- **Conferir:** todo PR sobe a `version` no `.claude-plugin/plugin.json`. Depois do merge, abra claude.ai/directory/manage, confirme que o check do commit novo passou e peça a publicação de novo. Com pedido de publicação em andamento, só faça merge se for para corrigir o envio.
- **Origem:** [17tqamf3ntp](https://app.clickup.com/t/17tqamf3ntp), 12/11/2026
