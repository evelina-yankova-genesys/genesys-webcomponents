import {
  Component,
  Element,
  Prop,
  JSX,
  h,
  State,
  Event,
  EventEmitter,
  Host
} from '@stencil/core';

import { randomHTMLId } from '../../../../utils/dom/random-html-id';

import { GuxTableExpandedRowState } from './gux-expandable-row.types';

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
  expanded: boolean;

  @Prop()
  rows: string;

  @State()
  rowCount: number;

  /**
   * Triggers when a table row with a nested expandable-row is clicked.
   */
  @Event() guxexpandrow: EventEmitter<GuxTableExpandedRowState>;

  private renderInitialState(): void {
    const expandableRows = document.querySelectorAll(this.rows);
    this.rowCount = expandableRows.length;

    if (this.root.hasAttribute('expanded')) {
      const expandedState = this.root.getAttribute('expanded');

      if (expandedState == 'true') {
        expandableRows.forEach(row => {
          row.setAttribute('class', 'show');
        });
      }

      if (expandedState == 'false') {
        expandableRows.forEach(row => {
          row.setAttribute('class', 'hidden');
        });
      }
    }
  }

  private expandToggle(id: string): void {
    const expandableRows = document.querySelectorAll(this.rows);

    if (this.root.getAttribute('expanded')) {
      const expandedState = this.root.getAttribute('expanded');

      switch (expandedState) {
        case 'true':
          this.expanded = false;
          expandableRows.forEach(row => {
            row.setAttribute('class', 'hidden');
          });
          break;
        case 'false':
          this.expanded = true;
          expandableRows.forEach(row => {
            row.setAttribute('class', 'show');
          });
          break;
      }

      this.guxexpandrow.emit({
        expanded: this.expanded,
        buttonId: id
      });
    }
  }

  componentWillLoad() {
    this.renderInitialState();
  }

  render(): JSX.Element {
    return (
      <Host id={this.id}>
        <button
          type="button"
          aria-label={`${this.rowCount}` + ' more nested rows'}
          aria-expanded={this.expanded ? 'true' : 'false'}
          onClick={() => this.expandToggle(this.id)}
        >
          <gux-icon
            iconName={this.expanded ? 'arrow-solid-down' : 'arrow-solid-right'}
          ></gux-icon>
        </button>
      </Host>
    ) as JSX.Element;
  }
}
