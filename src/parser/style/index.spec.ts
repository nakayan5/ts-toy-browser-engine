import { parse as parseHTML } from '../html';
import { parse as parseCSS } from '../css';
import { createStyleTree } from './index';

describe('parseStyle', () => {
  it('id selector', () => {
    const nodes = parseHTML(`<div>Hello, world!</div>`);
    const style = parseCSS(`div { color: red; }`);
    const styleTree = createStyleTree(nodes, style);
    expect(styleTree).toEqual({
      node: {
        children: [
          {
            children: [],
            nodeType: 'Hello, world!',
          },
        ],
        nodeType: { tagName: 'div', attributes: {} },
      },
      specifiedValues: { color: 'red' },
      children: [
        {
          node: {
            children: [],
            nodeType: 'Hello, world!',
          },
          specifiedValues: {},
          children: [],
        },
      ],
    });
  });
});
