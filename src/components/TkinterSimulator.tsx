import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorEngineTS, CalculatorState } from '../calculatorEngine';
import { soundService } from '../sound';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Terminal, RotateCcw, ArrowRight, Play } from 'lucide-react';

interface TkinterSimulatorProps {
  onSelectCodeTab?: () => void;
}

export const TkinterSimulator: React.FC<TkinterSimulatorProps> = ({ onSelectCodeTab }) => {
  const [engine] = useState(() => new CalculatorEngineTS());
  const [state, setState] = useState<CalculatorState>(() => engine.getState());
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [eventHistory, setEventHistory] = useState<Array<{ time: string; action: string; note: string }>>([
    {
      time: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
      action: 'Motor Inicializado',
      note: 'Estado 100% pronto para operações.',
    },
  ]);

  const updateUI = useCallback(() => {
    const s = engine.getState();
    setState(s);
    setEventHistory((prev) => [
      {
        time: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
        action: s.lastAction || 'Ação',
        note: s.lastDefensiveNote || '',
      },
      ...prev.slice(0, 19),
    ]);
  }, [engine]);

  const handleDigit = useCallback((d: string) => {
    soundService.playClick('num');
    setActiveKey(d);
    setTimeout(() => setActiveKey(null), 120);
    engine.inputDigit(d);
    updateUI();
  }, [engine, updateUI]);

  const handleDecimal = useCallback(() => {
    soundService.playClick('num');
    setActiveKey('.');
    setTimeout(() => setActiveKey(null), 120);
    engine.inputDecimalPoint();
    updateUI();
  }, [engine, updateUI]);

  const handleOperator = useCallback((op: string) => {
    soundService.playClick('op');
    setActiveKey(op);
    setTimeout(() => setActiveKey(null), 120);
    engine.inputOperator(op);
    updateUI();
  }, [engine, updateUI]);

  const handleEquals = useCallback(() => {
    soundService.playClick('equal');
    setActiveKey('=');
    setTimeout(() => setActiveKey(null), 120);
    engine.calculateResult();
    updateUI();
  }, [engine, updateUI]);

  const handleClear = useCallback(() => {
    soundService.playClick('crit');
    setActiveKey('C');
    setTimeout(() => setActiveKey(null), 120);
    engine.resetAll();
    updateUI();
  }, [engine, updateUI]);

  const handleBackspace = useCallback(() => {
    soundService.playClick('crit');
    setActiveKey('⌫');
    setTimeout(() => setActiveKey(null), 120);
    engine.backspace();
    updateUI();
  }, [engine, updateUI]);

  const handleToggleSign = useCallback(() => {
    soundService.playClick('num');
    setActiveKey('±');
    setTimeout(() => setActiveKey(null), 120);
    engine.toggleSign();
    updateUI();
  }, [engine, updateUI]);

  // Teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em inputs normais
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key;
      if (key >= '0' && key <= '9') {
        e.preventDefault();
        handleDigit(key);
      } else if (key === '.' || key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (key === '*') {
        e.preventDefault();
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key === 'Delete') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handleEquals, handleBackspace, handleClear]);

  // Executa cenário defensivo rápido
  const runPresetScenario = (scenario: 'divZero' | 'dupOp' | 'dupDot' | 'floatPrecision' | 'negNumber') => {
    engine.resetAll();
    if (scenario === 'divZero') {
      engine.inputDigit('1');
      engine.inputDigit('2');
      engine.inputOperator('÷');
      engine.inputDigit('0');
      engine.calculateResult();
    } else if (scenario === 'dupOp') {
      engine.inputDigit('8');
      engine.inputOperator('+');
      engine.inputOperator('×'); // Usuário trocou o operador
      engine.inputDigit('5');
      engine.calculateResult();
    } else if (scenario === 'dupDot') {
      engine.inputDigit('3');
      engine.inputDecimalPoint();
      engine.inputDigit('1');
      engine.inputDecimalPoint(); // Inválido!
      engine.inputDigit('4');
    } else if (scenario === 'floatPrecision') {
      engine.inputDigit('0');
      engine.inputDecimalPoint();
      engine.inputDigit('1');
      engine.inputOperator('+');
      engine.inputDigit('0');
      engine.inputDecimalPoint();
      engine.inputDigit('2');
      engine.calculateResult();
    } else if (scenario === 'negNumber') {
      engine.inputDigit('4');
      engine.inputDigit('5');
      engine.toggleSign();
      engine.inputOperator('×');
      engine.inputDigit('3');
      engine.calculateResult();
    }
    updateUI();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Coluna Central: Janela 1:1 Tkinter */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center">
        {/* Mockup da Janela do Tkinter no Desktop */}
        <div className="w-full max-w-[380px] bg-[#121214] rounded-2xl border border-[#2A2A38] shadow-2xl overflow-hidden transition-all duration-200 ring-1 ring-white/5">
          {/* Barra de Título Nativa Desktop */}
          <div className="bg-[#18181F] px-4 py-3 border-b border-[#2A2A38] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#10B981]/80 inline-block"></span>
              <span className="text-xs font-semibold text-slate-300 ml-2 tracking-wide font-sans">Calculadora</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = !soundOn;
                  setSoundOn(next);
                  soundService.enabled = next;
                }}
                title={soundOn ? 'Desativar som tátil' : 'Ativar som tátil'}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                Tkinter GUI
              </span>
            </div>
          </div>

          {/* Painel da Calculadora */}
          <div className="p-4 space-y-4">
            {/* Display Digital de Alto Contraste */}
            <div className="bg-[#1A1A22] rounded-xl border border-[#2A2A38] px-5 py-4 flex flex-col justify-between min-h-[96px] shadow-inner">
              {/* Histórico da Expressão (Sub-display) */}
              <div className="text-right text-xs md:text-sm font-mono text-[#94A3B8] h-5 truncate select-all tracking-wider">
                {state.expressionHistory || '\u00A0'}
              </div>

              {/* Dígito Principal / Resultado */}
              <div
                className={`text-right text-3xl md:text-4xl font-bold font-mono tracking-tight select-all truncate ${
                  state.hasError ? 'text-[#FCA5A5]' : 'text-[#F8F9FA]'
                }`}
              >
                {state.currentOperand}
              </div>
            </div>

            {/* Teclado Grid Proporcional */}
            <div className="grid grid-cols-4 gap-2">
              {/* Linha 0: C, ⌫, ±, ÷ */}
              <button
                onClick={handleClear}
                className={`py-3.5 rounded-lg font-bold text-base text-white transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === 'C'
                    ? 'bg-[#B91C1C] scale-95 ring-2 ring-red-400'
                    : 'bg-[#DC2626] hover:bg-[#EF4444] active:bg-[#B91C1C]'
                }`}
                title="Limpar display (C / Esc / Del)"
              >
                C
              </button>

              <button
                onClick={handleBackspace}
                className={`py-3.5 rounded-lg font-bold text-base text-white transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '⌫'
                    ? 'bg-[#B91C1C] scale-95 ring-2 ring-red-400'
                    : 'bg-[#DC2626] hover:bg-[#EF4444] active:bg-[#B91C1C]'
                }`}
                title="Apagar último caractere (Backspace)"
              >
                ⌫
              </button>

              <button
                onClick={handleToggleSign}
                className={`py-3.5 rounded-lg font-bold text-base text-slate-200 transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '±'
                    ? 'bg-[#0F172A] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#1E293B] hover:bg-[#334155] active:bg-[#0F172A]'
                }`}
                title="Inverter sinal positivo/negativo (±)"
              >
                ±
              </button>

              <button
                onClick={() => handleOperator('÷')}
                className={`py-3.5 rounded-lg font-bold text-lg text-white transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '÷'
                    ? 'bg-[#1D4ED8] scale-95 ring-2 ring-blue-300'
                    : 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8]'
                }`}
                title="Divisão (/)"
              >
                ÷
              </button>

              {/* Linha 1: 7, 8, 9, × */}
              <button
                onClick={() => handleDigit('7')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '7'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                7
              </button>
              <button
                onClick={() => handleDigit('8')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '8'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                8
              </button>
              <button
                onClick={() => handleDigit('9')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '9'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                9
              </button>
              <button
                onClick={() => handleOperator('×')}
                className={`py-3.5 rounded-lg font-bold text-lg text-white transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '×'
                    ? 'bg-[#1D4ED8] scale-95 ring-2 ring-blue-300'
                    : 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8]'
                }`}
                title="Multiplicação (*)"
              >
                ×
              </button>

              {/* Linha 2: 4, 5, 6, - */}
              <button
                onClick={() => handleDigit('4')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '4'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                4
              </button>
              <button
                onClick={() => handleDigit('5')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '5'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                5
              </button>
              <button
                onClick={() => handleDigit('6')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '6'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                6
              </button>
              <button
                onClick={() => handleOperator('-')}
                className={`py-3.5 rounded-lg font-bold text-xl text-white transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '-'
                    ? 'bg-[#1D4ED8] scale-95 ring-2 ring-blue-300'
                    : 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8]'
                }`}
                title="Subtração (-)"
              >
                -
              </button>

              {/* Linha 3: 1, 2, 3, + */}
              <button
                onClick={() => handleDigit('1')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '1'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                1
              </button>
              <button
                onClick={() => handleDigit('2')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '2'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                2
              </button>
              <button
                onClick={() => handleDigit('3')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '3'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                3
              </button>
              <button
                onClick={() => handleOperator('+')}
                className={`py-3.5 rounded-lg font-bold text-xl text-white transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '+'
                    ? 'bg-[#1D4ED8] scale-95 ring-2 ring-blue-300'
                    : 'bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1D4ED8]'
                }`}
                title="Adição (+)"
              >
                +
              </button>

              {/* Linha 4: 0, ., = (span 2) */}
              <button
                onClick={() => handleDigit('0')}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '0'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
              >
                0
              </button>
              <button
                onClick={handleDecimal}
                className={`py-3.5 rounded-lg font-bold text-base text-[#F8F9FA] transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '.'
                    ? 'bg-[#222435] scale-95 ring-2 ring-slate-400'
                    : 'bg-[#2B2D42] hover:bg-[#383B56] active:bg-[#222435]'
                }`}
                title="Ponto decimal (.)"
              >
                .
              </button>
              <button
                onClick={handleEquals}
                className={`col-span-2 py-3.5 rounded-lg font-bold text-lg text-white transition-all duration-100 flex items-center justify-center cursor-pointer select-none shadow-sm ${
                  activeKey === '='
                    ? 'bg-[#047857] scale-95 ring-2 ring-emerald-300'
                    : 'bg-[#059669] hover:bg-[#10B981] active:bg-[#047857]'
                }`}
                title="Calcular resultado (= / Enter)"
              >
                =
              </button>
            </div>
          </div>

          {/* Dica de Teclado Físico */}
          <div className="bg-[#18181F] px-4 py-2.5 border-t border-[#2A2A38] text-[11px] text-slate-400 flex items-center justify-between">
            <span>⌨️ Teclado físico ativo</span>
            <span className="font-mono text-slate-500">0-9 . + - * / Enter ⌫ Esc</span>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Inspetor de Estado do Motor & Cenários de Teste */}
      <div className="lg:col-span-6 xl:col-span-7 space-y-6">
        {/* Painel de Estado em Tempo Real */}
        <div className="bg-[#181820] rounded-xl border border-[#2A2A38] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2A2A38]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm md:text-base">
                Inspetor do Motor Defensivo (Python State Machine)
              </h3>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${
                state.hasError
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {state.hasError ? 'ESTADO: ERRO / INDEFINIDO' : 'ESTADO: OPERACIONAL'}
            </span>
          </div>

          {/* Variáveis Internas da Classe Python */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-4">
            <div className="p-2.5 rounded-lg bg-[#121216] border border-[#2A2A38]">
              <span className="text-slate-400 block mb-1 text-[11px]">current_operand</span>
              <span className="text-blue-400 font-bold truncate block">{state.currentOperand}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#121216] border border-[#2A2A38]">
              <span className="text-slate-400 block mb-1 text-[11px]">expression_history</span>
              <span className="text-amber-400 font-bold truncate block">
                {state.expressionHistory || '""'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#121216] border border-[#2A2A38]">
              <span className="text-slate-400 block mb-1 text-[11px]">is_new_input</span>
              <span className={state.isNewInput ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>
                {String(state.isNewInput)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#121216] border border-[#2A2A38]">
              <span className="text-slate-400 block mb-1 text-[11px]">has_error</span>
              <span className={state.hasError ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {String(state.hasError)}
              </span>
            </div>
          </div>

          {/* Última Ação e Análise de Defesa */}
          <div className="p-3.5 rounded-lg bg-[#121216] border border-[#2A2A38] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Última Ação Processada:</span>
              <span className="text-blue-300 font-mono">{state.lastAction}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-5 font-sans">
              <strong className="text-slate-300">Comportamento Defensivo:</strong> {state.lastDefensiveNote}
            </p>
          </div>
        </div>

        {/* Cenários de Teste Rápido (Stress & Edge Cases) */}
        <div className="bg-[#181820] rounded-xl border border-[#2A2A38] p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              Testes Rápidos de Casos de Borda (Edge Cases)
            </h4>
            <span className="text-[11px] text-slate-400">Clique para simular instantaneamente</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => runPresetScenario('divZero')}
              className="p-3 text-left rounded-lg bg-[#121216] hover:bg-[#1e1e28] border border-[#2A2A38] hover:border-red-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-red-400 group-hover:text-red-300">Divisão por Zero</span>
                <Play className="w-3 h-3 text-slate-500 group-hover:text-red-400 transition-colors" />
              </div>
              <span className="text-slate-400 font-mono text-[11px]">12 ÷ 0 = Indefinido</span>
              <span className="text-slate-500 text-[10px]">Previne ZeroDivisionError com feedback amigável</span>
            </button>

            <button
              onClick={() => runPresetScenario('dupOp')}
              className="p-3 text-left rounded-lg bg-[#121216] hover:bg-[#1e1e28] border border-[#2A2A38] hover:border-blue-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-blue-400 group-hover:text-blue-300">Operadores Consecutivos</span>
                <Play className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <span className="text-slate-400 font-mono text-[11px]">8 + × 5 = 40</span>
              <span className="text-slate-500 text-[10px]">Substitui o operador sem crashar ou duplicar</span>
            </button>

            <button
              onClick={() => runPresetScenario('dupDot')}
              className="p-3 text-left rounded-lg bg-[#121216] hover:bg-[#1e1e28] border border-[#2A2A38] hover:border-amber-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-amber-400 group-hover:text-amber-300">Múltiplos Pontos</span>
                <Play className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-slate-400 font-mono text-[11px]">3 . 1 . 4 → 3.14</span>
              <span className="text-slate-500 text-[10px]">Bloqueia segundos pontos dentro do mesmo número</span>
            </button>

            <button
              onClick={() => runPresetScenario('floatPrecision')}
              className="p-3 text-left rounded-lg bg-[#121216] hover:bg-[#1e1e28] border border-[#2A2A38] hover:border-emerald-500/50 transition-all text-xs flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-emerald-400 group-hover:text-emerald-300">Precisão Flutuante</span>
                <Play className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <span className="text-slate-400 font-mono text-[11px]">0.1 + 0.2 = 0.3</span>
              <span className="text-slate-500 text-[10px]">Sanitiza imprecisões do padrão IEEE 754</span>
            </button>
          </div>
        </div>

        {/* Histórico Recente de Interações */}
        <div className="bg-[#181820] rounded-xl border border-[#2A2A38] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Log de Eventos do Motor
            </span>
            <button
              onClick={() => {
                engine.resetAll();
                updateUI();
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Limpar
            </button>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
            {eventHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 p-1.5 rounded bg-[#121216]/60 border border-[#2A2A38]/40"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-500 text-[10px]">{item.time}</span>
                  <span className="text-blue-300 font-semibold text-[11px]">{item.action}:</span>
                  <span className="text-slate-300 text-[11px] truncate">{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
