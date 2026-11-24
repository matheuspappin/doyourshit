#!/usr/bin/env bash
# Sobe o Chrome DevTools MCP do doyourshit, sem tela e com perfil temporário.
# Usa o Chrome do sistema; se não houver, procura um já baixado (Playwright,
# Puppeteer) e, em último caso, baixa o Chrome do Puppeteer uma vez (~170 MB).
# Para forçar um navegador: CHROME_PATH=/caminho/do/chrome
set -u
VERSAO="chrome-devtools-mcp@1.10.1"
achar() {
  [ -n "${CHROME_PATH:-}" ] && [ -x "$CHROME_PATH" ] && { echo "$CHROME_PATH"; return; }
  for c in /opt/google/chrome/chrome google-chrome google-chrome-stable chromium chromium-browser \
           "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    p=$(command -v "$c" 2>/dev/null || true); [ -n "$p" ] && [ -x "$p" ] && { echo "$p"; return; }
  done
  for p in $(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome \
                  "$HOME"/.cache/puppeteer/chrome/*/chrome-linux*/chrome 2>/dev/null | sort -r); do
    [ -x "$p" ] && { echo "$p"; return; }
  done
}
CHROME=$(achar)
if [ -z "$CHROME" ]; then
  npx -y @puppeteer/browsers install chrome@stable --path "$HOME/.cache/puppeteer" >&2 || true
  CHROME=$(achar)
fi
ARGS=(--headless --isolated)
[ -n "$CHROME" ] && ARGS+=(--executablePath "$CHROME")
# Servidor Linux sem sandbox disponível (o Chrome cai ao abrir): desliga a sandbox
# só neste navegador de teste, que roda sem tela e com perfil temporário.
if [ -n "$CHROME" ] && [ "$(uname -s)" = "Linux" ]; then
  if ! timeout 20 "$CHROME" --headless=new --dump-dom about:blank >/dev/null 2>&1; then
    ARGS+=(--chromeArg=--no-sandbox --chromeArg=--disable-setuid-sandbox)
  fi
fi
exec npx -y "$VERSAO" "${ARGS[@]}"
