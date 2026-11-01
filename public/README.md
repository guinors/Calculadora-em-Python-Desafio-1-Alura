# Calculadora Gráfica Moderna em Python (Tkinter)

Uma calculadora gráfica moderna, funcional e robusta desenvolvida em **Python 3 nativo** utilizando a biblioteca gráfica padrão `tkinter`, sem qualquer dependência externa que necessite de instalação via `pip`. O projeto une rigor matemático, arquitetura orientada a objetos (OOP), tipagem estática (Type Hints - PEP 484), conformidade estrita com a **PEP 8** e um Design System refinado com hierarquia visual semântica.

---

## 1. Principais Componentes do Código Gerado

O código está estruturado segundo o princípio de **Responsabilidade Única (SRP)** e separação clara entre camada visual (GUI) e camada de negócio (Engine). Os componentes essenciais são:

### 1.1 `Theme` (`@dataclass(frozen=True)`)
Atua como o **Design Tokens / Central de Estilo** da aplicação:
- **Imutabilidade**: Implementado como dataclass congelada para evitar alterações de estado acidentais em tempo de execução.
- **Hierarquia Cromática Semântica**:
  - `BG_WINDOW` (`#121214`) e `BG_DISPLAY` (`#1A1A22`): Superfície dark mode de alto contraste com bordas refinadas (`#2A2A38`).
  - `BTN_NUM_*` (`#2B2D42`): Base operacional neutra para os dígitos `0-9` e o ponto `.`, transmitindo solidez e conforto ergonômico.
  - `BTN_OP_*` (`#2563EB`): Azul Safira / Índigo para operadores (`+`, `-`, `×`, `÷`), destacando ações de transformação matemática e lógica.
  - `BTN_CRIT_*` (`#DC2626`): Terracota / Vermelho Rubro fosco para ações destrutivas (`C` e `⌫`), alertando descarte de dados sem poluição visual.
  - `BTN_EQUAL_*` (`#059669`): Verde Esmeralda / Teal vibrante para o botão de resultado (`=`), simbolizando fechamento de ciclo e sucesso.
- **Tipografia Adaptativa**: Seleciona automaticamente `"Segoe UI"` em ambientes Windows e `"Helvetica"` em sistemas UNIX-like (macOS / Linux).

### 1.2 `CalculatorEngine`
O **núcleo matemático e máquina de estados** da aplicação, completamente desacoplado de interfaces gráficas:
- **Estado Interno**: Mantém `current_operand` (string do valor em edição ou exibição), `expression_history` (cadeia de cálculo anterior), `is_new_input` (flag de início de novo número) e `has_error` (flag de estado de erro).
- **Independência Tecnológica**: Pode ser instanciado em modo headless para testes automatizados, scripts de linha de comando ou migrações de backend sem depender de janelas X11.

### 1.3 `CalculatorButton` (Herdeiro de `tk.Button`)
Componente gráfico de botão com **microinterações de alta fidelidade**:
- Sobrescreve o comportamento padrão do `tkinter` com `relief="flat"`, `bd=0` e cursor estilizado `hand2`.
- Vincula eventos de ciclo de vida do ponteiro do mouse (`<Enter>` para hover e `<Leave>` para retorno ao estado original), proporcionando feedback tátil suave ao usuário.

### 1.4 `ModernCalculatorApp`
O **orquestrador visual e controlador de eventos**:
- Inicializa a janela principal (`tk.Tk`), definindo proporções mínimas (`320x480`) e pesos uniformes no layout de grade (`columnconfigure` e `rowconfigure` com `weight=1`).
- Monta o **Display Duplo**: linha superior com histórico atenuado (`#94A3B8`) e linha principal em alto contraste (`#F8F9FA`).
- Constrói o teclado com grid 4x5, atribuindo largura dupla (`colspan=2`) para a tecla de execução `=`.
- Gerencia a captura global de teclado físico via método `_handle_keypress`.

