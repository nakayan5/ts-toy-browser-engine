import { type Display } from './stylenode';

export interface ToyLayoutBox {
  dimensions: Dimensions;
  boxType: BoxType;
  children: ToyLayoutBox[];
}

export interface Dimensions {
  content: Rect;
  padding: EdgeSizes;
  border: EdgeSizes;
  margin: EdgeSizes;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EdgeSizes {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type BoxType = Extract<Display, 'inline' | 'block'> | 'anonymous';
