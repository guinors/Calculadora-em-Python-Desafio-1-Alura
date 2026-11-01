/**
 * Motor de cálculo defensivo (Engine) que espelha exatamente a lógica do Python.
 */
export interface CalculatorState {
  currentOperand: string;
  expressionHistory: string;
  isNewInput: boolean;
  hasError: boolean;
  lastAction?: string;
  lastDefensiveNote?: string;
}

export class CalculatorEngineTS {
  public currentOperand: string = '0';
  public expressionHistory: string = '';
  public isNewInput: boolean = true;
  public hasError: boolean = false;
  public lastAction: string = 'Inicialização';
  public lastDefensiveNote: string = 'Pronto para entrada de dados';

  public resetAll(): void {
    this.currentOperand = '0';
    this.expressionHistory = '';
    this.isNewInput = true;
    this.hasError = false;
    this.lastAction = 'Limpar Display (C)';
    this.lastDefensiveNote = 'Estado completamente resetado.';
  }

  public backspace(): void {
    this.lastAction = 'Apagar Último Dígito (⌫)';
    if (this.hasError) {
      this.resetAll();
      return;
    }

    if (this.isNewInput) {
      this.lastDefensiveNote = 'Nenhum dígito em edição para remover.';
      return;
    }

    if (this.currentOperand.length > 1) {
      if (this.currentOperand.length === 2 && this.currentOperand.startsWith('-')) {
        this.currentOperand = '0';
        this.isNewInput = true;
      } else {
        this.currentOperand = this.currentOperand.slice(0, -1);
      }
      this.lastDefensiveNote = 'Último caractere removido.';
    } else {
      this.currentOperand = '0';
      this.isNewInput = true;
      this.lastDefensiveNote = 'Operando resetado para 0.';
    }
  }

  public inputDigit(digit: string): void {
    this.lastAction = `Inserir Dígito [${digit}]`;
    if (this.hasError) {
      this.resetAll();
    }

    if (this.isNewInput) {
      this.currentOperand = digit;
      this.isNewInput = false;
      this.lastDefensiveNote = `Novo operando iniciado com ${digit}.`;
    } else {
      if (this.currentOperand === '0') {
        this.currentOperand = digit;
        this.lastDefensiveNote = 'Substituído zero à esquerda.';
      } else {
        if (this.currentOperand.length < 16) {
          this.currentOperand += digit;
          this.lastDefensiveNote = `Dígito adicionado (${this.currentOperand.length}/16 caracteres).`;
        } else {
          this.lastDefensiveNote = 'Limite ergonômico de 16 caracteres atingido.';
        }
      }
    }
  }

  public inputDecimalPoint(): void {
    this.lastAction = 'Inserir Ponto Decimal [.]';
    if (this.hasError) {
      this.resetAll();
    }

    if (this.isNewInput) {
      this.currentOperand = '0.';
      this.isNewInput = false;
      this.lastDefensiveNote = 'Iniciado número decimal com "0.".';
      return;
    }

    if (!this.currentOperand.includes('.')) {
      this.currentOperand += '.';
      this.lastDefensiveNote = 'Ponto decimal adicionado.';
    } else {
      this.lastDefensiveNote = 'Defesa: Múltiplos pontos decimais no mesmo número foram bloqueados!';
    }
  }

