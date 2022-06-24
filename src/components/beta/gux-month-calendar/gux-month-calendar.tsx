import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Method,
  Listen,
  Prop,
  State
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { getDesiredLocale } from '../../../i18n';
import { OnClickOutside } from '../../../utils/decorator/on-click-outside';
import { asIsoDate, fromIsoDate } from '../../../utils/date/iso-dates';

@Component({
  styleUrl: 'gux-month-calendar.less',
  tag: 'gux-month-calendar-beta',
  shadow: true
})
export class GuxMonthCalendar {
  @Element()
  root: HTMLElement;

  /**
   * The current selected month
   */
  @Prop({ mutable: true })
  value: string = '';

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

  @Prop({ mutable: true })
  lastPickedMonth: HTMLElement;

  @State()
  yearLabel: number;

  @State()
  previewValue: Date = new Date();

  @Prop()
  monthsListLong: Array<string> = [];

  @Prop()
  monthsListShort: Array<string> = [];

  @State()
  monthsArray: Array<Date> = [];

  @State()
  focused: boolean = false;

  /**
   * Triggered when user selects a month
   */
  @Event()
  input: EventEmitter<string>;

  private locale: string = 'en';

  componentWillLoad() {
    trackComponent(this.root);
    this.locale = getDesiredLocale(this.root);

    if (!this.value) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      this.value = asIsoDate(now);
    }

    this.minDate =
      this.minDate.length > 7 ? this.minDate : this.minDate + '-01';
    this.maxDate =
      this.maxDate.length > 7 ? this.maxDate : this.maxDate + '-01';

