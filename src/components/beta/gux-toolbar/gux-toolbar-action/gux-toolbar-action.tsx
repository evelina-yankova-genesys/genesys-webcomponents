import { Component, Element, State, JSX, h, Prop, Listen } from '@stencil/core';
import { trackComponent } from '../../../../usage-tracking';
import { GuxToolbarActionTypes } from './gux-toolbar-action.types';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import translationResources from '../i18n/en.json';

@Component({
  tag: 'gux-toolbar-action',
  shadow: true
})
export class GuxToolbarAction {
  private i18n: GetI18nValue;

  /**
   * Reference to the host element.
   */
  @Element()
  root: HTMLElement;

  @State()
  label: string;

  @State()
  active: boolean = false;

  @Prop()
  primary: boolean;

  @Prop()
  icon: string;

  @Prop()
  action: GuxToolbarActionTypes;

  @State()
  iconOnly: boolean = false;

  @Listen('emitLayoutChange', { target: 'body' })
  emitLayoutChangeHandler(event: CustomEvent<boolean>) {
    if (event.detail == true) {
      if (!this.primary) {
        this.iconOnly = true;
      }
    } else {
      this.iconOnly = false;
    }
  }

  private onSlotChange(event: Event) {
    const slotAssignedNodes = (
      event.composedPath()[0] as HTMLSlotElement
    ).assignedNodes();
    this.label = slotAssignedNodes
      .map(nodeItem => nodeItem.textContent)
      .join('');
  }

  private renderActionTitle(): JSX.Element {
    if (!this.iconOnly) {
      return (
        <span>
          <slot
            aria-hidden="true"
            onSlotchange={this.onSlotChange.bind(this)}
          />
        </span>
      ) as JSX.Element;
    }
  }

  private renderIcon(): JSX.Element {
    if (this.icon) {
      return (
        <gux-icon iconName={this.icon} screenreaderText={this.label} />
      ) as JSX.Element;
    }
  }

  private renderActionType(): JSX.Element {
    return (
      <gux-button accent={this.primary ? 'primary' : 'secondary'} type="button">
        <gux-icon
          iconName={this.action == 'revert' ? 'reset' : this.action}
          screenreaderText={this.i18n(this.action)}
        />
        {!this.iconOnly ? (
          <span aria-hidden="true">
            {this.action.charAt(0).toUpperCase() + this.action.slice(1)}
          </span>
        ) : null}
      </gux-button>
    ) as JSX.Element;
  }

  private renderCustomActionType(): JSX.Element {
    return (
      <gux-button accent={this.primary ? 'primary' : 'secondary'} type="button">
        {this.renderIcon()}
        {this.renderActionTitle()}
      </gux-button>
    ) as JSX.Element;
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, translationResources);
  }

  render(): JSX.Element {
    return this.action
      ? this.renderActionType()
      : this.renderCustomActionType();
  }
}
