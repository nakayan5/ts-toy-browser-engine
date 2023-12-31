import { parse } from './index';

/**
 * MEMO: 存在しないタグ名を指定した場合でも、そのタグ名を返すようになっている。
 */

// 正常系
describe('parseHTML', () => {
  it('empty', () => {
    const nodes = parse('');
    expect(nodes).toEqual({
      children: [],
      nodeType: { tagName: 'html', attributes: {} },
    });
  });

  it('text', () => {
    const nodes = parse('lorem');
    expect(nodes).toEqual({
      children: [],
      nodeType: 'lorem',
    });
  });

  it('single element', () => {
    const nodes = parse('<div>Hello, world!</div>');
    expect(nodes).toEqual({
      children: [
        {
          nodeType: 'Hello, world!',
          children: [],
        },
      ],
      nodeType: {
        tagName: 'div',
        attributes: {},
      },
    });
  });

  it('multiple element', () => {
    const nodes = parse('<div class="wrap"><p>lorem</p><p>ipsam</p></div>');
    expect(nodes).toEqual({
      children: [
        {
          children: [{ children: [], nodeType: 'lorem' }],
          nodeType: { tagName: 'p', attributes: {} },
        },
        {
          children: [{ children: [], nodeType: 'ipsam' }],
          nodeType: { tagName: 'p', attributes: {} },
        },
      ],
      nodeType: {
        tagName: 'div',
        attributes: {
          class: 'wrap',
        },
      },
    });
  });
});

// 異常系
describe('parseHTML', () => {
  it('invalid tag', () => {
    expect(() => parse('<div>')).toThrow();
    expect(() => parse('<div')).toThrow();
    expect(() => parse('<div></div')).toThrow();
    expect(() => parse('<div></div>')).not.toThrow();
  });

  it('invalid tag name', () => {
    const nodes = parse('<1div></1div>');
    expect(nodes).toEqual({
      children: [],
      nodeType: {
        tagName: '1div',
        attributes: {},
      },
    });
  });

  it('invalid attribute', () => {
    expect(() => parse('<div class></div>')).toThrow();
    expect(() => parse('<div class=></div>')).toThrow();
    expect(() => parse('<div class="wrap></div>')).toThrow();
    expect(() => parse('<div class="wrap\'></div>')).toThrow();
    expect(() => parse('<div class="wrap"></div>')).not.toThrow();
  });
});
