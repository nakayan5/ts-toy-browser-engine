import { DEFAULT_DIMENTIONS } from '../../constants/layout';
import { ZERO } from '../../constants/stylesheet';
import {
  type ToyLayoutBox,
  type Dimensions as IDimensions,
  type Rect as IRect,
  type EdgeSizes,
  type BoxType,
  type Dimensions,
} from '../../types/layout';
import { toPx } from '../../utils/toPx';
import { type StyleNode } from '../style';

/**
 *
 * @param stylenode
 * @param containingBlock
 * @returns
 */
export const layoutTree = (
  stylenode: StyleNode,
  containingBlock: IDimensions,
): LayoutBox => {
  containingBlock.content.height = 0;
  const rootBox = buildLayoutTree(stylenode);
  return rootBox;
};

/**
 *
 * @param stylenode
 * @returns
 */
const buildLayoutTree = (stylenode: StyleNode): LayoutBox => {
  let root: LayoutBox;
  switch (stylenode.display()) {
    case 'block':
      root = new LayoutBox('block', stylenode);
      break;
    case 'inline':
      root = new LayoutBox('inline', stylenode);
      break;
    default:
      throw new Error('Root node has to be either inline or block');
  }

  for (const child of stylenode.children) {
    switch (child.display()) {
      case 'block':
        root.children.push(buildLayoutTree(child));
        break;
      case 'inline':
        root.getInlineContainer().children.push(buildLayoutTree(child));
        break;
      default:
        // throw new Error('Root node has to be either inline or block');
        break;
    }
  }

  return root;
};

class LayoutBox {
  boxType: BoxType;
  stylenode: StyleNode | null;
  children: LayoutBox[];
  dimensions: Dimensions;

  constructor(boxType: BoxType, stylenode: StyleNode | null) {
    this.boxType = boxType;
    this.children = [];
    this.stylenode = stylenode;
    this.dimensions = DEFAULT_DIMENTIONS;
  }

  new(): ToyLayoutBox {
    return {
      dimensions: DEFAULT_DIMENTIONS,
      boxType: this.boxType,
      children: [],
    };
  }

  /**
   *
   * @param containingBlock
   */
  layout(containingBlock: IDimensions): void {
    switch (this.boxType) {
      case 'block':
        this.layoutBlock(containingBlock);
        break;
      case 'inline':
        // TODO: this.layoutInline(containingBlock);
        break;
      case 'anonymous':
        break;
    }
  }

  private layoutBlock(containingBlock: IDimensions): void {
    this.calculateBlockWidth(containingBlock);
    // this.calculateBlockPosition(containingBlock);
    // this.layoutBlockChildren();
    // this.calculateBlockHeight();
  }

  private calculateBlockWidth(containingBlock: IDimensions): void {
    const style = this.getStylenode();
    if (!style) return;

    const auto = 'auto';
    let width = style.value('width');

    let marginLeft = style.lookup('margin-left', 'margin', ZERO);
    let marginRight = style.lookup('margin-right', 'margin', ZERO);

    const borderLeft = style.lookup('border-left-width', 'border-width', ZERO);
    const borderRight = style.lookup(
      'border-right-width',
      'border-width',
      ZERO,
    );

    const paddingLeft = style.lookup('padding-left', 'padding', ZERO);
    const paddingRight = style.lookup('padding-right', 'padding', ZERO);

    const total = [
      marginLeft,
      marginRight,
      borderLeft,
      borderRight,
      paddingLeft,
      paddingRight,
    ].reduce((acc, val) => {
      return acc + toPx(val);
    }, 0);

    if (width !== auto && total > containingBlock.content.width) {
      if (marginLeft === auto) marginLeft = ZERO;
      if (marginRight === auto) marginRight = ZERO;
    }

    const underflow = containingBlock.content.width - total;

    if (width !== auto && marginLeft !== auto && marginRight !== auto) {
      marginRight = `${toPx(marginRight)} + ${underflow}px`;
    }

    if (width !== auto && marginLeft !== auto && marginRight === auto) {
      marginRight = `${underflow}px`;
    }

    if (width !== auto && marginLeft === auto && marginRight !== auto) {
      marginLeft = `${underflow}px`;
    }

    if (width === auto) {
      if (marginLeft === auto) marginLeft = ZERO;
      if (marginRight === auto) marginRight = ZERO;
      if (underflow >= 0) {
        width = `${underflow}px`;
      } else {
        width = ZERO;
        marginRight = `${toPx(marginRight)} + ${underflow}px`;
      }
    }

    if (width !== auto && marginLeft === auto && marginRight === auto) {
      marginLeft = `${underflow / 2}px`;
      marginRight = `${underflow / 2}px`;
    }

    this.dimensions.content.width = toPx(width);
    this.dimensions.padding.left = toPx(paddingLeft);
    this.dimensions.padding.right = toPx(paddingRight);
    this.dimensions.border.left = toPx(borderLeft);
    this.dimensions.border.right = toPx(borderRight);
    this.dimensions.margin.left = toPx(marginLeft);
    this.dimensions.margin.right = toPx(marginRight);
  }

  public getInlineContainer(): LayoutBox {
    switch (this.boxType) {
      case 'inline':
      case 'anonymous':
        return this;
      case 'block':
        const lastChild = this.children[this.children.length - 1];

        if (lastChild && lastChild.boxType === 'anonymous') {
          return lastChild;
        }

        const anonymous = new LayoutBox('anonymous', null);
        this.children.push(anonymous);
        return anonymous;
    }
  }

  private getStylenode(): StyleNode | null {
    switch (this.boxType) {
      case 'block':
      case 'inline':
        return this.stylenode;
      case 'anonymous':
        throw new Error('Anonymous block box has no style node');
    }
  }
}

class Dimension {
  content: IRect;
  padding: EdgeSizes;
  border: EdgeSizes;
  margin: EdgeSizes;

  constructor(
    content: IRect,
    padding: EdgeSizes,
    border: EdgeSizes,
    margin: EdgeSizes,
  ) {
    this.content = content;
    this.padding = padding;
    this.border = border;
    this.margin = margin;
  }

  public paddingBox(): IRect {
    const box = this.content;
    box.x -= this.padding.left;
    box.y -= this.padding.top;
    box.width += this.padding.left + this.padding.right;
    box.height += this.padding.top + this.padding.bottom;
    return box;
  }

  public borderBox(): IRect {
    const box = this.paddingBox();
    box.x -= this.border.left;
    box.y -= this.border.top;
    box.width += this.border.left + this.border.right;
    box.height += this.border.top + this.border.bottom;
    return box;
  }

  public marginBox(): IRect {
    const box = this.borderBox();
    box.x -= this.margin.left;
    box.y -= this.margin.top;
    box.width += this.margin.left + this.margin.right;
    box.height += this.margin.top + this.margin.bottom;
    return box;
  }
}

class Rect {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
