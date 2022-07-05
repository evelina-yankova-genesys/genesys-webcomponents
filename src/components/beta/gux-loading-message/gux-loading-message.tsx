import { Component, Element, JSX, Prop, h } from '@stencil/core';
import { trackComponent } from '../../../usage-tracking';
import { GuxLoadingSizes } from './gux-loading-message-sizes';

@Component({
  styleUrl: 'gux-loading-message.less',
  tag: 'gux-loading-message-beta',
  shadow: true
})
export class GuxLoadingMessage {
  /**
   * Reference the host element
   */
  @Element()
  root: HTMLElement;

  @Prop()
  size: GuxLoadingSizes = 'medium';

  @Prop()
  value: number;

  @Prop()
  maxValue: number;

  componentWillLoad() {
    trackComponent(this.root);
  }

  render(): JSX.Element {
    return (
      <div class={`gux-${this.size}-container`}>
        <gux-radial-progress value={this.value} max={this.maxValue} />
        <div class="gux-title-container">
          <slot name="title"></slot>
        </div>
        <slot name="body"></slot>
      </div>
    ) as JSX.Element;
  }
}
