export interface ToyNode {
  children: ToyNode[];
  nodeType: ToyNodeType;
}

type ToyNodeType = ToyText | ToyElement;

type ToyText = string;

interface ToyElement {
  tagName: string;
  attributes: Record<string, string>;
}