### 1.5 `run_unit_tests()` & `main()`
- **Auto-verificação Integrada**: Uma suíte de 5 testes unitários nativos acessível via terminal com a flag `--test` (`python3 calculadora.py --test`), validando divisão por zero, múltiplos pontos, troca de operadores e precisão flutuante antes de abrir a janela gráfica.
- **Inicialização Defensiva**: Checa a disponibilidade do `tkinter` e orienta o usuário caso o ambiente seja um terminal de servidor sem display X11.

---

## 2. Como a Aplicação Recebe os Números e Identifica a Operação Escolhida

A aplicação adota um modelo de **dupla entrada sincronizada**:

```
 [ Mouse / Toque na Tela ] ──► Callbacks de Botão (lambda) ──┐
                                                             ├──► CalculatorEngine ──► Sincronização da View
 [ Teclas Físicas do Teclado ] ──► Handler Global (_handle_keypress) ──┘
```

### 2.1 Entrada via Interface Gráfica (Mouse)
Cada botão instanciado na grade possui um parâmetro `command` configurado com expressões lambda ou referências diretas:
- **Dígitos**: `lambda: self._on_click_digit("7")` encaminha o caractere diretamente para `engine.input_digit()`.
- **Operadores**: `lambda: self._on_click_operator("×")` encaminha o símbolo visual.
- **Comandos Especiais**: Métodos dedicados `_on_click_clear`, `_on_click_backspace`, `_on_click_decimal` e `_on_click_equals`.

### 2.2 Entrada via Teclado Físico
A janela registra um listener global de teclas (`self.root.bind("<Key>", self._handle_keypress)`):
- O método inspeciona `event.char` e `event.keysym`.
- Mapeia caracteres numéricos (`0-9`) e pontuação (tanto `.` quanto `,` são aceitos para números decimais).
- Converte teclas de operação do teclado comum (`*` para `×` e `/` para `÷`).
- Captura teclas de comando: `Return` e `KP_Enter` para calcular (`=`), `BackSpace` para apagar (`⌫`), e `Escape` / `Delete` para resetar (`C`).

### 2.3 Identificação e Sanitização da Operação
A identificação da operação ocorre através de um dicionário imutável de operadores válidos:
```python
OPERATORS: Dict[str, str] = {
    "+": "+",
    "-": "-",
    "×": "*",
    "*": "*",
    "÷": "/",
    "/": "/",
}
```

Quando o usuário seleciona um operador:
1. **Verificação de Mudança de Ideia (Operadores Consecutivos)**: Se a flag `is_new_input` for verdadeira e já existir um operador no histórico (ex: o usuário digitou `5`, pressionou `+` e imediatamente pressionou `×`), o motor **substitui fluidamente** o operador anterior na expressão (`"5 × "`), sem gerar crash ou duplicidades inválidas como `5 + *`.
2. **Sanitização de Ponto Solto**: Caso o número termine em ponto (ex: `5.`), o método `_sanitize_number_string` remove o ponto órfão transformando-o em `5`.
3. **Avaliação Intermediária Encadeada**: Se já houver um cálculo pendente (ex: `5 + 3` e o usuário aperta `-`), a operação intermediária é calculada primeiro (`8 - `), mantendo a fluidez contínua da conta.

---

## 3. Como a Lógica de Programação Realiza os Cálculos e Apresenta os Resultados

Toda a resolução matemática é conduzida por lógica algorítmica estrita, **sem o uso de `eval()` irrestrito**, eliminando riscos de segurança e garantindo tratamento defensivo ponta a ponta.

### 3.1 Ciclo de Avaliação Aritmética
Quando a tecla `=` é acionada (ou em cálculos encadeados), o método `_evaluate_expression()` é executado:

1. **Montagem da Expressão**:
   A expressão completa é construída unindo o histórico acumulado com o operando corrente sanitizado:
   ```python
   full_expr = f"{self.expression_history}{sanitized_operand}" # Ex: "12 ÷ 4"
   ```
