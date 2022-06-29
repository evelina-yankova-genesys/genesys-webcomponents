import {
  Component,
  h,
  Host,
  Element,
  JSX,
  Listen,
  Prop,
  State
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { eventIsFrom } from '../../../../utils/dom/event-is-from';
import { randomHTMLId } from '../../../../utils/dom/random-html-id';
import tableResources from '../i18n/en.json';

/**
 * @slot default - Required slot for gux-all-row-select element
 * @slot select-menu-options - Optional slot for gux-list containing gux-list-item children
 */

@Component({
  styleUrl: 'gux-table-select-menu.less',
  tag: 'gux-table-select-menu'
})
export class GuxTableSelectMenu {
  private tableSelectMenuButtonElement: HTMLButtonElement;
  private dropdownOptionsButtonId: string = randomHTMLId(
    'gux-table-select-menu'
  );
  private moveFocusDelay: number = 100;

  @Element()
  root: HTMLElement;

  private i18n: GetI18nValue;

  private hasSelectMenuOptions: boolean = false;

  @Prop()
  dropdownDisabled: boolean = false;

  @State()
  private popoverHidden: boolean = true;

  private focusFirstItemInPopupList(): void {
    const listElement: HTMLGuxListElement = this.root.querySelector('gux-list');
    setTimeout(() => {
      void listElement?.guxFocusFirstItem();
    }, this.moveFocusDelay);
  }

  async componentWillLoad(): Promise<void> {
    this.hasSelectMenuOptions = !!this.root.querySelector(
      '[slot="select-menu-options"]'
    );
    this.i18n = await buildI18nForComponent(
      this.root,
      tableResources,
      'gux-table'
    );
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        if (eventIsFrom('.gux-select-menu-button', event)) {
          this.toggleOptions();
          this.focusFirstItemInPopupList();
        }
        break;
      case 'Enter':
        if (eventIsFrom('.gux-select-menu-button', event)) {
          void this.focusFirstItemInPopupList();
        }
        break;
      case 'Escape':
        if (eventIsFrom('gux-list', event)) {
          event.stopPropagation();
          this.popoverHidden = true;
          this.tableSelectMenuButtonElement?.focus();
        }
        break;
    }
  }

  @Listen('keyup')
  onKeyup(event: KeyboardEvent): void {
    switch (event.key) {
      case ' ':
        if (eventIsFrom('.gux-select-menu-button', event)) {
          this.focusFirstItemInPopupList();
        }
    }
  }
  private toggleOptions(): void {
    this.popoverHidden = !this.popoverHidden;
  }

  private renderSelectDropdown(): JSX.Element {
    if (this.hasSelectMenuOptions) {
      return [
        <button
          aria-expanded={(!this.popoverHidden).toString()}
          type="button"
          class="gux-select-menu-button"
          ref={el => (this.tableSelectMenuButtonElement = el)}
          onClick={() => this.toggleOptions()}
          disabled={this.dropdownDisabled}
        >
          <gux-icon
            icon-name="chevron-small-down"
            screenreader-text={this.i18n('tableOptions')}
          ></gux-icon>
        </button>,
        <gux-table-select-popover
          for={this.dropdownOptionsButtonId}
          hidden={this.popoverHidden}
          closeOnClickOutside={true}
          onGuxdismiss={() => (this.popoverHidden = true)}
        >
          <div>
            <slot name="select-menu-options" />
          </div>
        </gux-table-select-popover>
      ] as JSX.Element;
    }
  }

  render(): JSX.Element {
    return (
      <Host id={this.dropdownOptionsButtonId}>
        <slot />
        {this.renderSelectDropdown()}
      </Host>
    ) as JSX.Element;
  }
}
