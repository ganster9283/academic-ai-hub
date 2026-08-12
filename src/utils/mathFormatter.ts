/**
 * Utility to clean raw LaTeX markup and format mathematical/scientific/economics notation
 * into clean, readable Unicode text for students on mobile and desktop screens.
 */

export function cleanMathAndMarkdown(str: string | undefined | null): string {
  if (!str) return '';

  let text = str;

  // 1. Remove LaTeX math environment delimiters
  text = text
    .replace(/\\begin\{equation\*?\}/gi, '')
    .replace(/\\end\{equation\*?\}/gi, '')
    .replace(/\\begin\{align\*?\}/gi, '')
    .replace(/\\end\{align\*?\}/gi, '')
    .replace(/\$\$/g, '')
    .replace(/\\\(|\\\)/g, '')
    .replace(/\\\[|\\\]/g, '');

  // 2. Remove \text{...}, \mathrm{...}, \mathbf{...}, \mathit{...}, \mathsf{...}
  text = text.replace(/\\(text|mathrm|mathbf|mathit|mathsf)\{([^}]+)\}/g, '$2');

  // 3. Convert \frac{a}{b} -> (a / b) or a / b (up to 3 passes for nested fractions)
  for (let pass = 0; pass < 3; pass++) {
    text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_match, num, den) => {
      const cleanNum = num.trim();
      const cleanDen = den.trim();
      const numFormatted = cleanNum.includes(' ') || cleanNum.includes('+') || cleanNum.includes('-') ? `(${cleanNum})` : cleanNum;
      const denFormatted = cleanDen.includes(' ') || cleanDen.includes('+') || cleanDen.includes('-') ? `(${cleanDen})` : cleanDen;
      return `${numFormatted} / ${denFormatted}`;
    });
  }

  // 4. Convert \sqrt{x} -> √(x)
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  text = text.replace(/\\sqrt\s*([a-zA-Z0-9]+)/g, '√$1');

  // 5. Greek letters & Math Symbols
  const replacements: [RegExp, string][] = [
    [/\\Delta/g, 'Δ'],
    [/\\delta/g, 'δ'],
    [/\\times/g, '×'],
    [/\\cdot/g, '·'],
    [/\\ast/g, '*'],
    [/\\pm/g, '±'],
    [/\\mp/g, '∓'],
    [/\\alpha/g, 'α'],
    [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'],
    [/\\theta/g, 'θ'],
    [/\\pi/g, 'π'],
    [/\\sigma/g, 'σ'],
    [/\\lambda/g, 'λ'],
    [/\\omega/g, 'ω'],
    [/\\phi/g, 'φ'],
    [/\\approx/g, '≈'],
    [/\\neq/g, '≠'],
    [/\\leq/g, '≤'],
    [/\\geq/g, '≥'],
    [/\\infty/g, '∞'],
    [/\\sum/g, '∑'],
    [/\\int/g, '∫'],
    [/\\rightarrow/g, '→'],
    [/\\leftarrow/g, '←'],
    [/\\leftrightarrow/g, '↔'],
    [/\\Rightarrow/g, '⇒'],
    [/\\Leftarrow/g, '⇐']
  ];

  for (const [regex, val] of replacements) {
    text = text.replace(regex, val);
  }

  // 6. Handle Superscripts & Subscripts
  const superMap: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁽', 'a': 'ᵃ', 'b': 'ᵇ',
    'c': 'ᶜ', 'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ'
  };

  text = text.replace(/\^\{([0-9a-zA-Z+-]+)\}/g, (_m, chars) => {
    return chars.split('').map((c: string) => superMap[c] || c).join('');
  });
  text = text.replace(/\^([0-9a-zA-Z])/g, (_m, c) => superMap[c] || `^${c}`);

  const subMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 'p': 'ₚ', 't': 'ₜ', 'l': 'ₗ', 'm': 'ₘ', 'k': 'ₖ'
  };

  text = text.replace(/_\{([0-9a-zA-Z]+)\}/g, (_m, chars) => {
    return chars.split('').map((c: string) => subMap[c] || c).join('');
  });
  text = text.replace(/_([0-9a-zA-Z])/g, (_m, c) => subMap[c] || `_${c}`);

  // 7. Remove single $ wrapped around simple equations like $Q = f(L, K)$
  text = text.replace(/\$([^$\n]+)\$/g, '$1');

  // 8. Fix Heading Numbering glitches like "1. ### 📖" -> "### 📖"
  text = text.replace(/^[0-9১-৯]+\.\s*(#{1,6}\s*)/gm, '$1');

  // 9. Fix missing newline before list items so numbered lists & bullets render cleanly
  text = text.replace(/([^\n])\s*([0-9১-৯]+\.\s+)/g, '$1\n$2');
  text = text.replace(/([^\n])\s*([•-]\s+)/g, '$1\n$2');

  // 10. Clean residual backslashes
  text = text.replace(/\\([_#$%&^~{}\\])/g, '$1');

  return text.trim();
}
