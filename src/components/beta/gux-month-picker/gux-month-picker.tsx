/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Watch,
  Prop,
  State
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { OnClickOutside } from '../../../utils/decorator/on-click-outside';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import translationResources from './i18n/en.json';
import { getTranslatedMonthsLong } from '../gux-month-calendar/gux-month-calendar.service';

@Component({
  styleUrl: 'gux-month-picker.less',
  tag: 'gux-month-picker-beta',
  shadow: true
})
export class GuxMonthPicker {
  i18n: GetI18nValue;

  @Element()
  private root: HTMLElement;
  monthCalendarElement: HTMLGuxMonthCalendarBetaElement;

  /**
   * The month picker current value
   */
  @Prop({ mutable: true })
  value: string = '';

  /**
   * Indicate if the month picker is disabled or not
   */
  @Prop()
  disabled: boolean = false;

  @Prop()
  label: string;

  /**
   * The min date selectable
   */
  @Prop()
  minDate: string = '';

  /**
   * The max date selectable
   */
  @Prop()
  maxDate: string = '';

  @State()
  active: boolean = false;

  @State()
  yearLabel: number;

  @State()
  monthLabel: string;

  @State()
  translatedMonthsLongArray: Array<string> = [];

  /**
   * Triggered when user selects a month
   */
  @Event()
  input: EventEmitter<string>;

  async componentWillLoad() {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, translationResources);

    if (!this.value) {
      const newDate = new Date();
      const year = newDate.getFullYear();
      const month =
        newDate.getMonth().toString().length < 2
          ? `0${newDate.getMonth() + 1}`
          : newDate.getMonth() + 1;
      this.value = `${year}-${month}`;
    }

    this.translatedMonthsLongArray = getTranslatedMonthsLong(this.i18n);
    this.monthLabel =
      this.translatedMonthsLongArray[parseInt(this.value.split('-')[1])];
    this.yearLabel = parseInt(this.value.split('-')[0]);
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside() {
    this.active = false;
  }

  @Watch('active')
  watchActiveCalendar(active: boolean) {
    if (active) {
      void this.monthCalendarElement.resetCalendarView();
    }
  }

  toggleCalendar() {
    this.active = !this.active;
    if (this.active) {
      // Wait for render before focusing preview date
      setTimeout(() => {
        void this.monthCalendarElement.focusPreviewMonth();
      }, 100);
    }
  }

  onMonthCalendarSelect(inputEvent: Event) {
    const monthCalendar = inputEvent.target as HTMLGuxMonthCalendarBetaElement;
    this.value = monthCalendar.value;
    const value = this.value.split('-');

    this.yearLabel = parseInt(value[0]);
    this.monthLabel = this.translatedMonthsLongArray[parseInt(value[1])];

    inputEvent.stopPropagation(); // Don't let both events bubble.
    this.input.emit(this.value);
    this.active = false;
  }

  renderCalendarToggleButton(): JSX.Element {
    return (
      <button
        class="gux-calendar-toggle-button"
        type="button"
        disabled={this.disabled}
        aria-label={this.i18n('toggleCalendar')}
      >
        <gux-icon decorative icon-name="calendar"></gux-icon>
      </button>
    ) as JSX.Element;
  }

  renderCalendar(): JSX.Element {
    return (
      <gux-month-calendar-beta
        ref={(el: HTMLGuxMonthCalendarBetaElement) =>
          (this.monthCalendarElement = el)
        }
        onInput={(event: CustomEvent) => this.onMonthCalendarSelect(event)}
        value={this.value}
        minDate={this.minDate}
        maxDate={this.maxDate}
      />
    ) as JSX.Element;
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-month-picker-beta': true,
          'gux-active': this.active,
          'gux-disabled': this.disabled
        }}
      >
        <label class="gux-month-picker-label">
          {this.label}
          <span class="gux-sr-only">
            {this.monthLabel} {this.yearLabel}
          </span>
        </label>
        <div class="gux-month-picker" onClick={() => this.toggleCalendar()}>
          <span
            class="gux-month-display"
            aria-label={`${this.monthLabel} ${this.yearLabel}`}
          >
            {this.monthLabel} {this.yearLabel}
          </span>
          {this.renderCalendarToggleButton()}
        </div>
        {this.renderCalendar()}
      </div>
    ) as JSX.Element;
  }
}
