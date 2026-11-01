import React, { useState } from 'react';
import { TkinterSimulator } from './components/TkinterSimulator';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { ArchitectureAndPalette } from './components/ArchitectureAndPalette';
import { UnitTestsRunner } from './components/UnitTestsRunner';
import { PYTHON_SOURCE_CODE } from './pythonCode';
import {
  Calculator,
  Code2,
  Palette,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'architecture' | 'tests'>('simulator');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = PYTHON_SOURCE_CODE;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([PYTHON_SOURCE_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculadora.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0E0E12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Superior Principal */}
      <header className="border-b border-[#2A2A38] bg-[#121216]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo e Identidade do Projeto */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 p-[1px] shadow-lg shadow-blue-500/10">
              <div className="w-full h-full bg-[#181820] rounded-[11px] flex items-center justify-center">
                <Calculator className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                  Calculadora Gráfica Python
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                  Tkinter Nativo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Design Minimalista Dark • Motor Defensivo • Zero Dependências pip
              </p>
            </div>
          </div>

          {/* Botões de Ação Imediata */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B2D42] hover:bg-[#383B56] text-slate-200 text-xs font-semibold border border-white/5 cursor-pointer transition-all shadow-sm"
              title="Copiar código Python completo para a área de transferência"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copiar .py</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#10B981] active:bg-[#047857] text-white text-xs font-semibold cursor-pointer transition-all shadow-md"
              title="Baixar arquivo calculadora.py pronto para rodar"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Script (.py)</span>
            </button>
          </div>
        </div>

        {/* Barra de Navegação por Abas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-[#2A2A38]/50 pt-1">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador GUI Tkinter (1:1)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código-Fonte Python (.py)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Design System &amp; Arquitetura</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tests'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Bateria de Testes (Unit Tests)</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {activeTab === 'simulator' && <TkinterSimulator onSelectCodeTab={() => setActiveTab('code')} />}
        {activeTab === 'code' && <PythonCodeViewer />}
        {activeTab === 'architecture' && <ArchitectureAndPalette />}
        {activeTab === 'tests' && <UnitTestsRunner />}
      </main>

      {/* Rodapé com Especificações de Qualidade */}
      <footer className="border-t border-[#2A2A38] bg-[#121216] py-5 px-4 sm:px-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> PEP 8 Compliance &amp; Type Hints
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Zero Bibliotecas de Terceiros (100% tkinter nativo)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-mono text-[11px]">
              Paleta: <strong className="text-blue-400">#2563EB</strong> | <strong className="text-red-400">#DC2626</strong> | <strong className="text-emerald-400">#059669</strong> | <strong className="text-slate-300">#2B2D42</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
