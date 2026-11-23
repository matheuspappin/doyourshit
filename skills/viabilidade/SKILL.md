---
name: viabilidade
description: Logo na ideia, estima quanto o projeto vai custar (para construir, por mês no ar e por cliente) e quanto tempo leva até o MVP no ritmo do método doyourshit, com o Claude testando sozinho, e junta a pesquisa de concorrentes para dizer se vale, como fazer mais barato e onde se destacar. Escreve docs/VIABILIDADE.md. Use quando o Matheus disser "quanto custa", "quanto tempo leva", "vale a pena?", "é viável?", "tenho uma ideia", ou na fase 0 do /doyourshit:guia.
---

# Viabilidade: custo, tempo e mercado antes de construir

Responda em português do Brasil. Use números com a fonte e a data; o que for palpite, diga que é palpite e por quê. Escreva tudo em `docs/VIABILIDADE.md`.

## 1. Mercado (em paralelo, logo no começo)

Chame o agente `pesquisa-mercado` com a ideia, o público e o país. Enquanto ele pesquisa, faça os passos 2 e 3. O resultado dele vai para o `docs/CONCORRENCIA.md` e o resumo entra na seção "Mercado" da viabilidade.

## 2. Custo

Monte três tabelas, cada linha com serviço, plano, preço com a fonte (página de preços, lida na hora) e o limite grátis:

1. **Para construir:** ferramentas, contas, domínio, a geração de mídia (por exemplo, o Higgsfield cobra por geração em dólar), o tempo do Claude (os modelos da sessão), o Mac ou o aparelho emprestado.
2. **Por mês no ar, com 0, 100 e 1.000 clientes:** servidor, banco, armazenamento, e-mail, autenticação, pagamento (taxa por cobrança), monitoramento. Marque o que é **R$ 0 até um limite** e em que número de clientes o limite estoura.
3. **Por cliente:** custo variável por cliente por mês e a margem com o preço que o mercado pratica (do agente). Se não fechar a conta, diga.

Sempre proponha o **caminho mais barato que funciona** (grátis primeiro, a VPS que já existe, a mídia no armazenamento do próprio cliente, como no WavBox com o Drive), e o que fica adiado até a venda abrir (`docs/CUSTOS.md`).

## 3. Tempo até o MVP, no ritmo do método

O tempo sai do tamanho do MVP, não de um palpite solto:

1. Liste os itens de "Entra agora" (mesmo provisórios) com o peso (1, 2 ou 3).
2. Conte os passos de teste previstos: cerca de 7 por bloco, um bloco por área, mais o T0 e a ponta a ponta.
3. Aplique o ritmo medido no WavBox (a referência até o projeto ter o próprio):

| Medida (WavBox, 2026-11) | Valor |
| --- | --- |
| Passos de teste fechados por dia de trabalho | 10 a 22 (média ~15), com a maioria feita pelo Claude no navegador e no terminal |
| Roteiro do MVP | 78 passos em 11 blocos; 60 fechados em 4 dias de trabalho |
| Progresso do MVP | de 37% para 62,5% em 7 dias corridos |
| O que segura | passos VOCÊ (outro aparelho, outra pessoa, Mac), aprovação do dono e gasto |

4. Separe o tempo do **Claude** (construir e testar: horas a poucos dias por bloco) do tempo **seu** (passos VOCÊ, decisões, aprovações) e do tempo de **terceiros** (aprovação de loja, verificação do Google, domínio, banco). O gargalo quase sempre é o segundo e o terceiro.
5. Dê uma faixa (otimista e realista), em dias de trabalho, e diga o que faria encurtar.
6. Depois de cada bloco fechado, o `/doyourshit:bloco` mede o ritmo real do projeto. Anote no `docs/KIT.md` › "Ritmo" e use nas próximas estimativas.

## 4. O veredito

No topo do `docs/VIABILIDADE.md`, em até 8 linhas:

- **Vale?** sim, sim com condição, ou não agora, e por quê;
- custo para construir e custo por mês com 100 clientes;
- tempo até o MVP (faixa);
- o diferencial mais forte (do agente de mercado) e a forma mais barata de fazer;
- o maior risco e como testar barato antes de construir (uma página de espera, uma conversa com 5 pessoas do público, um protótipo).

Mostre o veredito e pergunte se segue para a marca e o MVP (`/doyourshit:guia`). Registre (`/doyourshit:registro`).
