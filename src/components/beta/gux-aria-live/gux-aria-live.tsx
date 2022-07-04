import { Component, Prop, Element, Host, JSX, h } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { GuxAriaLivePriority } from './gux-aria-live-priority.types';
import { GuxAriaLiveRole } from './gux-aria-live-role.types';

@Component({
  tag: 'gux-aria-live',
  shadow: true
})
export class GuxAriaLive {
  /**
   * Reference the host element.
   */
  @Element()
  root: HTMLElement;

  @Prop()
  priority: GuxAriaLivePriority;

  @Prop()
  role: GuxAriaLiveRole;

  componentWillLoad() {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return (
      <Host role={this.role} aria-live={this.priority}>
        <slot />
      </Host>
    ) as JSX.Element;
  }
}
