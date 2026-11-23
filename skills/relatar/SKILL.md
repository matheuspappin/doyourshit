---
name: relatar
description: Transforma um achado do roteiro (A<n>), um bug ou um problema de usabilidade num relato no formato dos templates de issue do projeto e, com o "sim" do Matheus, abre a issue no GitHub. Use quando ele disser que achou um problema, que um testador reclamou, "vira issue", "abre issue do A7", ou pedir para registrar ou reportar.
---

# Relatar: achado → issue

Adaptado do `/relatar` da equipe do WavBox (Figuerah). Responda em português do Brasil. O repositório está no `docs/KIT.md` › "Repositório GitHub".

1. **Classifique:** Bug (não funciona), Usabilidade (funciona, mas a pessoa travou, se confundiu ou demorou) ou Feature. Um problema por issue: se vieram vários, separe e confirme a lista.
2. **Achado do roteiro:** se ainda não tem número, crie o A<n> na tabela **Achados** do `docs/testes/ROTEIRO.md`. A issue cita o A<n> e o passo (T<n>.<m>); depois, o achado cita a issue.
3. **Leia o template** em `.github/ISSUE_TEMPLATE/` e preencha cada campo com o que se sabe: passos, esperado, o que aconteceu, números, prints da pasta de evidências. Usabilidade: gravidade Bloqueou, Atrasou ou Incomodou.
4. **Pergunte só o que falta e é obrigatório**, numa mensagem só. Não invente passo, versão ou número.
5. **Procure duplicata:** `gh issue list -R <repo> --search "<palavras>" --state all`. Achou: proponha comentar na existente.
6. **Confira o que sai do computador:** nada de senha, token, `.env`, e-mail ou nome completo de testador de fora.
7. **Mostre o texto final** (título + corpo com os títulos do template) e peça o "sim". Só então: `gh issue create -R <repo> --title "<título>" --body-file <arquivo> --label <bug|usabilidade|feature>`. Se o rótulo não existir, abra sem ele e avise.
8. **Sem `gh`, sem internet ou sem repositório:** salve em `<pasta do registro>/relatos/AAAA-MM-DD-<tema>.md` e diga que falta abrir a issue.
9. Responda com o link (ou o caminho) e a prioridade sugerida (P0 a P3).
