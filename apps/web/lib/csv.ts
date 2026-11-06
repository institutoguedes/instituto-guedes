function celula(valor: string): string {
  const texto = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
  return `"${texto.replaceAll('"', '""')}"`;
}

export function planilha(linhas: string[][]): string {
  const corpo = linhas.map((linha) => linha.map(celula).join(",")).join("\r\n");
  return `\uFEFF${corpo}\r\n`;
}

export function respostaArquivo(nomeArquivo: string, corpo: string, tipo: string): Response {
  return new Response(corpo, {
    headers: {
      "Content-Type": `${tipo}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
      "Cache-Control": "no-store",
    },
  });
}

export function respostaPlanilha(nomeArquivo: string, linhas: string[][]): Response {
  return respostaArquivo(nomeArquivo, planilha(linhas), "text/csv");
}
