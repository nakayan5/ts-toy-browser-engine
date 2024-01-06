export interface ToyStylesheet {
  rules: ToyRule[];
}

export interface ToyRule {
  selectors: ToySelector[];
  declarations: ToyDeclaration[];
}

export interface ToySelector {
  tagName: string;
  id: string;
  class: string[];
}

export interface ToyDeclaration {
  name: string;
  value: Value;
}

export type Value = Keyword | Length | Color;
export type Keyword = string;
export type Length = [number, Unit];
type Unit = 'px';
export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}
