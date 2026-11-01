import React, { useState } from 'react';
import { PYTHON_SOURCE_CODE } from '../pythonCode';
import { Check, Copy, Download, Terminal, FileCode2, ExternalLink } from 'lucide-react';

export const PythonCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeOs, setActiveOs] = useState<'all' | 'win' | 'mac' | 'linux'>('all');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_SOURCE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
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

  const handleDownload = () => {
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
    <div className="space-y-6">
      {/* Barra de Ação Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#181820] border border-[#2A2A38]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm md:text-base flex items-center gap-2">
              <span>calculadora.py</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                Standalone Executável
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Arquivo único em Python 3 puro • Sem dependências pip • PEP 8 &amp; Type Hints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435] text-slate-200 text-xs font-semibold transition-all border border-white/5 cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-300" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#10B981] active:bg-[#047857] text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar calculadora.py</span>
          </button>
        </div>
      </div>

      {/* Guia de Execução Rápida por Sistema Operacional */}
      <div className="p-4 rounded-xl bg-[#121216] border border-[#2A2A38] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            Como executar no seu terminal local:
          </span>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveOs('all')}
              className={`px-2 py-1 rounded cursor-pointer ${
                activeOs === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveOs('win')}
              className={`px-2 py-1 rounded cursor-pointer ${
                activeOs === 'win' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Windows
            </button>
            <button
              onClick={() => setActiveOs('mac')}
              className={`px-2 py-1 rounded cursor-pointer ${
                activeOs === 'mac' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              macOS
            </button>
            <button
              onClick={() => setActiveOs('linux')}
              className={`px-2 py-1 rounded cursor-pointer ${
                activeOs === 'linux' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linux
            </button>
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {(activeOs === 'all' || activeOs === 'win') && (
            <div className="p-2.5 rounded-lg bg-[#181820] border border-[#2A2A38] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-400">Windows (PowerShell / CMD):</span>
              <code className="text-emerald-400 font-bold bg-black/40 px-2 py-1 rounded select-all">
                python calculadora.py
              </code>
            </div>
          )}

          {(activeOs === 'all' || activeOs === 'mac') && (
            <div className="p-2.5 rounded-lg bg-[#181820] border border-[#2A2A38] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-400">macOS (Terminal):</span>
              <code className="text-emerald-400 font-bold bg-black/40 px-2 py-1 rounded select-all">
                python3 calculadora.py
              </code>
            </div>
          )}

          {(activeOs === 'all' || activeOs === 'linux') && (
            <div className="p-2.5 rounded-lg bg-[#181820] border border-[#2A2A38] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-400">Linux (Ubuntu / Debian / Fedora):</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <code className="text-emerald-400 font-bold bg-black/40 px-2 py-1 rounded select-all">
                  python3 calculadora.py
                </code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visualizador de Código com Destaque de Sintaxe e Linhas */}
      <div className="rounded-xl border border-[#2A2A38] bg-[#121216] overflow-hidden shadow-2xl">
        <div className="bg-[#181820] px-4 py-2.5 border-b border-[#2A2A38] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium font-mono">calculadora.py</span>
            <span className="text-slate-500">•</span>
            <span>660+ linhas</span>
            <span className="text-slate-500">•</span>
            <span>Python 3.8+</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            {copied ? 'Copiado!' : 'Copiar tudo'}
          </button>
        </div>

        <div className="max-h-[600px] overflow-y-auto overflow-x-auto p-4 text-xs font-mono leading-relaxed bg-[#0E0E12]">
          <pre className="text-slate-300 whitespace-pre">
            <code>{PYTHON_SOURCE_CODE}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
