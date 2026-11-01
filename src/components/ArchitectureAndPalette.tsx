import React from 'react';
import { Palette, Layers, ShieldCheck, Cpu, Code2, MousePointerClick } from 'lucide-react';

export const ArchitectureAndPalette: React.FC = () => {
  const colorItems = [
    {
      role: 'Base Operacional / Dados Neutros',
      target: 'Teclas Numéricas (0 a 9) e Ponto (.)',
      hexNormal: '#2B2D42',
      hexHover: '#383B56',
      hexActive: '#222435',
      fg: '#F8F9FA',
      concept: 'Cinza-azulado Escuro Sóbrio',
      rationale:
        'Sendo as teclas mais visualizadas e frequentemente pressionadas, requerem um tom neutro de baixa saturação para evitar fadiga visual e transmitir solidez física.',
    },
    {
      role: 'Lógica, Transformação e Cálculo',
      target: 'Operadores Aritméticos (+, -, ×, ÷)',
      hexNormal: '#2563EB',
      hexHover: '#3B82F6',
      hexActive: '#1D4ED8',
      fg: '#FFFFFF',
      concept: 'Azul Safira / Índigo Profundo',
      rationale:
        'Na psicologia das cores, o azul transmite clareza mental, confiança, foco e seriedade matemática, guiando o olhar intuitivamente para as etapas de transformação da conta.',
    },
    {
      role: 'Ação Crítica / Reset Destrutivo',
      target: 'Limpar Display (C) e Apagar Caractere (⌫)',
      hexNormal: '#DC2626',
      hexHover: '#EF4444',
      hexActive: '#B91C1C',
      fg: '#FFFFFF',
      concept: 'Terracota Refinado / Vermelho Rubro',
      rationale:
        'Alertam visualmente que o dado atual será descartado ou corrigido. O tom fosco e elegante previne cliques acidentais sem a poluição estridente de vermelhos neons.',
    },
    {
      role: 'Conclusão, Fechamento e Aprovação',
      target: 'Tecla de Execução e Resultado (=)',
      hexNormal: '#059669',
      hexHover: '#10B981',
      hexActive: '#047857',
      fg: '#FFFFFF',
      concept: 'Verde Esmeralda / Teal Vibrante',
      rationale:
        'Denota encerramento bem-sucedido de ciclo, recompensa cognitiva e confirmação de precisão matemática. Ocupe 2 colunas para maior acessibilidade.',
    },
    {
      role: 'Superfície e Contraste Tipográfico',
      target: 'Fundo da Janela e Painel de Display',
      hexNormal: '#121214',
      hexHover: '#1A1A22',
      hexActive: '#2A2A38',
      fg: '#F8F9FA',
      concept: 'Grafite Escuro / Ardósia Profundo',
      rationale:
        'Ambiente Dark Mode balanceado com bordas sutis e display digital duplo de alto contraste. O sub-display em #94A3B8 preserva o histórico sem competir com o número atual.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Seção 1: Design System & Hierarquia Visual de Cores */}
      <div className="bg-[#181820] rounded-xl border border-[#2A2A38] p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2A2A38]">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base md:text-lg">
              Design System &amp; Hierarquia Semântica de Cores
            </h3>
            <p className="text-xs text-slate-400">
              Cada tom foi intencionalmente calibrado para refletir a gravidade, propósito e estado cognitivo de cada ação.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorItems.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] flex flex-col justify-between hover:border-slate-600/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase font-semibold text-blue-400">
                    {item.role}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.target}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg shadow-md border border-white/10 flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: item.hexNormal, color: item.fg }}
                  >
                    Ex
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{item.concept}</h4>
                    <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-slate-400">
                      <span>Normal: <strong className="text-slate-300">{item.hexNormal}</strong></span>
                      <span>•</span>
                      <span>Hover: <strong className="text-slate-300">{item.hexHover}</strong></span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.rationale}</p>
              </div>

              {/* Amostras de Estado Hover e Active */}
              <div className="mt-4 pt-3 border-t border-[#2A2A38] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.hexNormal }}></span>
                  Normal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.hexHover }}></span>
                  Hover
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.hexActive }}></span>
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 2: Arquitetura Modular em Python & Boas Práticas PEP 8 */}
      <div className="bg-[#181820] rounded-xl border border-[#2A2A38] p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#2A2A38]">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-base md:text-lg">
              Arquitetura Orientada a Objetos (OOP) e Separação de Camadas
            </h3>
            <p className="text-xs text-slate-400">
              Isolamento estrito entre Modelo Matemático, Controle de Eventos e Apresentação Tkinter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
              <Code2 className="w-4 h-4" />
              <span>@dataclass Theme</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Design Tokens</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Centraliza todas as constantes cromáticas, fontes nativas com detecção de SO (Segoe UI no Windows, Helvetica no macOS/Linux) e espaçamentos, permitindo theming desacoplado.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Cpu className="w-4 h-4" />
              <span>CalculatorEngine</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Motor de Cálculo Puro</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% desacoplado de interface gráfica. Pode ser testado via CLI ou script automatizado sem necessidade de janela gráfica aberta, gerenciando histórico e erros.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
              <MousePointerClick className="w-4 h-4" />
              <span>CalculatorButton</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Microinterações GUI</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Herdeiro customizado de <code className="text-purple-300">tk.Button</code> com bindings nativos de <code className="text-purple-300">&lt;Enter&gt;</code> e <code className="text-purple-300">&lt;Leave&gt;</code> para feedback tátil visual responsivo.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>ModernCalculatorApp</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Orquestração &amp; Atalhos</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monta a grade responsiva em Grid Layout com pesos uniformes, sincroniza o display duplo e intercepta todos os atalhos do teclado físico em tempo real.
            </p>
          </div>
        </div>

        {/* Quadro de Regras Defensivas */}
        <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-3">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Matriz de Tratamento Defensivo de Erros
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#181820] border border-[#2A2A38]">
              <span className="text-red-400 font-bold block mb-1">Divisão por Zero</span>
              <p className="text-slate-400 text-[11px] font-sans">
                Intercepta denominador nulo antes de invocar a operação aritmética. Exibe <strong>"Indefinido"</strong> e trava o motor em estado de erro controlado, sem derrubar a aplicação.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#181820] border border-[#2A2A38]">
              <span className="text-blue-400 font-bold block mb-1">Operadores Consecutivos</span>
              <p className="text-slate-400 text-[11px] font-sans">
                Se o usuário clica <code>+</code> e em seguida <code>*</code>, o motor substitui suavemente o operador pendente no histórico em vez de concatenar ou acusar erro sintático.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#181820] border border-[#2A2A38]">
              <span className="text-amber-400 font-bold block mb-1">Ponto Decimal Duplo</span>
              <p className="text-slate-400 text-[11px] font-sans">
                Validação estrita de número decimal por operando: se o número atual já contém <code>.</code>, qualquer clique subsequente na tecla é silenciosamente ignorado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
