import {
  type ToySelector,
  type ToyRule,
  type ToyStylesheet,
  type ToyDeclaration,
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
      // TODO: 後でthis.posを消す
      if (this.eof() || this.pos === 3) {
        break;
      }

      const selectors = this.parseSelectors();
      // this.consumeChar(); // consume '{'
      // const declarations = this.parseDeclarations();
      // this.consumeChar(); // consume '}'
      rules.push({
        selectors,
        declarations: [],
      });
    }

    return rules;
  }

  /** selectorをparseする */
  private parseSelectors(): ToySelector[] {
    const selectors: ToySelector[] = [];
    while (true) {
      selectors.push(this.parseSimpleSelector());
      this.consumeWhitespace();
      if (this.nextChar() === '{') {
        break;
      }
      // this.consumeChar();
    }
    return selectors;
  }

  /** */
  private parseSimpleSelector(): ToySelector {
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

  /**  */
  private parseIdentifier(): string {
    return this.consumeWhile((char) => {
      return this.validIdentifierChar(char);
    });
  }

  /**  */
  private validIdentifierChar(char: string): boolean {
    return /^[a-zA-Z0-9\-_]$/.test(char);
  }

  /** propertyとvalueをparseする */
  private parseDeclarations(): ToyDeclaration[] {
    const declarations: ToyDeclaration[] = [];

    while (true) {
      this.consumeWhitespace();
      if (this.nextChar() === '}') {
        this.consumeChar();
        break;
      }
      declarations.push(this.parseDeclaration());
    }

    return declarations;
  }

  private parseDeclaration(): ToyDeclaration {
    const declaration: ToyDeclaration = {
      name: '',
      value: '',
    };

    return declaration;
  }

  /** 0個以上の空白文字を消費して捨てる。 */
  private consumeWhitespace(): void {
    this.consumeWhile((char) => {
      return char === ' ' || char === '\n';
    });
  }

  // private consumeWhitespace(): void {
  //   this.consumeWhile((char) => /\s/.test(char));
  // }

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
