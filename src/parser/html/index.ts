import { type ToyNode } from '../../types/node';
import { assert } from '../../utils/assert';
import { createElementNode, createTextNode } from '../../utils/dom';

/**
 * HTMLを解析する
 * @param source '<div>...</div>'
 * @returns
 */
export const parse = (source: string): ToyNode => {
  const nodes = new Parser(source).parseNodes();

  if (nodes.length === 1) {
    return nodes[0];
  } else {
    return createElementNode('html', {}, nodes);
  }
};

/**
 * HTMLを解析するクラス
 */
class Parser {
  private pos: number;
  private readonly input: string;

  constructor(input: string) {
    this.pos = 0;
    this.input = input;
  }

  /** 文字列をパースしてNodeツリーを構築する */
  parseNodes(): ToyNode[] {
    const nodes: ToyNode[] = [];

    while (true) {
      this.consumeWhitespace();
      if (this.eof() || this.startsWith('</')) {
        break;
      }
      nodes.push(this.parseNode());
    }

    return nodes;
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

  /**  */
  private parseNode(): ToyNode {
    if (this.nextChar() === '<') return this.parseElement();

    return this.parseText();
  }

  /** html elementを解析 */
  private parseElement(): ToyNode {
    assert(this.consumeChar() !== '<', 'parseElement: nextChar is not <');
    const tagName = this.parseTagName();
    const attributes = this.parseAttributes();
    assert(this.consumeChar() !== '>', 'parseElement: nextChar is not >');

    // posが進んでいるので、parseNodes()を呼び出すとchildrenが取得できる
    const children = this.parseNodes();

    assert(this.consumeChar() !== '<', 'parseElement: nextChar is not <');
    assert(this.consumeChar() !== '/', 'parseElement: nextChar is not /');
    this.parseTagName();
    assert(this.consumeChar() !== '>', 'parseElement: nextChar is not >');

    return createElementNode(tagName, attributes, children);
  }

  /**
   * タグ名を解析
   * @description タグ名は、英数字とハイフンのみを許可する
   * @remarks 正規表現/\w/は「単語構成文字」を意味し、すべてのアルファベット文字（大文字と小文字）、数字、およびアンダースコア_に一致します。
   */
  private parseTagName(): string {
    return this.consumeWhile((c) => /\w/.test(c));
  }

  /** 属性を解析 */
  private parseAttributes(): Record<string, string> {
    const attributes: Record<string, string> = {};

    while (true) {
      this.consumeWhitespace();
      if (this.nextChar() === '>') {
        break;
      }
      const { name, value } = this.parseAttr();
      attributes[name] = value;
    }

    return attributes;
  }

  /**
   * 単一の属性（例：class="example"）をパースする
   * @returns tagNameとvalue
   */
  private parseAttr(): Record<string, string> {
    const name = this.parseTagName();
    assert(this.consumeChar() !== '=');
    const value = this.parseAttrValue();
    return { name, value };
  }

  /** 属性値を解析する */
  private parseAttrValue(): string {
    const openQuote = this.consumeChar();
    assert(openQuote !== '"' && openQuote !== "'");
    const value = this.consumeWhile((char) => char !== openQuote);
    assert(this.consumeChar() === openQuote);
    return value;
  }

  /** テキストを解析する */
  private parseText(): ToyNode {
    return createTextNode(this.consumeWhile((char) => char !== '<'));
  }

  /**
   * 文字を消費する
   * @description this.posをインクリメントする
   */
  private consumeChar(): string {
    const char = this.input.substring(this.pos, this.pos + 1);
    this.pos++;
    return char;
  }

  /** 現在の解析位置にある文字を返す */
  private nextChar(): string {
    return this.input.substring(this.pos, this.pos + 1);
  }

  /** 引数の文字で始まっているか判定する */
  private startsWith(s: string): boolean {
    return this.input.startsWith(s, this.pos);
  }

  /** 入力文字列がすべて消費されたかどうかを判断する。 */
  private eof(): boolean {
    return this.pos >= this.input.length;
  }
}
