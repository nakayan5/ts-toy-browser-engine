import { type ToyNode } from '../../types/node';
import {
  type Display,
  type PropertyMap,
  type ToyStyleNode,
} from '../../types/stylenode';
import {
  type Value,
  type ToyRule,
  type ToySelector,
  type ToyStylesheet,
} from '../../types/stylesheet';

/**
 *
 * @param node
 * @param stylesheet
 * @returns
 */
export const createStyleTree = (
  node: ToyNode,
  stylesheet: ToyStylesheet,
): ToyStyleNode => {
  const stylenode = new StyleNode(node, stylesheet);
  return stylenode;
};

class StyleNode {
  node: ToyNode;
  specifiedValues: PropertyMap;
  children: ToyStyleNode[];

  constructor(node: ToyNode, stylesheet: ToyStylesheet) {
    this.node = node;
    this.specifiedValues = this.createSpecifiedValues(node, stylesheet);
    this.children = node.children.map(
      (child) => new StyleNode(child, stylesheet),
    );
  }

  public value(name: string): Value {
    return this.specifiedValues[name] ? this.specifiedValues[name] : '';
  }

  public display(): Display {
    const display = this.value('display');

    switch (display) {
      case 'inline':
      case 'block':
      case 'none':
        return display;
      default:
        return 'inline';
    }
  }

  public lookup(
    name: string,
    fallbackName: string,
    defaultValue: Value,
  ): Value {
    const value = this.value(name);

    if (value) return value;

    const fallback = this.value(fallbackName);

    if (fallback) return fallback;

    return defaultValue;
  }

  /**
   *
   * @param node
   * @returns
   */
  private createSpecifiedValues(
    node: ToyNode,
    stylesheet: ToyStylesheet,
  ): PropertyMap {
    const nodeType = node.nodeType;

    if (typeof nodeType === 'object') {
      const values: PropertyMap = {};
      const rules = this.matchingRules(node, stylesheet);
      rules.forEach((rule) => {
        rule.declarations.forEach((declaration) => {
          values[declaration.name] = declaration.value;
        });
      });
      return values;
    }

    if (typeof nodeType === 'string') return {};

    return {};
  }

  /**
   *
   * @param node
   * @param stylesheet
   * @returns
   */
  private matchingRules(node: ToyNode, stylesheet: ToyStylesheet): ToyRule[] {
    const rules = stylesheet.rules;
    const matchedRules = rules.filter((rule) =>
      rule.selectors.some((selector) => this.matchSelector(node, selector)),
    );
    return matchedRules;
  }

  /**
   *
   * @param node
   * @param selector
   * @returns
   */
  private matchSelector(node: ToyNode, selector: ToySelector): boolean {
    if (typeof node.nodeType === 'string') return false;

    if (
      selector.tagName !== '*' &&
      selector.tagName !== node.nodeType.tagName
    ) {
      return false;
    }

    if (selector.id !== '' && selector.id !== node.nodeType.attributes.id) {
      return false;
    }

    if (selector.class.length > 0) {
      const nodeClasses = node.nodeType.attributes.class.split(' ');
      if (
        !selector.class.every((className) => nodeClasses.includes(className))
      ) {
        return false;
      }
    }

    return true;
  }
}
