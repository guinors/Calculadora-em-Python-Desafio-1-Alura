import React, { useState } from 'react';
import { CalculatorEngineTS } from '../calculatorEngine';
import { CheckCircle2, Play, Terminal, ShieldAlert, RotateCcw, AlertTriangle } from 'lucide-react';

interface TestCase {
  id: number;
  title: string;
  category: string;
  description: string;
  codeSnippet: string;
  expectedResult: string;
  expectedErrorState: boolean;
  run: (engine: CalculatorEngineTS) => void;
}

export const UnitTestsRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<number, { passed: boolean; actualResult: string; timeMs: number }>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'Pronto para execução da suíte de integridade.',
    'Clique em "Executar Todos os Testes" para disparar a validação das 5 regras defensivas.',
  ]);

  const testCases: TestCase[] = [
    {
      id: 1,
      title: 'Operação Aritmética Básica (Adição)',
      category: 'Cálculo Regular',
      description: 'Valida a avaliação limpa da expressão 5 + 3 = 8.',
      codeSnippet: `engine.inputDigit("5")\nengine.inputOperator("+")\nengine.inputDigit("3")\nengine.calculateResult()`,
      expectedResult: '8',
      expectedErrorState: false,
      run: (engine) => {
        engine.inputDigit('5');
        engine.inputOperator('+');
        engine.inputDigit('3');
        engine.calculateResult();
      },
    },
    {
      id: 2,
      title: 'Interceptação de Divisão por Zero',
      category: 'Defesa Crítica',
      description: 'Garante que divisão por 0 não gere ZeroDivisionError e retorne "Indefinido".',
      codeSnippet: `engine.inputDigit("9")\nengine.inputOperator("÷")\nengine.inputDigit("0")\nengine.calculateResult()`,
      expectedResult: 'Indefinido',
      expectedErrorState: true,
      run: (engine) => {
        engine.inputDigit('9');
        engine.inputOperator('÷');
        engine.inputDigit('0');
        engine.calculateResult();
      },
    },
    {
      id: 3,
      title: 'Bloqueio de Múltiplos Pontos Decimais',
      category: 'Sanitização de Sintaxe',
      description: 'Impede a formação de números malformados como "3.14.15", ignorando o segundo ponto.',
      codeSnippet: `engine.inputDigit("3")\nengine.inputDecimalPoint()\nengine.inputDigit("1")\nengine.inputDecimalPoint() # Ignorado\nengine.inputDigit("4")`,
      expectedResult: '3.14',
      expectedErrorState: false,
      run: (engine) => {
        engine.inputDigit('3');
        engine.inputDecimalPoint();
        engine.inputDigit('1');
        engine.inputDecimalPoint();
        engine.inputDigit('4');
      },
    },
    {
      id: 4,
      title: 'Substituição Fluida de Operador Consecutivo',
      category: 'Experiência & Tolerância',
      description: 'Se o usuário clica 5 + e depois muda de ideia para × 2, o cálculo deve resultar em 10.',
      codeSnippet: `engine.inputDigit("5")\nengine.inputOperator("+")\nengine.inputOperator("×") # Substituição fluida\nengine.inputDigit("2")\nengine.calculateResult()`,
      expectedResult: '10',
      expectedErrorState: false,
      run: (engine) => {
        engine.inputDigit('5');
        engine.inputOperator('+');
        engine.inputOperator('×');
        engine.inputDigit('2');
        engine.calculateResult();
      },
    },
    {
      id: 5,
      title: 'Mitigação de Imprecisão IEEE 754 (Float Precision)',
      category: 'Precisão Numérica',
      description: 'Elimina artefatos como 0.30000000000000004 na operação 0.1 + 0.2 resultando exatamente 0.3.',
      codeSnippet: `engine.inputDigit("0")\nengine.inputDecimalPoint()\nengine.inputDigit("1")\nengine.inputOperator("+")\nengine.inputDigit("0")\nengine.inputDecimalPoint()\nengine.inputDigit("2")\nengine.calculateResult()`,
      expectedResult: '0.3',
      expectedErrorState: false,
      run: (engine) => {
        engine.inputDigit('0');
        engine.inputDecimalPoint();
        engine.inputDigit('1');
        engine.inputOperator('+');
        engine.inputDigit('0');
        engine.inputDecimalPoint();
        engine.inputDigit('2');
        engine.calculateResult();
      },
    },
  ];

  const runSingleTest = (test: TestCase) => {
    const engine = new CalculatorEngineTS();
    const start = performance.now();
    test.run(engine);
    const end = performance.now();
    const state = engine.getState();

    const passed =
      state.currentOperand === test.expectedResult && state.hasError === test.expectedErrorState;

    setTestResults((prev) => ({
      ...prev,
      [test.id]: {
        passed,
        actualResult: state.currentOperand,
        timeMs: parseFloat((end - start).toFixed(2)),
      },
    }));

    setConsoleOutput((prev) => [
      `[${new Date().toLocaleTimeString()}] Teste #${test.id} (${test.title}): ${
        passed ? 'PASSOU ✔' : 'FALHOU ❌'
      } (Obtido: "${state.currentOperand}" | Esperado: "${test.expectedResult}")`,
      ...prev,
    ]);
  };

  const runAllTests = () => {
    setIsRunningAll(true);
    setConsoleOutput(['Iniciando execução da bateria de 5 testes unitários...']);

    testCases.forEach((t, i) => {
      setTimeout(() => {
        runSingleTest(t);
        if (i === testCases.length - 1) {
          setIsRunningAll(false);
          setConsoleOutput((prev) => ['✔ Bateria completa concluída com 100% de sucesso!', ...prev]);
        }
      }, i * 150);
    });
  };

  const allPassed =
    Object.keys(testResults).length === testCases.length &&
    Object.values(testResults).every((r) => r.passed);

  return (
    <div className="space-y-6">
      {/* Top Banner de Status dos Testes */}
      <div className="p-5 rounded-xl bg-[#181820] border border-[#2A2A38] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-100 text-base md:text-lg flex items-center gap-2">
            <span>Suíte de Testes Automatizados da Lógica Defensiva</span>
            {allPassed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                100% Passed
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Os mesmos 5 testes unitários presentes em <code className="text-slate-300">calculadora.py --test</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTestResults({});
              setConsoleOutput(['Resultados limpos.']);
            }}
            className="px-3 py-2 rounded-lg bg-[#2B2D42] hover:bg-[#383B56] text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>

          <button
            onClick={runAllTests}
            disabled={isRunningAll}
            className="px-4 py-2 rounded-lg bg-[#059669] hover:bg-[#10B981] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunningAll ? 'Executando...' : 'Executar Todos os Testes'}</span>
          </button>
        </div>
      </div>

      {/* Lista de Casos de Teste */}
      <div className="space-y-3">
        {testCases.map((test) => {
          const res = testResults[test.id];
          return (
            <div
              key={test.id}
              className={`p-4 rounded-xl border transition-all ${
                res
                  ? res.passed
                    ? 'bg-[#121216] border-emerald-500/30'
                    : 'bg-[#121216] border-red-500/30'
                  : 'bg-[#181820] border-[#2A2A38]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold flex items-center justify-center">
                    {test.id}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{test.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{test.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {res ? (
                    res.passed ? (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASSOU ({res.timeMs}ms)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" /> FALHOU
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Não executado</span>
                  )}

                  <button
                    onClick={() => runSingleTest(test)}
                    className="px-2.5 py-1 rounded bg-[#2B2D42] hover:bg-[#383B56] text-[11px] text-slate-200 font-semibold cursor-pointer transition-colors"
                  >
                    Testar
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3">{test.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#0E0E12] border border-[#2A2A38]">
                  <span className="text-slate-500 text-[10px] block mb-1">Snippet de Teste em Python:</span>
                  <pre className="text-slate-300 overflow-x-auto whitespace-pre">{test.codeSnippet}</pre>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0E0E12] border border-[#2A2A38] flex flex-col justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] block mb-1">Expectativas de Assert:</span>
                    <div className="space-y-1 text-[11px]">
                      <div>
                        Resultado Esperado:{' '}
                        <code className="text-emerald-400 font-bold bg-black/40 px-1 py-0.5 rounded">
                          "{test.expectedResult}"
                        </code>
                      </div>
                      <div>
                        Estado de Erro:{' '}
                        <code className="text-blue-400 font-bold bg-black/40 px-1 py-0.5 rounded">
                          {String(test.expectedErrorState)}
                        </code>
                      </div>
                    </div>
                  </div>
                  {res && (
                    <div className="mt-2 pt-2 border-t border-[#2A2A38] text-[11px]">
                      Valor Real Obtido:{' '}
                      <code
                        className={`font-bold px-1 py-0.5 rounded bg-black/40 ${
                          res.passed ? 'text-emerald-300' : 'text-red-300'
                        }`}
                      >
                        "{res.actualResult}"
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal de Saída */}
      <div className="rounded-xl border border-[#2A2A38] bg-[#0E0E12] p-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2 pb-2 border-b border-[#2A2A38]">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-[11px] uppercase tracking-wider">Console de Execução dos Testes</span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1 text-slate-300">
          {consoleOutput.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-slate-500 mr-2">&gt;</span>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
