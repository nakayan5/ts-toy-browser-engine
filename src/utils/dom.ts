import { type ToyNode } from '../types/node';

/**
 * テキストノードを作成する
 * @param data
 * @returns
 */
export const createTextNode = (data: string): ToyNode => {
  return {
    children: [],
    nodeType: data,
  };
};

/**
 * 要素ノードを作成する
 * @param name
 * @param attributes
 * @param children
 * @returns
 */
export const createElementNode = (
  name: string,
  attributes: Record<string, string>,
  children: ToyNode[],
): ToyNode => {
  return {
    children,
    nodeType: {
      tagName: name,
      attributes,
    },
  };
};
