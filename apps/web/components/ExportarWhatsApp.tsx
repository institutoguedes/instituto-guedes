export function ExportarWhatsApp() {
  return (
    <section className="card stack">
      <h2>Exportar para o WhatsApp</h2>
      <p>Baixa todas as pessoas salvas, não só as que aparecem nesta tela.</p>
      <a className="btn" href="/api/decisoes?format=vcf" download="contatos-whatsapp-cruzada.vcf">
        Baixar contatos do WhatsApp
      </a>
      <p className="mudo">Arquivo do celular. Salve os contatos e eles entram no WhatsApp.</p>
      <a className="btn btn-ink" href="/api/decisoes?format=csv" download="inscritos-cruzada.csv">
        Baixar planilha completa
      </a>
      <p className="mudo">Nome, nascimento, cidade, WhatsApp e a mensagem pronta. Abre no Excel.</p>
      <a className="btn btn-ghost" href="/api/decisoes?format=numeros" download="numeros-whatsapp-cruzada.txt">
        Baixar lista de números
      </a>
      <a className="btn btn-ghost" href="/api/exportar" download="registros-cruzada.csv">
        Baixar fichas e cestas também
      </a>
    </section>
  );
}
