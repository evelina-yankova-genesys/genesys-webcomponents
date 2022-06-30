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
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import translationResources from './i18n/en.json';
import { OnClickOutside } from '../../../utils/decorator/on-click-outside';
import { MonthOfYear } from './gux-month-calendar.types';
import {
  getTranslatedMonthsLong,
  getTranslatedMonthsShort
} from './gux-month-calendar.service';

@Component({
  styleUrl: 'gux-month-calendar.less',
  tag: 'gux-month-calendar-beta',
  shadow: true
})
export class GuxMonthCalendar {
  private i18n: GetI18nValue;

  @Element()
  root: HTMLElement;

  /**
   * The current selected year and month
   */
  @Prop({ mutable: true })
  value: string = '';

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
  previewValue: MonthOfYear;

  @State()
  translatedMonthsShortArray: Array<string> = [];

  @State()
  translatedMonthsLongArray: Array<string> = [];

  @State()
  monthsArray: Array<MonthOfYear> = [];

  @State()
  focused: boolean = false;

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

    const value = this.splitValue(this.value);
    this.previewValue = {
      year: parseInt(value[0]),
      month: parseInt(value[1])
    };

    this.translatedMonthsShortArray = getTranslatedMonthsShort(this.i18n);
    this.translatedMonthsLongArray = getTranslatedMonthsLong(this.i18n);

