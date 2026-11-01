#!/usr/bin/env python3
"""
================================================================================
Calculadora Gráfica Moderna em Python (Tkinter)
================================================================================
Desenvolvida por: Engenheiro de Software Sênior & Designer de UI/UX
Arquitetura: Orientada a Objetos (OOP) com Separação de Lógica de Negócio e GUI
Padrão de Código: PEP 8 com Tipagem Estática Completa (Type Hints)
Dependências: NENHUMA dependência externa. 100% biblioteca nativa `tkinter`.

Hierarquia Visual e Teoria das Cores Aplicada:
- Fundo & Janela:    #121214 (Grafite Escuro / Ardósia Profundo)
- Display:           #1E1E24 com texto em #F8F9FA (Alto contraste e legibilidade)
- Teclas Numéricas:  #2B2D42 (Neutro sóbrio, transmite solidez e conforto visual)
- Operadores:        #2563EB (Azul Safira/Índigo, transmite lógica e precisão matemática)
- Ações Críticas:    #DC2626 (Terracota/Vermelho Rubro fosco, alerta sem estridência)
- Execução (=):      #059669 (Verde Esmeralda/Teal, denota sucesso e conclusão)
================================================================================
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from typing import Any, Callable, Dict, Optional, Tuple

try:
    import tkinter as tk
    from tkinter import font
except ImportError:
    tk = None  # Permite execução do motor de cálculo em ambientes headless (--test)




# ==============================================================================
# CONFIGURAÇÃO DE DESIGN SYSTEM E PALETA DE CORES
# ==============================================================================
@dataclass(frozen=True)
class Theme:
    """Design System com paleta de cores calibrada para máxima ergonomia visual."""
    # Janela e Display
    BG_WINDOW: str = "#121214"
    BG_DISPLAY: str = "#1A1A22"
    TEXT_MAIN: str = "#F8F9FA"
    TEXT_MUTED: str = "#94A3B8"
    BORDER_COLOR: str = "#2A2A38"

    # Teclas Numéricas e Ponto (Base Neutra)
    BTN_NUM_BG: str = "#2B2D42"
    BTN_NUM_HOVER: str = "#383B56"
    BTN_NUM_ACTIVE: str = "#222435"
    BTN_NUM_FG: str = "#F8F9FA"

    # Operadores Aritméticos (+, -, ×, ÷) (Lógica e Transformação)
    BTN_OP_BG: str = "#2563EB"
    BTN_OP_HOVER: str = "#3B82F6"
    BTN_OP_ACTIVE: str = "#1D4ED8"
    BTN_OP_FG: str = "#FFFFFF"

    # Ações Críticas / Reset (C, ⌫) (Ação Destrutiva Consciente)
    BTN_CRIT_BG: str = "#DC2626"
    BTN_CRIT_HOVER: str = "#EF4444"
    BTN_CRIT_ACTIVE: str = "#B91C1C"
    BTN_CRIT_FG: str = "#FFFFFF"

    # Execução / Resultado (=) (Conclusão e Aprovação)
    BTN_EQUAL_BG: str = "#059669"
    BTN_EQUAL_HOVER: str = "#10B981"
    BTN_EQUAL_ACTIVE: str = "#047857"
    BTN_EQUAL_FG: str = "#FFFFFF"

    # Tecla de Inversão de Sinal (±)
    BTN_SPECIAL_BG: str = "#1E293B"
    BTN_SPECIAL_HOVER: str = "#334155"
    BTN_SPECIAL_ACTIVE: str = "#0F172A"
    BTN_SPECIAL_FG: str = "#E2E8F0"

    # Fontes
    FONT_FAMILY: str = "Helvetica" if sys.platform != "win32" else "Segoe UI"
    FONT_DISPLAY_MAIN: Tuple[str, int, str] = (FONT_FAMILY, 28, "bold")
    FONT_DISPLAY_HIST: Tuple[str, int, str] = (FONT_FAMILY, 13, "normal")
    FONT_BUTTON: Tuple[str, int, str] = (FONT_FAMILY, 15, "bold")


THEME = Theme()


# ==============================================================================
# MOTOR DE CÁLCULO E REGRAS DEFENSIVAS (ENGINE)
# ==============================================================================
class CalculatorEngine:
    """
    Núcleo matemático defensivo responsável pelo controle de estado, sanitização
    de entradas, prevenção de anomalias sintáticas e avaliação aritmética segura.
    """

    OPERATORS: Dict[str, str] = {
        "+": "+",
        "-": "-",
        "×": "*",
        "*": "*",
        "÷": "/",
        "/": "/",
    }

    def __init__(self) -> None:
        self.current_operand: str = "0"
        self.expression_history: str = ""
        self.is_new_input: bool = True
        self.has_error: bool = False

    def reset_all(self) -> None:
        """Limpa todo o estado da calculadora (Ação da tecla C)."""
        self.current_operand = "0"
        self.expression_history = ""
        self.is_new_input = True
        self.has_error = False

    def backspace(self) -> None:
        """Remove o último dígito do operando atual (Ação da tecla ⌫)."""
        if self.has_error:
            self.reset_all()
            return

        if self.is_new_input:
            return

        if len(self.current_operand) > 1:
            # Caso especial: se restar apenas o sinal negativo, volta para "0"
            if len(self.current_operand) == 2 and self.current_operand.startswith("-"):
                self.current_operand = "0"
                self.is_new_input = True
            else:
                self.current_operand = self.current_operand[:-1]
        else:
            self.current_operand = "0"
            self.is_new_input = True

    def input_digit(self, digit: str) -> None:
        """Adiciona um dígito numérico (0-9) ao operando atual com validação."""
        if self.has_error:
            self.reset_all()

        if self.is_new_input:
            self.current_operand = digit
            self.is_new_input = False
        else:
            if self.current_operand == "0":
                self.current_operand = digit
            else:
                # Limite ergonômico de 16 caracteres para manter legibilidade visual
                if len(self.current_operand) < 16:
                    self.current_operand += digit

    def input_decimal_point(self) -> None:
        """Insere o ponto decimal impedindo múltiplos pontos no mesmo operando."""
        if self.has_error:
            self.reset_all()

        if self.is_new_input:
            self.current_operand = "0."
            self.is_new_input = False
            return

        # Defesa: Impede inserção de múltiplos pontos no mesmo operando
        if "." not in self.current_operand:
            self.current_operand += "."

    def toggle_sign(self) -> None:
        """Alterna o sinal do número atual entre positivo e negativo (±)."""
        if self.has_error or self.current_operand == "0":
            return

        if self.current_operand.startswith("-"):
            self.current_operand = self.current_operand[1:]
        else:
            self.current_operand = "-" + self.current_operand

    def input_operator(self, op_symbol: str) -> None:
        """
        Recebe um operador aritmético (+, -, ×, ÷).
        Substitui de forma fluida operadores consecutivos se o usuário mudar de ideia,
        e resolve operações encadeadas em tempo real mantendo histórico claro.
        """
        if self.has_error:
            self.reset_all()

        # Se já tínhamos um histórico aguardando número e o usuário clica outro operador,
        # simplesmente substituímos o operador anterior sem gerar crash ou duplicidade.
        if self.is_new_input and self.expression_history:
            parts = self.expression_history.rstrip().split()
            if parts and parts[-1] in self.OPERATORS:
                parts[-1] = op_symbol
                self.expression_history = " ".join(parts) + " "
                return

        # Sanitiza operando terminado com ponto solto (ex: "5." -> "5")
        sanitized_operand = self._sanitize_number_string(self.current_operand)

        if not self.expression_history:
            self.expression_history = f"{sanitized_operand} {op_symbol} "
        else:
            # Caso tenhamos uma expressão em andamento, avalia o estágio intermediário
            self._evaluate_expression(intermediate_next_op=op_symbol)

        self.is_new_input = True

    def calculate_result(self) -> None:
        """Finaliza a equação, computando o resultado final (Ação da tecla =)."""
        if self.has_error or not self.expression_history:
            return

        self._evaluate_expression(intermediate_next_op=None)

    def _evaluate_expression(self, intermediate_next_op: Optional[str] = None) -> None:
        """
        Avalia a expressão de forma estritamente segura sem usar `eval()` irrestrito,
        com tratamento rigoroso para divisão por zero e overflow.
        """
        sanitized_operand = self._sanitize_number_string(self.current_operand)
        full_expr = f"{self.expression_history}{sanitized_operand}"

        try:
            tokens = full_expr.split()
            if len(tokens) < 3:
                return

            # Avaliação controlada de operadores da esquerda para a direita
            left_val = float(tokens[0])
            op_sym = tokens[1]
            right_val = float(tokens[2])

            result: float = 0.0

            if op_sym in ("+",):
                result = left_val + right_val
            elif op_sym in ("-",):
                result = left_val - right_val
            elif op_sym in ("*", "×"):
                result = left_val * right_val
            elif op_sym in ("/", "÷"):
                # Defesa crítica contra Divisão por Zero
                if right_val == 0.0:
                    self.current_operand = "Indefinido"
                    self.expression_history = full_expr + " ="
                    self.has_error = True
                    self.is_new_input = True
                    return
                result = left_val / right_val
            else:
                self.current_operand = "Erro"
                self.has_error = True
                return

            # Formata e sanitiza precisão decimal IEEE 754 (evita artefatos como 0.30000000000000004)
            formatted_result = self._format_number(result)

            if intermediate_next_op is not None:
                self.expression_history = f"{formatted_result} {intermediate_next_op} "
                self.current_operand = formatted_result
            else:
                self.expression_history = f"{full_expr} ="
                self.current_operand = formatted_result

            self.is_new_input = True

        except (ValueError, OverflowError):
            self.current_operand = "Overflow"
            self.has_error = True
            self.is_new_input = True
        except Exception:
            self.current_operand = "Erro"
            self.has_error = True
            self.is_new_input = True

    @staticmethod
    def _sanitize_number_string(val: str) -> str:
        """Limpa pontos soltos ou valores incompletos no número."""
        if val.endswith("."):
            return val[:-1]
        return val

    @staticmethod
    def _format_number(value: float) -> str:
        """Formata o número com máxima elegância eliminando sufixos .0 desnecessários."""
        if value.is_integer() and abs(value) < 1e14:
            return str(int(value))
        # Formata com até 10 casas decimais eliminando zeros à direita
        formatted = f"{value:.10f}".rstrip("0").rstrip(".")
        if formatted == "-0":
            return "0"
        return formatted


_BaseButton = tk.Button if tk is not None else object


class CalculatorButton(_BaseButton):
    """
    Botão estilizado com estados dinâmicos (Normal, Hover e Pressed).
    Implementa microinterações suaves via eventos <Enter> e <Leave>.
    """

    def __init__(
        self,
        master: tk.Widget,
        text: str,
        command: Callable[[], None],
        bg: str,
        hover_bg: str,
        active_bg: str,
        fg: str,
        font: Tuple[str, int, str] = THEME.FONT_BUTTON,
        **kwargs: Any,
    ) -> None:
        self.normal_bg = bg
        self.hover_bg = hover_bg
        self.active_bg = active_bg
        self.fg_color = fg

        super().__init__(
            master,
            text=text,
            command=command,
            font=font,
            bg=self.normal_bg,
            fg=self.fg_color,
            activebackground=self.active_bg,
            activeforeground=self.fg_color,
            relief="flat",
            bd=0,
            cursor="hand2",
            highlightthickness=0,
            padx=12,
            pady=14,
            **kwargs,
        )

        # Microinterações Visuais: Hover States
        self.bind("<Enter>", self._on_enter)
        self.bind("<Leave>", self._on_leave)

    def _on_enter(self, _event: tk.Event[Any]) -> None:
        """Acionado ao passar o mouse por cima do botão."""
        self.configure(bg=self.hover_bg)

    def _on_leave(self, _event: tk.Event[Any]) -> None:
        """Acionado ao retirar o mouse do botão."""
        self.configure(bg=self.normal_bg)


# ==============================================================================
# INTERFACE GRÁFICA PRINCIPAL (TKINTER GUI)
# ==============================================================================
class ModernCalculatorApp:
    """
    Aplicação principal da Calculadora Gráfica Tkinter.
    Orquestra o layout visual, hierarquia de componentes e captura de eventos do teclado.
    """

    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.engine = CalculatorEngine()

        self._setup_window()
        self._build_display()
        self._build_keypad()
        self._bind_keyboard_events()
        self._update_display()

    def _setup_window(self) -> None:
        """Configurações da janela da aplicação com foco em proporção e identidade."""
        self.root.title("Calculadora")
        self.root.geometry("360x520")
        self.root.minsize(320, 480)
        self.root.configure(bg=THEME.BG_WINDOW)

        # Configura proporções dinâmicas de redimensionamento
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=0)  # Display fixo ergonômico
        self.root.rowconfigure(1, weight=1)  # Teclado proporcional expande

    def _build_display(self) -> None:
        """
        Constrói o painel de display digital com alto contraste e hierarquia dupla:
        - Linha Superior: Histórico da expressão em cor atenuada (#94A3B8)
        - Linha Principal: Operando atual / Resultado em alto contraste (#F8F9FA)
        """
        self.display_container = tk.Frame(
            self.root,
            bg=THEME.BG_DISPLAY,
            bd=0,
            highlightbackground=THEME.BORDER_COLOR,
            highlightthickness=1,
            padx=20,
            pady=16,
        )
        self.display_container.grid(row=0, column=0, sticky="nsew", padx=14, pady=(16, 10))
        self.display_container.columnconfigure(0, weight=1)

        # Histórico da Expressão (Sub-display)
        self.history_label = tk.Label(
            self.display_container,
            text="",
            font=THEME.FONT_DISPLAY_HIST,
            bg=THEME.BG_DISPLAY,
            fg=THEME.TEXT_MUTED,
            anchor="e",
        )
        self.history_label.grid(row=0, column=0, sticky="ew", pady=(0, 4))

        # Dígito Principal / Resultado
        self.main_label = tk.Label(
            self.display_container,
            text="0",
            font=THEME.FONT_DISPLAY_MAIN,
            bg=THEME.BG_DISPLAY,
            fg=THEME.TEXT_MAIN,
            anchor="e",
        )
        self.main_label.grid(row=1, column=0, sticky="ew")

    def _build_keypad(self) -> None:
        """
        Constrói a grade de botões (Keypad) aplicando a paleta semântica estrita:
        - Destrutivos/Limpeza: C e ⌫ (Vermelho Rubro / Terracota)
        - Operadores: ÷, ×, -, + (Azul Safira / Índigo)
        - Numéricos e Ponto: 0 a 9, . (Cinza-azulado Escuro / Neutro)
        - Execução: = (Verde Esmeralda)
        """
        keypad_frame = tk.Frame(self.root, bg=THEME.BG_WINDOW, padx=14, pady=10)
        keypad_frame.grid(row=1, column=0, sticky="nsew")

        # 4 colunas de largura idêntica
        for col_idx in range(4):
            keypad_frame.columnconfigure(col_idx, weight=1, uniform="buttons")

        # 5 linhas de altura idêntica
        for row_idx in range(5):
            keypad_frame.rowconfigure(row_idx, weight=1, uniform="buttons")

        # Definição do layout da calculadora com design semântico
        # Formato da tupla: (texto_exibido, comando_acao, cor_fundo, cor_hover, cor_active, cor_texto)
        button_specs = [
            # Linha 0: Ações Críticas de Limpeza, Inversão e Divisão
            [
                ("C", self._on_click_clear, THEME.BTN_CRIT_BG, THEME.BTN_CRIT_HOVER, THEME.BTN_CRIT_ACTIVE, THEME.BTN_CRIT_FG),
                ("⌫", self._on_click_backspace, THEME.BTN_CRIT_BG, THEME.BTN_CRIT_HOVER, THEME.BTN_CRIT_ACTIVE, THEME.BTN_CRIT_FG),
                ("±", self._on_click_toggle_sign, THEME.BTN_SPECIAL_BG, THEME.BTN_SPECIAL_HOVER, THEME.BTN_SPECIAL_ACTIVE, THEME.BTN_SPECIAL_FG),
                ("÷", lambda: self._on_click_operator("÷"), THEME.BTN_OP_BG, THEME.BTN_OP_HOVER, THEME.BTN_OP_ACTIVE, THEME.BTN_OP_FG),
            ],
            # Linha 1: 7, 8, 9 e Multiplicação
            [
                ("7", lambda: self._on_click_digit("7"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("8", lambda: self._on_click_digit("8"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("9", lambda: self._on_click_digit("9"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("×", lambda: self._on_click_operator("×"), THEME.BTN_OP_BG, THEME.BTN_OP_HOVER, THEME.BTN_OP_ACTIVE, THEME.BTN_OP_FG),
            ],
            # Linha 2: 4, 5, 6 e Subtração
            [
                ("4", lambda: self._on_click_digit("4"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("5", lambda: self._on_click_digit("5"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("6", lambda: self._on_click_digit("6"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("-", lambda: self._on_click_operator("-"), THEME.BTN_OP_BG, THEME.BTN_OP_HOVER, THEME.BTN_OP_ACTIVE, THEME.BTN_OP_FG),
            ],
            # Linha 3: 1, 2, 3 e Adição
            [
                ("1", lambda: self._on_click_digit("1"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("2", lambda: self._on_click_digit("2"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("3", lambda: self._on_click_digit("3"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("+", lambda: self._on_click_operator("+"), THEME.BTN_OP_BG, THEME.BTN_OP_HOVER, THEME.BTN_OP_ACTIVE, THEME.BTN_OP_FG),
            ],
            # Linha 4: 0, Ponto Decimal e Execução (=)
            [
                ("0", lambda: self._on_click_digit("0"), THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                (".", self._on_click_decimal, THEME.BTN_NUM_BG, THEME.BTN_NUM_HOVER, THEME.BTN_NUM_ACTIVE, THEME.BTN_NUM_FG),
                ("=", self._on_click_equals, THEME.BTN_EQUAL_BG, THEME.BTN_EQUAL_HOVER, THEME.BTN_EQUAL_ACTIVE, THEME.BTN_EQUAL_FG),
            ],
        ]

        # Posicionamento estruturado na grade com padding balanceado
        for r_idx, row in enumerate(button_specs):
            c_idx = 0
            for item in row:
                text, command, bg, hover_bg, active_bg, fg = item
                colspan = 2 if text == "=" and len(row) == 3 and c_idx == 2 else 1

                btn = CalculatorButton(
                    master=keypad_frame,
                    text=text,
                    command=command,
                    bg=bg,
                    hover_bg=hover_bg,
                    active_bg=active_bg,
                    fg=fg,
                )
                btn.grid(
                    row=r_idx,
                    column=c_idx,
                    columnspan=colspan,
                    sticky="nsew",
                    padx=4,
                    pady=4,
                )
                c_idx += colspan

    def _bind_keyboard_events(self) -> None:
        """
        Adiciona suporte completo ao teclado físico do computador:
        - Dígitos 0 a 9 e ponto (.)
        - Operadores (+, -, *, /)
        - Enter e Keypad Enter para calcular (=)
        - Backspace para apagar último dígito (⌫)
        - Escape e Delete para limpar tudo (C)
        """
        self.root.bind("<Key>", self._handle_keypress)

    def _handle_keypress(self, event: tk.Event[Any]) -> None:
        """Trata e roteia os atalhos físicos do teclado com total integridade."""
        char = event.char
        keysym = event.keysym

        if char in "0123456789":
            self._on_click_digit(char)
        elif char == "." or char == ",":
            self._on_click_decimal()
        elif char in ("+", "-"):
            self._on_click_operator(char)
        elif char == "*":
            self._on_click_operator("×")
        elif char == "/":
            self._on_click_operator("÷")
        elif keysym in ("Return", "KP_Enter") or char == "=":
            self._on_click_equals()
        elif keysym == "BackSpace":
            self._on_click_backspace()
        elif keysym in ("Escape", "Delete"):
            self._on_click_clear()

    # --- Ações de Disparo e Sincronização com a View ---
    def _on_click_digit(self, digit: str) -> None:
        self.engine.input_digit(digit)
        self._update_display()

    def _on_click_decimal(self) -> None:
        self.engine.input_decimal_point()
        self._update_display()

    def _on_click_operator(self, op: str) -> None:
        self.engine.input_operator(op)
        self._update_display()

    def _on_click_equals(self) -> None:
        self.engine.calculate_result()
        self._update_display()

    def _on_click_clear(self) -> None:
        self.engine.reset_all()
        self._update_display()

    def _on_click_backspace(self) -> None:
        self.engine.backspace()
        self._update_display()

    def _on_click_toggle_sign(self) -> None:
        self.engine.toggle_sign()
        self._update_display()

    def _update_display(self) -> None:
        """Sincroniza os textos dos labels do display com o estado interno do motor."""
        self.history_label.configure(text=self.engine.expression_history)
        self.main_label.configure(text=self.engine.current_operand)

        # Se for estado de erro, destaca sutilmente a cor do texto do display
        if self.engine.has_error:
            self.main_label.configure(fg="#FCA5A5")  # Vermelho claro suave para alerta
        else:
            self.main_label.configure(fg=THEME.TEXT_MAIN)


# ==============================================================================
# BATERIA DE TESTES DE INTEGRIDADE (AUTO-VERIFICAÇÃO)
# ==============================================================================
def run_unit_tests() -> None:
    """Executa testes unitários automatizados da lógica defensiva do motor."""
    print("▶ Executando bateria de testes unitários defensivos...")
    engine = CalculatorEngine()

    # Teste 1: Adição básica
    engine.input_digit("5")
    engine.input_operator("+")
    engine.input_digit("3")
    engine.calculate_result()
    assert engine.current_operand == "8", f"Falha na soma: {engine.current_operand}"

    # Teste 2: Divisão por Zero segura
    engine.reset_all()
    engine.input_digit("9")
    engine.input_operator("÷")
    engine.input_digit("0")
    engine.calculate_result()
    assert engine.current_operand == "Indefinido" and engine.has_error, "Falha na divisão por zero"

    # Teste 3: Prevenção de múltiplos pontos decimais
    engine.reset_all()
    engine.input_digit("3")
    engine.input_decimal_point()
    engine.input_digit("1")
    engine.input_decimal_point()  # Deve ser ignorado
    engine.input_digit("4")
    assert engine.current_operand == "3.14", f"Falha no ponto decimal: {engine.current_operand}"

    # Teste 4: Substituição fluida de operador consecutivo (5 + -> 5 × 2 = 10)
    engine.reset_all()
    engine.input_digit("5")
    engine.input_operator("+")
    engine.input_operator("×")  # Usuário corrigiu de soma para multiplicação
    engine.input_digit("2")
    engine.calculate_result()
    assert engine.current_operand == "10", f"Falha na troca de operador: {engine.current_operand}"

    # Teste 5: Precisão de ponto flutuante (0.1 + 0.2 = 0.3)
    engine.reset_all()
    engine.input_digit("0")
    engine.input_decimal_point()
    engine.input_digit("1")
    engine.input_operator("+")
    engine.input_digit("0")
    engine.input_decimal_point()
    engine.input_digit("2")
    engine.calculate_result()
    assert engine.current_operand == "0.3", f"Falha no arredondamento flutuante: {engine.current_operand}"

    print("✔ Todos os 5 testes de integridade passaram com sucesso!")


# ==============================================================================
# PONTO DE ENTRADA PRINCIPAL (MAIN ENTRY POINT)
# ==============================================================================
def main() -> None:
    """Função principal que inicializa o loop de eventos Tkinter."""
    if "--test" in sys.argv:
        run_unit_tests()
        return

    if tk is None:
        print("=" * 70)
        print("Calculadora Gráfica em Python (Tkinter)")
        print("=" * 70)
        print("Aviso: 'tkinter' não está disponível neste ambiente (típico de contêineres headless).")
        print("Em desktops normais (Windows, macOS), o Tkinter já vem pré-instalado com o Python.")
        print("No Linux Ubuntu/Debian, instale com: sudo apt install python3-tk")
        print("\nPara executar os testes unitários defensivos sem GUI:")
        print("  python3 calculadora.py --test\n")
        sys.exit(1)

    root = tk.Tk()
    _app = ModernCalculatorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
