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

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import translationResources from '../i18n/en.json';
import { trackComponent } from '../../../../usage-tracking';

@Component({
  styleUrl: 'gux-expandable-row.less',
  tag: 'gux-expandable-row',
  shadow: true
})
export class GuxExpandableRow {
  private i18n: GetI18nValue;

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

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, translationResources);
    this.renderInitialState();
  }

  render(): JSX.Element {
    return (
      <Host id={this.id}>
        <button
          type="button"
          aria-label={this.i18n('nestedRows', {
            rowCount: this.rowCount
          })}
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