    this.getMonths();
  }

  componentDidLoad() {
    const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
      `td[id="${this.previewValue.month}"] button`
    );
    if (target) {
      target.classList.add('gux-selected');
    }
  }

  /**
   * Sets new value
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async setValue(value: string) {
    const valueSplit = this.splitValue(value);
    const year = valueSplit[0];
    const month =
      valueSplit[1].length < 2 ? `0${valueSplit[1]}` : valueSplit[1];
    this.value = `${year}-${month}`;

    this.previewValue = {
      year: parseInt(year),
      month: parseInt(month)
    };
  }

  /**
   * Focus the preview date
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async focusPreviewMonth() {
    const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
      `td[id="${this.previewValue.month}"] button`
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
  async resetCalendarView(): Promise<void> {
    const splitValue = this.splitValue(this.value);
    this.previewValue = {
      year: parseInt(splitValue[0]),
      month: parseInt(splitValue[1])
    };
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  onClickOutside() {
    this.focused = false;
  }

  async setValueAndEmit(value: string) {
    await this.setValue(value);
    this.emitInput();
  }

  emitInput() {
    this.input.emit(this.value);
  }

  splitValue(value: string) {
    return value.split('-');
  }

  outOfBounds(monthOfYear: MonthOfYear): boolean {
    const monthFormatted =
      monthOfYear.month.toString().length < 2
        ? `0${monthOfYear.month}`
        : monthOfYear.month;
    const monthAndYear = `${monthOfYear.year}-${monthFormatted}`;
    return (
      (this.maxDate !== '' && this.maxDate < monthAndYear) ||
      (this.minDate !== '' && this.minDate > monthAndYear)
    );
  }

  incrementPreviewDateByYear(increment: number) {
    const guxRightButton =
      this.root.shadowRoot.querySelector('button.gux-right');
    const guxLeftButton = this.root.shadowRoot.querySelector('button.gux-left');

    this.previewValue.year = this.previewValue.year + increment;

    if (this.previewValue.year === parseInt(this.splitValue(this.maxDate)[0])) {
      guxRightButton.setAttribute('disabled', 'true');
    } else if (
      this.previewValue.year === parseInt(this.splitValue(this.minDate)[0])
    ) {
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
    this.getMonths();

    // Wait for render before focusing preview date
    setTimeout(() => {
      void this.focusPreviewMonth();
    });
  }

  async onMonthClick(monthOfYear: MonthOfYear) {
    if (!this.outOfBounds(monthOfYear)) {
      const previouslySelectedMonth = this.root.shadowRoot.querySelector(
        'td button.gux-selected'
      );
      if (previouslySelectedMonth) {
        previouslySelectedMonth.classList.remove('gux-selected');
      }
      await this.setValueAndEmit(`${monthOfYear.year}-${monthOfYear.month}`);
      const target: HTMLTableCellElement = this.root.shadowRoot.querySelector(
        `td[id="${monthOfYear.month}"] button`
      );
      if (target) {
        target.classList.add('gux-selected');
      }
    }
  }

  getMonths() {
    // reset displayed months array
    this.monthsArray = [];

    for (let i = 1; i < 13; i++) {
      const monthYearObj = {
        year: this.previewValue.year,
        month: i
      };
      this.monthsArray.push(monthYearObj);
    }
  }

  /**
   * Disables months out of specified range
  //  */
  getDisabledMonths() {
    for (let i = 1; i < 13; i++) {
      if (this.root.shadowRoot.querySelector(`td[id="${i}"] button`)) {
        this.root.shadowRoot
          .querySelector(`td[id="${i}"] button`)
          .removeAttribute('disabled');
      }

      const splitMinDate = this.splitValue(this.minDate);
      const splitMaxDate = this.splitValue(this.maxDate);

      // min
      if (this.previewValue.year === parseInt(splitMinDate[0])) {
        // disable previous months
        for (let j = parseInt(splitMinDate[1]) - 1; j > 0; j--) {
          this.root.shadowRoot
            .querySelector(`td[id="${j}"] button`)
            .setAttribute('disabled', 'true');
        }
      }

      // max
      if (this.previewValue.year === parseInt(splitMaxDate[0])) {
        // disable future months
        for (let k = parseInt(splitMaxDate[1]) + 1; k < 13; k++) {
          this.root.shadowRoot
            .querySelector(`td[id="${k}"] button`)
            .setAttribute('disabled', 'true');
        }

        i = 13;
      }
    }
  }

  checkForYearRollover(previewValue: MonthOfYear) {
    if (previewValue.month > 12) {
      this.previewValue.month = 1;
      this.incrementPreviewDateByYear(1);
      this.getMonths();
    } else if (previewValue.month < 1) {
      this.previewValue.month = 12;
      this.incrementPreviewDateByYear(-1);
      this.getMonths();
    }
  }

  @Listen('keydown')
  async onKeyDown(event: KeyboardEvent) {
    const previewValue = this.previewValue;

    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        await this.onMonthClick(previewValue);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.outOfBounds(this.previewValue)) {
          this.previewValue.month = this.previewValue.month + 3;
          this.checkForYearRollover(this.previewValue);
        }
        setTimeout(() => {
          void this.focusPreviewMonth();
        });
        this.focused = true;
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.outOfBounds(this.previewValue)) {
          this.previewValue.month = this.previewValue.month - 3;
          this.checkForYearRollover(this.previewValue);
        }
        setTimeout(() => {
          void this.focusPreviewMonth();
        });
        this.focused = true;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (!this.outOfBounds(this.previewValue)) {
          this.previewValue.month = this.previewValue.month - 1;
          this.checkForYearRollover(this.previewValue);
        }
        setTimeout(() => {
          void this.focusPreviewMonth();
        });
        this.focused = true;
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (!this.outOfBounds(this.previewValue)) {
          this.previewValue.month = this.previewValue.month + 1;
          this.checkForYearRollover(this.previewValue);
        }
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
            monthOfYear =>
              (
                <td id={monthOfYear.month.toString()}>
                  <button onClick={() => this.onMonthClick(monthOfYear)}>
                    {this.translatedMonthsShortArray[monthOfYear.month]}
                  </button>
                  <span class="gux-sr-only">
                    {this.translatedMonthsLongArray[monthOfYear.month]}{' '}
                    {monthOfYear.year}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {this.monthsArray.slice(3, 6).map(
            monthOfYear =>
              (
                <td id={monthOfYear.month.toString()}>
                  <button onClick={() => this.onMonthClick(monthOfYear)}>
                    {this.translatedMonthsShortArray[monthOfYear.month]}
                  </button>
                  <span class="gux-sr-only">
                    {this.translatedMonthsLongArray[monthOfYear.month]}{' '}
                    {monthOfYear.year}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {this.monthsArray.slice(6, 9).map(
            monthOfYear =>
              (
                <td id={monthOfYear.month.toString()}>
                  <button onClick={() => this.onMonthClick(monthOfYear)}>
                    {this.translatedMonthsShortArray[monthOfYear.month]}
                  </button>
                  <span class="gux-sr-only">
                    {this.translatedMonthsLongArray[monthOfYear.month]}{' '}
                    {monthOfYear.year}
                  </span>
                </td>
              ) as JSX.Element
          )}
        </tr>
        <tr>
          {this.monthsArray.slice(9, 12).map(
            monthOfYear =>
              (
                <td id={monthOfYear.month.toString()}>
                  <button onClick={() => this.onMonthClick(monthOfYear)}>
                    {this.translatedMonthsShortArray[monthOfYear.month]}
                  </button>
                  <span class="gux-sr-only">
                    {this.translatedMonthsLongArray[monthOfYear.month]}{' '}
                    {monthOfYear.year}
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
            <label>{this.previewValue.year}</label>
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
