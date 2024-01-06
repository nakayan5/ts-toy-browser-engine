import { parse } from './index';

describe('parseCSS', () => {
  // it('empty', () => {
  //   const nodes = parse('');
  //   expect(nodes).toEqual({ rules: [] });
  // });

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
          declarations: [],
        },
      ],
    });
  });

  //   it('multiple rules', () => {
  //     const nodes = parse(`
  //     h1 { color: red; }
  //     p { color: blue; }
  //     `);
  //     expect(nodes).toEqual({
  //       rules: [
  //         {
  //           selectors: [
  //             {
  //               tagName: '',
  //               id: '',
  //               class: [],
  //             },
  //           ],
  //           declarations: [
  //             {
  //               name: '',
  //               value: '',
  //             },
  //           ],
  //         },
  //         {
  //           selectors: [
  //             {
  //               tagName: '',
  //               id: '',
  //               class: [],
  //             },
  //           ],
  //           declarations: [
  //             {
  //               name: '',
  //               value: '',
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //   });
});
