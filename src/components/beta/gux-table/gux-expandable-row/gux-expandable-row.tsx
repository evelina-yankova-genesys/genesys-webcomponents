import { Component, Element, Prop, JSX, h, Listen } from '@stencil/core';

import { randomHTMLId } from '../../../../utils/dom/random-html-id';

@Component({
  styleUrl: 'gux-expandable-row.less',
  tag: 'gux-expandable-row',
  shadow: true
})
export class GuxExpandableRow {
  @Element()
  root: HTMLElement;

  private id: string = randomHTMLId('gux-expandable-row');

  @Prop({ mutable: true })
  expanded: boolean = false;

  @Listen('guxexpandedrow', { target: 'body' })
  onCheck(event: CustomEvent): void {
    event.stopPropagation();
    this.expanded = !this.expanded;
  }

  render(): JSX.Element {
    return (
      <button type="button" id={this.id} aria-expanded={this.expanded}>
        <gux-icon
          iconName={this.expanded ? 'arrow-solid-up' : 'arrow-solid-down'}
        ></gux-icon>
      </button>
    ) as JSX.Element;
  }
}
