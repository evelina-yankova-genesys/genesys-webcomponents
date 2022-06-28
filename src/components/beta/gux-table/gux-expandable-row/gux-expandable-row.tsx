import { Component, Element, Prop, JSX, h, State, Listen } from '@stencil/core';

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

  @Prop()
  expanded: boolean = false;

  @State()
  rowCount: number;

  @Listen('guxexpandedrow', { target: 'body' })
  onExpanded(event: CustomEvent): void {
    event.stopPropagation();
    //set rowCount
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.rowCount = event.detail.expandableRowsCount;
  }

  render(): JSX.Element {
    return (
      <button
        type="button"
        id={this.id}
        aria-label={`${this.rowCount}` + ' more nested rows'}
        aria-expanded={this.expanded ? 'true' : 'false'}
      >
        <gux-icon
          iconName={this.expanded ? 'arrow-solid-down' : 'arrow-solid-right'}
        ></gux-icon>
      </button>
    ) as JSX.Element;
  }
}
