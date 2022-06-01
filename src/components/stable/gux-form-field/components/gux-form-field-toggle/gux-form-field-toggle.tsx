import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Listen,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { OnMutation } from '../../../../../utils/decorator/on-mutation';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';
import { preventBrowserValidationStyling } from '../../../../../utils/dom/prevent-browser-validation-styling';
import { trackComponent } from '../../../../../usage-tracking';

import { GuxFormFieldError } from '../../functional-components/gux-form-field-error/gux-form-field-error';

import { hasErrorSlot, validateFormIds } from '../../gux-form-field.servce';

/**
 * @slot input - Required slot for input tag
 * @slot label - Required slot for label tag
 * @slot error - Optional slot for error message
 */
@Component({
  styleUrl: 'gux-form-field-toggle.less',
  tag: 'gux-form-field-toggle',
  shadow: true
})
export class GuxFormFieldToggle {
  private input: HTMLInputElement;
  private label: HTMLLabelElement;
  private disabledObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  @State()
  private disabled: boolean;

  @State()
  private checked: boolean;

  @State()
  private hasError: boolean = false;

  @Prop()
  checkedLabel: string;

  @Prop()
  uncheckedLabel: string;

  @Prop()
  labelPosition: 'left' | 'right' = 'right';

  @Prop()
  loading: boolean = false;

  @OnMutation({ childList: true, subtree: true, attributes: true })
  onMutation(): void {
    this.hasError = hasErrorSlot(this.root);
  }

  @Event()
  check: EventEmitter<boolean>;

  @Listen('input')
  onCheck(event: CustomEvent): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.check.emit(this.checked);
    this.setLabel();
  }

  @Watch('loading')
  disableLoadingInput(loading: boolean) {
    if (loading) {
      this.input.disabled = true;
    } else {
      this.input.disabled = this.disabled;
    }
  }

  componentWillLoad(): void {
    this.setInput();
    this.setLabel();

    this.hasError = hasErrorSlot(this.root);

    trackComponent(this.root);
  }

  disconnectedCallback(): void {
    this.disabledObserver.disconnect();
  }

  renderLoading(): JSX.Element {
    if (this.loading) {
      return (
        <div class="gux-toggle-label-loading">
          <gux-radial-loading context="input"></gux-radial-loading>
        </div>
      ) as JSX.Element;
    }
  }

  renderLabel(): JSX.Element {
    return (
      <div class="gux-toggle-label">
        <slot name="label" />
        {this.renderLoading()}
      </div>
    ) as JSX.Element;
  }

  render(): JSX.Element {
    return (
      <Host
        class={{
          'gux-disabled': this.disabled || this.loading,
          'gux-toggle-label-left': this.labelPosition === 'left'
        }}
      >
        <div class="gux-form-field-container">
          <div class="gux-form-field-toggle-container">
            <div
              class={{
                'gux-form-field-toggle-slider': true,
                'gux-checked': this.checked
              }}
            >
              <div class="gux-slider">
                <div class="gux-switch">
                  <gux-icon icon-name="checkmark" decorative></gux-icon>
                </div>
              </div>
              <slot name="input" onSlotchange={() => this.setInput()} />
            </div>
          </div>
          {this.renderLabel()}
        </div>
        <GuxFormFieldError hasError={this.hasError}>
          <slot name="error" />
        </GuxFormFieldError>
      </Host>
    ) as JSX.Element;
  }

  private setLabel(): void {
    this.label = this.root.querySelector('label[slot="label"]');
    if (this.uncheckedLabel && this.checkedLabel) {
      if (this.checked) {
        this.label.textContent = this.checkedLabel;
      } else {
        this.label.textContent = this.uncheckedLabel;
      }
    }
  }

  private setInput(): void {
    this.input = this.root.querySelector(
      'input[type="checkbox"][slot="input"]'
    );

    if (!this.input.getAttribute('role')) {
      this.input.setAttribute('role', 'switch');
    }

    preventBrowserValidationStyling(this.input);

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );

    if (this.loading) {
      this.input.disabled = true;
    } else {
      this.disabled = this.input.disabled;
    }

    this.checked = this.input.checked;

    validateFormIds(this.root, this.input);
  }
}
