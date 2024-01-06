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

type Value = Keyword | Length | Color;
type Keyword = string;
type Length = number;
interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}