    this.previewValue =
      this.value.length > 7
        ? fromIsoDate(this.value)
        : fromIsoDate(this.value + '-01');
    this.yearLabel = this.getYearLabel();
    this.getMonths();
  }

  componentDidLoad() {
    const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
      `td[id="${this.previewValue.getMonth()}"] button`
    );
    if (target) {
      target.classList.add('gux-selected');
    }
    this.lastPickedMonth = target;
  }

  /**
   * Sets new value and rerender the calendar
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async setValue(value: Date) {
    const selected = value;
    this.value = asIsoDate(selected);
    this.previewValue = selected;
  }

  /**
   * Focus the preview date
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async focusPreviewMonth() {
    const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
      `td[id="${this.previewValue.getMonth()}"] button`
    );

    if (target) {
      if (!this.focused) {
        target.classList.add('gux-selected');
      }
      target.focus();
    }
  }

  /**
   * Reset calendar view to show first selected date
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async resetCalendarView(value: Date): Promise<void> {
    this.previewValue = value;
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside() {
    this.focused = false;
  }

  async setValueAndEmit(value: Date) {
    await this.setValue(value);
    this.emitInput();
  }

  emitInput() {
    this.input.emit(this.value.slice(0, -3));
  }

  getYearLabel() {
    const month = new Date(this.previewValue.getTime());
    month.setMonth(month.getMonth());
    const year = month.getFullYear();
    return year;
  }

  outOfBounds(date: Date): boolean {
    return (
      (this.maxDate !== '' && fromIsoDate(this.maxDate) < date) ||
      (this.minDate !== '' && fromIsoDate(this.minDate) > date)
    );
  }

  incrementPreviewDateByYear(increment: number) {
    const guxRightButton =
      this.root.shadowRoot.querySelector('button.gux-right');
    const guxLeftButton = this.root.shadowRoot.querySelector('button.gux-left');
    this.yearLabel = this.yearLabel + increment;

    if (this.yearLabel === parseInt(this.maxDate)) {
      guxRightButton.setAttribute('disabled', 'true');
    } else if (this.yearLabel === parseInt(this.minDate)) {
      guxLeftButton.setAttribute('disabled', 'true');
    } else {
      if (guxRightButton && guxRightButton.hasAttribute('disabled')) {
        guxRightButton.removeAttribute('disabled');
      }

      if (guxLeftButton && guxLeftButton.hasAttribute('disabled')) {
        guxLeftButton.removeAttribute('disabled');
      }
    }

    this.getDisabledMonths();

    this.previewValue = new Date(
      this.previewValue.getFullYear() + increment,
      this.previewValue.getMonth(),
      15, // Don't use the day from the old value, because we'll skip a month on the 31st
      0,
      0,
      0
    );
    this.getMonths();
    // Wait for render before focusing preview date
    setTimeout(() => {
      void this.focusPreviewMonth();
    });
  }

  async onMonthClick(date: Date, monthIndex: number) {
    if (!this.outOfBounds(date)) {
      if (this.lastPickedMonth) {
        this.lastPickedMonth.classList.remove('gux-selected');
      }
      await this.setValueAndEmit(date);
      const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
        `td[id="${monthIndex}"] button`
      );
      if (target) {
        target.classList.add('gux-selected');
      }
      this.lastPickedMonth = target;
    }
  }

  getMonths() {
    // January
    const month = new Date(this.previewValue.getFullYear(), 0);
    this.monthsArray = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(this.previewValue.getFullYear(), i);
      this.monthsArray.push(monthDate);

      const monthNameLong = month.toLocaleString(this.locale, {
        month: 'long'
      });
      const monthNameShort = month.toLocaleString(this.locale, {
        month: 'short'
      });
      const monthNameLongFormatted =
        monthNameLong.charAt(0).toUpperCase() + monthNameLong.slice(1);
      const monthNameShortFormatted =
        monthNameShort.charAt(0).toUpperCase() + monthNameShort.slice(1);
      this.monthsListLong.push(monthNameLongFormatted);
      this.monthsListShort.push(monthNameShortFormatted);

      month.setMonth(month.getMonth() + 1);
    }
  }

  /**
   * Disables months out of specified range
   */
  getDisabledMonths() {
    for (let i = 0; i < 12; i++) {
      if (this.root.shadowRoot.querySelector(`td[id="${i}"] button`)) {
        this.root.shadowRoot
          .querySelector(`td[id="${i}"] button`)
          .classList.remove('gux-disabled');
      }

      // min
      if (this.yearLabel === parseInt(this.minDate)) {
        if (
          fromIsoDate(this.minDate).toLocaleString(this.locale, {
            month: 'long'
          }) === this.monthsListLong[i]
        ) {
          // disable previous months
          for (let j = i - 1; j >= 0; j--) {
            this.root.shadowRoot
              .querySelector(`td[id="${j}"] button`)
              .classList.add('gux-disabled');
          }
        }
      }

      // max
      if (this.yearLabel === parseInt(this.maxDate)) {
        if (
          fromIsoDate(this.maxDate).toLocaleString(this.locale, {
            month: 'long'
          }) === this.monthsListLong[i]
        ) {
          // disable future months
          for (let k = i + 1; k < 12; k++) {
            this.root.shadowRoot
              .querySelector(`td[id="${k}"] button`)
              .classList.add('gux-disabled');
          }

          i = 12;
        }
      }
    }
  }

  @Listen('keydown')
  async onKeyDown(event: KeyboardEvent) {
    const previewValue = this.previewValue;
    const month = previewValue;

    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        await this.onMonthClick(previewValue, month.getMonth());
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.previewValue = this.previewValue = new Date(
          this.previewValue.setMonth(month.getMonth() + 3)
        );
        setTimeout(() => {
          void this.focusPreviewMonth();
        });
        this.focused = true;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.previewValue = this.previewValue = new Date(
          this.previewValue.setMonth(month.getMonth() - 3)
        );
        setTimeout(() => {
          void this.focusPreviewMonth();
        });
        this.focused = true;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previewValue = this.previewValue = new Date(
          this.previewValue.setMonth(month.getMonth() - 1)
        );
        setTimeout(() => {
          void this.focusPreviewMonth();
        });
        this.focused = true;
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.previewValue = this.previewValue = new Date(
          this.previewValue.setMonth(month.getMonth() + 1)
        );
        setTimeout(() => {
          void this.focusPreviewMonth();
        });
        this.focused = true;
        break;
    }
  }

  renderCalendarTable() {
    return (
      <table>
        <tr>
          {this.monthsArray.slice(0, 3).map(
            month =>
              (
                <td id={month.getMonth().toString()}>
                  <button
                    onClick={() => this.onMonthClick(month, month.getMonth())}
                  >
                    {this.monthsListShort[month.getMonth()]}
                  </button>
                  <span class="gux-sr-only">
                    {month.toLocaleString(this.locale, { month: 'long' })}{' '}
                    {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {this.monthsArray.slice(3, 6).map(
            month =>
              (
                <td id={month.getMonth().toString()}>
                  <button
                    onClick={() => this.onMonthClick(month, month.getMonth())}
                  >
                    {this.monthsListShort[month.getMonth()]}
                  </button>
                  <span class="gux-sr-only">
                    {month.toLocaleString(this.locale, { month: 'long' })}{' '}
                    {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {this.monthsArray.slice(6, 9).map(
            month =>
              (
                <td id={month.getMonth().toString()}>
                  <button
                    onClick={() => this.onMonthClick(month, month.getMonth())}
                  >
                    {this.monthsListShort[month.getMonth()]}
                  </button>
                  <span class="gux-sr-only">
                    {month.toLocaleString(this.locale, { month: 'long' })}{' '}
                    {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {this.monthsArray.slice(9, 12).map(
            month =>
              (
                <td id={month.getMonth().toString()}>
                  <button
                    onClick={() => this.onMonthClick(month, month.getMonth())}
                  >
                    {this.monthsListShort[month.getMonth()]}
                  </button>
                  <span class="gux-sr-only">
                    {month.toLocaleString(this.locale, { month: 'long' })}{' '}
                    {this.yearLabel}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
      </table>
    ) as JSX.Element;
  }

  render() {
    return (
      <div class="gux-month-calendar">
        <div class="gux-header">
          <button
            type="button"
            class="gux-left"
            onClick={() => this.incrementPreviewDateByYear(-1)}
            tabindex="-1"
            aria-hidden="true"
          >
            <gux-icon decorative icon-name="chevron-small-left"></gux-icon>
          </button>
          <div class="gux-year-list">
            <label>{this.getYearLabel()}</label>
          </div>
          <button
            type="button"
            class="gux-right"
            onClick={() => this.incrementPreviewDateByYear(1)}
            tabindex="-1"
            aria-hidden="true"
          >
            <gux-icon decorative icon-name="chevron-small-right"></gux-icon>
          </button>
        </div>
        <div class="gux-content">{this.renderCalendarTable()}</div>
      </div>
    ) as JSX.Element;
  }
}
