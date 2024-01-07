import { type ToyNode } from './node';
import { type Value } from './stylesheet';

export interface ToyStyleNode {
  node: ToyNode;
  specifiedValues: PropertyMap;
  children: ToyStyleNode[];
}

export type PropertyMap = Record<string, Value>;

export type Display = 'inline' | 'block' | 'none';
