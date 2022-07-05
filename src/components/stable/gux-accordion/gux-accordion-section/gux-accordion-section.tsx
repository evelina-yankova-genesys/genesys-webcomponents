import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop,
  Watch
} from '@stencil/core';

import { randomHTMLId } from '@utils/dom/random-html-id';
import { logError } from '@utils/error/log-error';

import { GuxAccordionSectionArrowPosition } from './gux-accordion-section.types';

@Component({
  styleUrl: 'gux-accordion-section.less',
  tag: 'gux-accordion-section',
  shadow: true
})
export class GuxAccordionSection {
  private sectionId: string = randomHTMLId('gux-accordion-section');

  @Element()
  root: HTMLElement;

  @Prop()
  arrowPosition: GuxAccordionSectionArrowPosition = 'default';

  @Prop({ mutable: true })
  open: boolean = false;

  @Prop()
  disabled: boolean = false;

  @Prop()
  reverseHeadings: boolean = false;

  @Event()
  internalsectionopened: EventEmitter<void>;

  @Watch('open')
  watchOpen(open: boolean): void {
    if (open) {
      this.internalsectionopened.emit();
    }
  }

  private toggle() {
    this.open = !this.open;
  }

  private isArrowPositionedBesideText(): boolean {
    if (this.arrowPosition === 'beside-text') {
      return true;
    }
    return false;
  }

  private handleSlotChange(slotname: string): void {
    const slot = this.root.querySelector(`[slot="${slotname}"]`);

    if (!slot || !/^H[1-6]$/.test(slot.nodeName)) {
      logError(
        'gux-accordion-section',
        `For accessibility reasons the ${slotname} slot should be filled with a HTML heading tag (h1 - h6).`
      );
    }
  }

  render(): JSX.Element {
    return (
      <section class={{ 'gux-disabled': this.disabled }}>
        <button
          class={{
            'gux-header': true,
            'reverse-headings': this.reverseHeadings
          }}
          aria-expanded={this.open.toString()}
          aria-controls={this.sectionId}
          disabled={this.disabled}
          onClick={this.toggle.bind(this)}
        >
          <slot name="icon"></slot>
          <div
            class={{
              'gux-header-text': true,
              'arrow-position-beside': this.isArrowPositionedBesideText()
            }}
          >
            <slot
              onSlotchange={() => this.handleSlotChange('header')}
              name="header"
            ></slot>
            <slot
              onSlotchange={() => this.handleSlotChange('subheading')}
              name="subheading"
            ></slot>
          </div>
          <div
            class={{
              'gux-header-icon': true,
              'gux-expanded': this.open
            }}
          >
            <gux-icon decorative icon-name="chevron-small-down"></gux-icon>
          </div>
        </button>
        <div
          id={this.sectionId}
          class={{
            'gux-content': true,
            'gux-expanded': this.open
          }}
        >
          <slot name="content"></slot>
        </div>
      </section>
    ) as JSX.Element;
  }
}