  public toggleSign(): void {
    this.lastAction = 'Inverter Sinal (±)';
    if (this.hasError || this.currentOperand === '0') {
      this.lastDefensiveNote = 'Inversão ignorada para zero ou estado de erro.';
      return;
    }

    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.slice(1);
      this.lastDefensiveNote = 'Número convertido para positivo.';
    } else {
      this.currentOperand = '-' + this.currentOperand;
      this.lastDefensiveNote = 'Número convertido para negativo.';
    }
  }

  public inputOperator(opSymbol: string): void {
    this.lastAction = `Operador [${opSymbol}]`;
    if (this.hasError) {
      this.resetAll();
    }

    const opMap: Record<string, string> = {
      '+': '+',
      '-': '-',
      '×': '*',
      '*': '*',
      '÷': '/',
      '/': '/',
    };

    if (this.isNewInput && this.expressionHistory) {
      const parts = this.expressionHistory.trim().split(' ');
      const lastToken = parts[parts.length - 1];
      if (lastToken && opMap[lastToken]) {
        parts[parts.length - 1] = opSymbol;
        this.expressionHistory = parts.join(' ') + ' ';
        this.lastDefensiveNote = `Defesa: Operador anterior substituído fluidamente por "${opSymbol}" sem crash ou duplicidade.`;
        return;
      }
    }

    const sanitized = this.sanitizeNumberString(this.currentOperand);

    if (!this.expressionHistory) {
      this.expressionHistory = `${sanitized} ${opSymbol} `;
      this.lastDefensiveNote = `Primeiro estágio armazenado: ${sanitized} ${opSymbol}`;
    } else {
      this.evaluateExpression(opSymbol);
    }

    this.isNewInput = true;
  }

  public calculateResult(): void {
    this.lastAction = 'Calcular Resultado (=)';
    if (this.hasError || !this.expressionHistory) {
      this.lastDefensiveNote = 'Cálculo ignorado: nenhuma expressão em andamento.';
      return;
    }

    this.evaluateExpression(null);
  }

  private evaluateExpression(intermediateNextOp: string | null): void {
    const sanitized = this.sanitizeNumberString(this.currentOperand);
    const fullExpr = `${this.expressionHistory}${sanitized}`;

    try {
      const tokens = fullExpr.trim().split(/\s+/);
      if (tokens.length < 3) return;

      const leftVal = parseFloat(tokens[0]);
      const opSym = tokens[1];
      const rightVal = parseFloat(tokens[2]);

      let result = 0;

      if (opSym === '+') {
        result = leftVal + rightVal;
      } else if (opSym === '-') {
        result = leftVal - rightVal;
      } else if (opSym === '*' || opSym === '×') {
        result = leftVal * rightVal;
      } else if (opSym === '/' || opSym === '÷') {
        if (rightVal === 0) {
          this.currentOperand = 'Indefinido';
          this.expressionHistory = `${fullExpr} =`;
          this.hasError = true;
          this.isNewInput = true;
          this.lastDefensiveNote = 'Defesa: Divisão por zero interceptada com sucesso! Exibindo "Indefinido".';
          return;
        }
        result = leftVal / rightVal;
      } else {
        this.currentOperand = 'Erro';
        this.hasError = true;
        this.lastDefensiveNote = `Operador não reconhecido: ${opSym}`;
        return;
      }

      const formattedResult = this.formatNumber(result);

      if (intermediateNextOp !== null) {
        this.expressionHistory = `${formattedResult} ${intermediateNextOp} `;
        this.currentOperand = formattedResult;
        this.lastDefensiveNote = `Operação encadeada intermediária avaliada: ${formattedResult} ${intermediateNextOp}`;
      } else {
        this.expressionHistory = `${fullExpr} =`;
        this.currentOperand = formattedResult;
        this.lastDefensiveNote = `Equação concluída com sucesso: ${fullExpr} = ${formattedResult}`;
      }

      this.isNewInput = true;
    } catch {
      this.currentOperand = 'Erro';
      this.hasError = true;
      this.isNewInput = true;
      this.lastDefensiveNote = 'Erro na avaliação da expressão.';
    }
  }

  private sanitizeNumberString(val: string): string {
    if (val.endsWith('.')) {
      return val.slice(0, -1);
    }
    return val;
  }

  private formatNumber(value: number): string {
    if (Number.isInteger(value) && Math.abs(value) < 1e14) {
      return value.toString();
    }
    // Trata imprecisão float IEEE 754 (ex: 0.1 + 0.2 = 0.3)
    const fixed = parseFloat(value.toPrecision(12));
    const str = fixed.toString();
    if (str === '-0') return '0';
    return str;
  }

  public getState(): CalculatorState {
    return {
      currentOperand: this.currentOperand,
      expressionHistory: this.expressionHistory,
      isNewInput: this.isNewInput,
      hasError: this.hasError,
      lastAction: this.lastAction,
      lastDefensiveNote: this.lastDefensiveNote,
    };
  }
}
