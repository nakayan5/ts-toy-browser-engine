import { parse } from './index';

describe('parseCSS', () => {
  it('empty', () => {
    const nodes = parse('');
    expect(nodes).toEqual({ rules: [] });
  });

  it('single rule', () => {
    const nodes = parse(`h1 { color: red; }`);
    expect(nodes).toEqual({
      rules: [
        {
          selectors: [
            {
              tagName: 'h1',
              id: '',
              class: [],
            },
          ],
          declarations: [
            {
              name: 'color',
              value: 'red',
            },
          ],
        },
      ],
    });
  });

  it('multiple rules', () => {
    const nodes = parse(`
      h1 { color: red; }
      p { color: blue; }
      `);
    expect(nodes).toEqual({
      rules: [
        {
          selectors: [
            {
              tagName: 'h1',
              id: '',
              class: [],
            },
          ],
          declarations: [
            {
              name: 'color',
              value: 'red',
            },
          ],
        },
        {
          selectors: [
            {
              tagName: 'p',
              id: '',
              class: [],
            },
          ],
          declarations: [
            {
              name: 'color',
              value: 'blue',
            },
          ],
        },
      ],
    });
  });

  it('id', () => {
    const nodes = parse(`
      #wrap { margin: auto; }
      `);
    expect(nodes).toEqual({
      rules: [
        {
          selectors: [
            {
              tagName: '',
              id: 'wrap',
              class: [],
            },
          ],
          declarations: [
            {
              name: 'margin',
              value: 'auto',
            },
          ],
        },
      ],
    });
  });

  it('class', () => {
    const nodes = parse(`
      .wrap { margin: 40px; }
      `);
    expect(nodes).toEqual({
      rules: [
        {
          selectors: [
            {
              tagName: '',
              id: '',
              class: ['wrap'],
            },
          ],
          declarations: [
            {
              name: 'margin',
              value: [40, 'px'],
            },
          ],
        },
      ],
    });
  });
});
