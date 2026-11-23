#!/usr/bin/env bash
# Compara o que foi feito com o que foi recebido (base em refs/registro/base/<ramo>).
# Só lê: não faz fetch, commit nem push.
# Uso: bash comparar.sh [repositório] [pasta do registro]
# Sem argumentos: o repositório é a pasta atual e a pasta do registro sai da linha
# "Pasta do registro" do docs/KIT.md (ou <repositório>-registro, ao lado).
set -u
REPO="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$REPO" || { echo "Repositório não encontrado: $REPO"; exit 1; }
REPO="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null | sed 's#/\.git$##')"
[ -n "$REPO" ] && cd "$REPO"
if [ -n "${2:-}" ]; then
  REG="$2"
else
  REG=$(grep -m1 -E '^\| *Pasta do registro *\|' docs/KIT.md 2>/dev/null | awk -F'|' '{print $3}' | tr -d ' `')
  [ -z "$REG" ] && REG="${REPO}-registro"
fi

echo "# Comparação: recebido × feito"
echo
echo "Gerado em $(TZ=America/Sao_Paulo date '+%Y-%m-%d %H:%M %z') a partir de \`$REPO\`."
echo

bases=$(git for-each-ref refs/registro/base/ --format='%(refname)')
if [ -z "$bases" ]; then
  echo "Nenhuma base registrada. Rode o modo \"base\" da skill primeiro."
  exit 0
fi

# Worktree de cada ramo (para olhar mudanças não commitadas no lugar certo).
declare -A WT
while read -r line; do
  case "$line" in
    worktree\ *) path="${line#worktree }" ;;
    branch\ refs/heads/*) WT["${line#branch refs/heads/}"]="$path" ;;
  esac
done < <(git worktree list --porcelain)

for ref in $bases; do
  branch="${ref#refs/registro/base/}"
  base=$(git rev-parse --short "$ref")
  echo "## Ramo \`$branch\`"
  echo
  if ! git rev-parse -q --verify "refs/heads/$branch" >/dev/null; then
    echo "- Recebido: \`$base\`. **Não existe ramo local com esse nome.**"
    echo
    continue
  fi
  head=$(git rev-parse --short "refs/heads/$branch")
  remote=$(git rev-parse -q --short --verify "refs/remotes/origin/$branch" 2>/dev/null || echo "—")
  echo "- Recebido (base): \`$base\` · Local agora: \`$head\` · GitHub (último fetch): \`$remote\`"
  if [ "$remote" != "—" ]; then
    ahead=$(git rev-list --count "origin/$branch..refs/heads/$branch")
    behind=$(git rev-list --count "refs/heads/$branch..origin/$branch")
    echo "- Em relação ao GitHub: $ahead commit(s) só aqui, $behind só lá"
  fi
  echo
  mine=$(git log --first-parent --format='%h' "$ref..refs/heads/$branch")
  if [ -z "$mine" ]; then
    echo "Nenhum commit seu desde o recebido."
  else
    echo "### Commits seus desde o recebido (só a linha principal do ramo)"
    echo
    git log --first-parent --format='- `%h` %ad — %s' --date=format:'%Y-%m-%d %H:%M' "$ref..refs/heads/$branch"
    echo
    echo "Arquivos (recebido → agora, inclui o que veio de mesclas):"
    echo
    echo '```'
    git diff --stat=120 "$ref" "refs/heads/$branch" | tail -n 25
    echo '```'
  fi
  dir="${WT[$branch]:-}"
  if [ -n "$dir" ]; then
    pending=$(git -C "$dir" status --porcelain)
    echo
    if [ -n "$pending" ]; then
      echo "### Não commitado em \`$dir\`"
      echo
      echo '```'
      echo "$pending"
      echo '```'
    else
      echo "Sem mudança não commitada em \`$dir\`."
    fi
  fi
  # Arquivos que mudaram nos seus commits e não aparecem no registro: candidatos a documentar.
  if [ -n "$mine" ] && [ -f "$REG/REGISTRO.md" ]; then
    missing=""
    for c in $mine; do
      for f in $(git diff-tree --no-commit-id --name-only -r --cc "$c" | sort -u); do
        name=$(basename "$f")
        grep -qF "$name" "$REG/REGISTRO.md" || missing="$missing\n$f"
      done
    done
    missing=$(printf "%b" "$missing" | sed '/^$/d' | sort -u)
    if [ -n "$missing" ]; then
      n=$(echo "$missing" | wc -l)
      echo
      echo "### Arquivos dos seus commits que o registro não cita ($n; os primeiros 30)"
      echo
      echo "$missing" | head -n 30 | sed 's/^/- `/; s/$/`/'
    fi
  fi
  echo
done
