type Janela = { quantidade: number; ate: number };

const janelas = new Map<string, Janela>();

function contar(chave: string, limite: number, janelaMs: number): boolean {
  const agora = Date.now();
  const atual = janelas.get(chave);
  if (!atual || atual.ate < agora) {
    janelas.set(chave, { quantidade: 1, ate: agora + janelaMs });
    return true;
  }
  if (atual.quantidade >= limite) {
    return false;
  }
  atual.quantidade += 1;
  return true;
}

export function podeRegistrarDecisao(ip: string): boolean {
  return contar(`decisao:${ip}`, 120, 10 * 60 * 1000);
}

export function loginBloqueado(ip: string): boolean {
  const atual = janelas.get(`login:${ip}`);
  return !!atual && atual.ate > Date.now() && atual.quantidade >= 8;
}

export function registrarFalhaLogin(ip: string): void {
  contar(`login:${ip}`, 100, 10 * 60 * 1000);
}

export function limparFalhasLogin(ip: string): void {
  janelas.delete(`login:${ip}`);
}
