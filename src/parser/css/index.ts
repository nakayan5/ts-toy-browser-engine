import assert from 'assert';
import {
  type ToySelector,
  type ToyRule,
  type ToyStylesheet,
  type ToyDeclaration,
  type Value,
  type Color,
  type Length,
} from '../../types/stylesheet';

/**
 * CSSを解析する
 * @param source '<div>...</div>'
 * @returns
 */
export const parse = (source: string): ToyStylesheet => {
  const rules = new Parser(source).parseRules();

  return {
    rules,
  };
};

class Parser {
  private pos: number;
  private readonly input: string;

  constructor(input: string) {
    this.pos = 0;
    this.input = input;
  }

  parseRules(): ToyRule[] {
    const rules: ToyRule[] = [];
    while (true) {
      this.consumeWhitespace();
      if (this.eof()) {
        break;
      }

      const selectors = this.parseSelectors();
      const declarations = this.parseDeclarations();
      this.consumeChar(); // consume '}'
      rules.push({
        selectors,
        declarations,
      });
    }

    return rules;
  }

  /** selectorをparseする */
  private parseSelectors(): ToySelector[] {
    const selectors: ToySelector[] = [];
    while (true) {
      selectors.push(this.parseSelector());
      this.consumeWhitespace();
      if (this.nextChar() === '{') {
        break;
      }
      // this.consumeChar();
    }
    return selectors;
  }

  /** */
  private parseSelector(): ToySelector {
    const selector: ToySelector = {
      tagName: '',
      id: '',
      class: [],
    };
    const nextChar = this.nextChar();
    switch (nextChar) {
      case '#':
        this.consumeChar();
        selector.id = this.parseIdentifier();
        break;
      case '.':
        this.consumeChar();
        selector.class.push(this.parseIdentifier());
        break;
      case '*':
        this.consumeChar();
        break;
      default:
        if (this.validIdentifierChar(nextChar)) {
          selector.tagName = this.parseIdentifier();
        }
        break;
    }

    return selector;
  }

  private parseIdentifier(t?: boolean): string {
    const value = this.consumeWhile((char) => {
      return this.validIdentifierChar(char);
    });

    return value;
  }

  // q: 次の関数は何をしているのか？
  // a: 次の関数は、identifierの文字が有効かどうかを判定している
  private validIdentifierChar(char: string): boolean {
    return /[a-zA-Z0-9\-_]/.test(char);
  }

  /** propertyとvalueをparseする */
  private parseDeclarations(): ToyDeclaration[] {
    assert.strictEqual(this.consumeChar(), '{');
    const declarations: ToyDeclaration[] = [];
    while (true) {
      this.consumeWhitespace();
      if (this.nextChar() === '}') {
        console.log('break');
        break;
      }
      declarations.push(this.parseDeclaration());
      this.consumeWhitespace();
      assert(this.nextChar() === ';');
      this.consumeChar();
    }
    return declarations;
  }

  private parseDeclaration(): ToyDeclaration {
    const propertyName = this.parseIdentifier(true);
    this.consumeWhitespace();
    assert(this.nextChar() === ':');
    this.consumeChar();
    this.consumeWhitespace();
    const value = this.parseValue();

    console.log({ propertyName, value });

    return {
      name: propertyName,
      value,
    };
  }

  private parseValue(): Value {
    const nextChar = this.nextChar();
    // console.log({ nextChar });
    switch (true) {
      case /\d/.test(nextChar):
        return this.parseLength();
      case nextChar.includes('#'):
        return this.parseColor();
      default:
        return this.parseIdentifier();
    }
  }

  private parseColor(): Color {
    assert(this.consumeChar() === '#');
    return {
      r: this.parseHexPair(),
      g: this.parseHexPair(),
      b: this.parseHexPair(),
      a: 255,
    };
  }

  // 2桁の16進数をパースする
  private parseHexPair(): number {
    const hex = this.input.substring(this.pos, this.pos + 2);
    this.pos += 2;
    return parseInt(hex, 16);
  }

  private parseLength(): Length {
    const num = this.parseNumber();
    const unit = this.parseUnit();
    return [num, unit];
  }

  private parseNumber(): number {
    return parseInt(
      this.consumeWhile((char) => {
        return /^[0-9]$/.test(char);
      }),
    );
  }

  private parseUnit(): 'px' {
    const unit = this.consumeWhile((char) => {
      return /^[a-z]$/.test(char);
    });
    assert(unit === 'px');
    return 'px';
  }

  /** 0個以上の空白文字を消費して捨てる。 */
  private consumeWhitespace(): void {
    this.consumeWhile((char) => {
      return char === ' ' || char === '\n';
    });
  }

  /** 指定された条件（test関数）がtrueを返す間、文字を消費し続けます。 */
  private consumeWhile(test: (arg0: string) => boolean): string {
    let result = '';
    while (!this.eof() && test(this.nextChar())) {
      result += this.consumeChar();
    }
    return result;
  }

  /**
   * 文字を消費する
   * @description this.posをインクリメントする
   */
  private consumeChar(): string {
    const char = this.nextChar();
    this.pos++;
    return char;
  }

  /** 現在の解析位置にある文字を返す */
  private nextChar(): string {
    return this.input.substring(this.pos, this.pos + 1);
  }

  /** 入力文字列がすべて消費されたかどうかを判断する。 */
  private eof(): boolean {
    return this.pos >= this.input.length;
  }
}
