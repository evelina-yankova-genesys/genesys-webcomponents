import { Component, Element, JSX, Prop, h, State } from '@stencil/core';
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

  @State()
  body: boolean;

  componentWillLoad() {
    trackComponent(this.root);
    this.body = Boolean(this.root.querySelector(`*[slot='body']`));
  }

  render(): JSX.Element {
    return (
      <div
        class={`gux-${this.size}-container`}
        role="alert"
        aria-live="assertive"
      >
        <gux-radial-progress value={this.value} max={this.maxValue} />
        <div class="gux-title-container">
          <slot name="title"></slot>
        </div>
        {this.body ? <slot name="body"></slot> : null}
      </div>
    ) as JSX.Element;
  }
}