2. **Tokenização Segura**:
   A string é separada por espaços em tokens (`tokens = full_expr.split()`), extraindo com precisão:
   - `left_val = float(tokens[0])`
   - `op_sym = tokens[1]`
   - `right_val = float(tokens[2])`

3. **Despacho Condicional da Operação**:
   ```python
   if op_sym in ("+",):
       result = left_val + right_val
   elif op_sym in ("-",):
       result = left_val - right_val
   elif op_sym in ("*", "×"):
       result = left_val * right_val
   elif op_sym in ("/", "÷"):
       # Proteção contra Divisão por Zero
       if right_val == 0.0:
           self.current_operand = "Indefinido"
           self.expression_history = full_expr + " ="
           self.has_error = True
           self.is_new_input = True
           return
       result = left_val / right_val
   ```

### 3.2 Tratamento Defensivo de Casos Críticos
- **Divisão por Zero**: Se o divisor for `0.0`, a divisão nativa do Python é abortada preventivamente antes que ocorra uma exceção `ZeroDivisionError`. O display principal recebe o texto **`"Indefinido"`**, a flag `has_error` é ativada e a próxima tecla numérica reinicia o ciclo limpo automaticamente.
- **Controle de Ponto Decimal**: A inserção de ponto decimal verifica `if "." not in self.current_operand:`. Caso já exista um ponto, a solicitação é silenciosamente descartada, impedindo números sintaticamente inválidos como `3.14.9`.
- **Suporte a Números Negativos**: O método `toggle_sign()` insere ou remove o caractere `-` do início da string. Se o operando for `"0"`, a inversão é ignorada. Ao apagar com `backspace` um número negativo de um dígito (ex: `"-5"`), o valor retorna defensivamente para `"0"`.
- **Prevenção de Overflow e Exceções Inesperadas**: Blocos `try ... except (ValueError, OverflowError)` interceptam estouros de representação numérica, exibindo `"Overflow"` ou `"Erro"`.

### 3.3 Mitigação de Ruído Flutuante (Padrão IEEE 754)
Cálculos binários de ponto flutuante podem introduzir resíduos como `0.1 + 0.2 = 0.30000000000000004`. O método estático `_format_number` trata essa anomalia:
```python
@staticmethod
def _format_number(value: float) -> str:
    # Se for inteiro exato, exibe sem o sufixo .0 (ex: 8.0 -> "8")
    if value.is_integer() and abs(value) < 1e14:
        return str(int(value))
    # Arredonda resíduos mantendo até 10 casas decimais significativas e descarta zeros à direita
    formatted = f"{value:.10f}".rstrip("0").rstrip(".")
    if formatted == "-0":
        return "0"
    return formatted
```

### 3.4 Apresentação e Sincronização com o Display
Após cada ação, o método `_update_display()` atualiza a camada de visão:
- O rótulo superior (`history_label`) exibe a expressão com o símbolo de igualdade final (ex: `12 + 8 =`).
- O rótulo inferior (`main_label`) exibe o resultado formatado em tipografia proeminente (28pt negrito).
- **Feedback Cognitivo de Erro**: Caso `engine.has_error` seja verdadeiro, a cor da fonte do display comuta de `#F8F9FA` para `#FCA5A5` (vermelho suave), fornecendo clareza imediata sobre o estado anômalo antes de voltar ao normal no próximo cálculo.

---

## 4. Instruções de Execução

### Modo Gráfico (Desktop):
```bash
python3 calculadora.py
# ou no Windows:
python calculadora.py
```

### Modo de Testes Automatizados (CLI Headless):
```bash
python3 calculadora.py --test
```
Saída esperada:
```
▶ Executando bateria de testes unitários defensivos...
✔ Todos os 5 testes de integridade passaram com sucesso!
```
