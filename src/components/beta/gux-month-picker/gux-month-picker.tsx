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
import { getDesiredLocale } from '../../../i18n';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import translationResources from './i18n/en.json';

import { asIsoDate, fromIsoDate } from '../../../utils/date/iso-dates';

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
  @Prop({ mutable: true })
  minDate: string = '';

  /**
   * The max date selectable
   */
  @Prop({ mutable: true })
  maxDate: string = '';

  @State()
  active: boolean = false;

  @State()
  yearLabel: number;

  @State()
  monthLabel: string;

  /**
   * Triggered when user selects a month
   */
  @Event()
  input: EventEmitter<string>;

  private locale: string = 'en';

  async componentWillLoad() {
    trackComponent(this.root);
    this.i18n = await buildI18nForComponent(this.root, translationResources);

    this.locale = getDesiredLocale(this.root);

    if (!this.value) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      this.value = asIsoDate(now);
    } else {
      this.value = this.value.length > 7 ? this.value : this.value + '-01';
    }

    const month = new Date(fromIsoDate(this.value).getTime());
    month.setMonth(month.getMonth());
    const monthName = month.toLocaleString(this.locale, { month: 'long' });
    this.monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    this.yearLabel = month.getFullYear();
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside() {
    this.active = false;
  }

  @Watch('active')
  watchActiveCalendar(active: boolean) {
    if (active) {
      const dateValue = fromIsoDate(this.value);
      void this.monthCalendarElement.resetCalendarView(dateValue);
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
    const value = monthCalendar.value;
    this.value = value;
    let monthIndex = value.split('-')[1];
    if (monthIndex[0] === '0') {
      monthIndex = (parseInt(monthIndex[1]) - 1).toString();
    }
    this.monthLabel = monthCalendar.monthsListLong[monthIndex];
    this.yearLabel = parseInt(value.split('-')[0]);
    inputEvent.stopPropagation(); // Don't let both events bubble.
    this.input.emit(this.value.slice(0, -3));
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
