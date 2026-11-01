import React, { useState } from 'react';
import { BookOpen, Copy, Check, Download, Layers, ShieldCheck, Cpu } from 'lucide-react';

interface ReadmeViewerProps {
  onSelectCodeTab?: () => void;
}

export const ReadmeViewer: React.FC<ReadmeViewerProps> = () => {
  const [copied, setCopied] = useState(false);

  const handleDownloadReadme = () => {
    fetch('/README.md')
      .then((res) => res.text())
      .then((text) => {
        const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'README.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  };

  const handleCopyReadme = () => {
    fetch('/README.md')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#181820] border border-[#2A2A38]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm md:text-base flex items-center gap-2">
              <span>README.md</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                Documentação Técnica
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Respostas detalhadas sobre componentes, fluxo de entrada e lógica algorítmica de cálculo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReadme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B2D42] hover:bg-[#383B56] text-slate-200 text-xs font-semibold border border-white/5 cursor-pointer transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copiar Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReadme}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#10B981] active:bg-[#047857] text-white text-xs font-semibold cursor-pointer transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar README.md</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Renderizado da Documentação */}
      <div className="bg-[#181820] rounded-xl border border-[#2A2A38] p-6 space-y-8 text-slate-300 text-sm leading-relaxed">
        {/* Título Principal */}
        <div className="border-b border-[#2A2A38] pb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Calculadora Gráfica Moderna em Python (Tkinter)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Arquitetura orientada a objetos (OOP), tipagem estática (PEP 484), conformidade estrita com PEP 8 e biblioteca gráfica 100% nativa sem dependências externas.
          </p>
        </div>

        {/* Resposta 1: Principais Componentes */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-100">
            <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3>Quais são os principais componentes do código gerado?</h3>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            O código foi desenvolvido aplicando o princípio de responsabilidade única (SRP), dividindo as incumbências em 5 componentes modulares:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>Theme (@dataclass imutável)</span>
              </div>
              <h4 className="font-bold text-slate-200 text-xs">Design Tokens &amp; Paleta Semântica</h4>
              <p className="text-slate-400 text-xs">
                Centraliza todas as constantes cromáticas (fundo <code className="text-slate-300">#121214</code>, numéricos <code className="text-slate-300">#2B2D42</code>, operadores <code className="text-blue-400">#2563EB</code>, limpeza <code className="text-red-400">#DC2626</code>, resultado <code className="text-emerald-400">#059669</code>) e tipografia nativa adaptada por sistema operacional.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                <Cpu className="w-4 h-4" />
                <span>CalculatorEngine</span>
              </div>
              <h4 className="font-bold text-slate-200 text-xs">Núcleo Matemático &amp; Máquina de Estados</h4>
              <p className="text-slate-400 text-xs">
                Totalmente isolado do Tkinter. Mantém as variáveis de estado (<code className="text-slate-300">current_operand</code>, <code className="text-slate-300">expression_history</code>, <code className="text-slate-300">is_new_input</code>, <code className="text-slate-300">has_error</code>) e implementa todas as validações defensivas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
                <Layers className="w-4 h-4" />
                <span>CalculatorButton (tk.Button)</span>
              </div>
              <h4 className="font-bold text-slate-200 text-xs">Microinterações Visuais da GUI</h4>
              <p className="text-slate-400 text-xs">
                Extensão personalizada de botão com bordas planas (<code className="text-slate-300">relief="flat"</code>) e escuta nativa de eventos <code className="text-purple-300">&lt;Enter&gt;</code> e <code className="text-purple-300">&lt;Leave&gt;</code> para transições suaves de hover state.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>ModernCalculatorApp</span>
              </div>
              <h4 className="font-bold text-slate-200 text-xs">Orquestrador de Janela &amp; Atalhos</h4>
              <p className="text-slate-400 text-xs">
                Monta a janela gráfica, display digital duplo de alto contraste, grid de botões 4x5 com peso uniforme e vincula atalhos do teclado físico do computador.
              </p>
            </div>
          </div>
        </section>

        {/* Resposta 2: Como recebe números e identifica operação */}
        <section className="space-y-4 pt-4 border-t border-[#2A2A38]">
          <div className="flex items-center gap-2 text-base font-bold text-slate-100">
            <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3>Como a aplicação recebe os números e identifica a operação escolhida?</h3>
          </div>

          <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono text-blue-400">
              Fluxo de Captura e Identificação (Dupla Entrada):
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>1. Entrada por Clique (GUI):</strong> Cada botão possui um callback <code className="text-blue-300">command=lambda: ...</code> direcionado. Ex: clicar em "7" chama <code className="text-slate-200">_on_click_digit("7")</code>; clicar em "÷" chama <code className="text-slate-200">_on_click_operator("÷")</code>.
              </p>
              <p>
                <strong>2. Entrada por Teclado Físico:</strong> O método <code className="text-blue-300">_handle_keypress(event)</code> escuta o evento global <code className="text-slate-200">&lt;Key&gt;</code>, roteando códigos ASCII ('0'-'9', '+', '-', '*', '/', '.', ',', Enter, Backspace, Esc).
              </p>
              <p>
                <strong>3. Dicionário de Mapeamento:</strong> A identificação do operador é feita pela tabela <code className="text-slate-200">OPERATORS = {"{'+': '+', '-': '-', '×': '*', '÷': '/'}"}</code>.
              </p>
              <p>
                <strong>4. Troca Fluida de Operador Consecutivo:</strong> Se o usuário digita <code className="text-slate-200">5 +</code> e em seguida muda para <code className="text-slate-200">×</code> antes de digitar o próximo número, o motor substitui o operador anterior sem gerar duplicidades como <code className="text-red-400">5 + *</code> nem emitir crash de sintaxe.
              </p>
            </div>
          </div>
        </section>

        {/* Resposta 3: Como a lógica realiza cálculos e apresenta resultados */}
        <section className="space-y-4 pt-4 border-t border-[#2A2A38]">
          <div className="flex items-center gap-2 text-base font-bold text-slate-100">
            <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3>Como a lógica de programação é utilizada para realizar os cálculos e apresentar os resultados?</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <h4 className="font-bold text-slate-200 text-xs text-emerald-400 font-mono">
                A. Avaliação Matemática Segura (Sem eval)
              </h4>
              <p className="text-slate-400">
                A expressão completa é concatenada (<code className="text-slate-200">f"{"{history}{operand}"}"</code>) e separada em tokens (<code className="text-slate-200">split()</code>). Os valores <code className="text-slate-200">left_val</code> e <code className="text-slate-200">right_val</code> são convertidos estritamente para <code className="text-slate-200">float</code> e processados por blocos condicionais explícitos (<code className="text-blue-300">if op == '+': ... elif op == '/': ...</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <h4 className="font-bold text-slate-200 text-xs text-red-400 font-mono">
                B. Tratamento Defensivo contra Divisão por Zero
              </h4>
              <p className="text-slate-400">
                Antes de invocar o operador aritmético de divisão, o motor checa <code className="text-slate-200">if right_val == 0.0:</code>. Caso positivo, o resultado se torna <strong>"Indefinido"</strong>, a flag <code className="text-slate-200">has_error</code> é ligada e a aplicação permanece responsiva, sem disparar a exceção nativa <code className="text-red-400">ZeroDivisionError</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <h4 className="font-bold text-slate-200 text-xs text-amber-400 font-mono">
                C. Correção de Ruído Flutuante (IEEE 754) e Ponto Decimal
              </h4>
              <p className="text-slate-400">
                O método <code className="text-slate-200">_format_number()</code> arredonda imprecisões binárias de float (transformando <code className="text-slate-200">0.1 + 0.2 = 0.30000000000000004</code> em <code className="text-emerald-400">0.3</code>) e remove sufixos <code className="text-slate-200">.0</code> para números inteiros. A inserção de múltiplos pontos é bloqueada com <code className="text-slate-200">if "." not in operand</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
              <h4 className="font-bold text-slate-200 text-xs text-blue-400 font-mono">
                D. Apresentação no Display com Feedback de Alerta
              </h4>
              <p className="text-slate-400">
                O método <code className="text-slate-200">_update_display()</code> atualiza o sub-display com o histórico completo da conta (<code className="text-slate-400">#94A3B8</code>) e o display principal com o valor final (<code className="text-slate-100">#F8F9FA</code>). Se houver erro, a cor do texto do display transiciona para <code className="text-red-300">#FCA5A5</code> como indicador cognitivo imediato.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
