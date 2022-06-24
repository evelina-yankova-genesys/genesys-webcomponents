import { GuxMonthCalendar } from '../gux-month-calendar';

describe('gux-month-calendar-beta', () => {
  let component: GuxMonthCalendar;
  let componentRoot: any;
  let componentShadowRoot: any;

  beforeEach(async () => {
    component = new GuxMonthCalendar();
    component.input = {
      emit: jest.fn()
    };
    componentRoot = component.root as any;
    componentShadowRoot = {} as any;
    componentRoot.shadowRoot = componentShadowRoot;

    componentShadowRoot.querySelector = () => {
      return null;
    };
    componentShadowRoot.querySelectorAll = () => {
      return [];
    };
  });
  it('builds', () => {
    component.componentWillLoad();
    component.render();
    expect(component).toBeTruthy();
  });
  // Methods
  describe('methods', () => {
    const testDate = new Date(2022, 0, 1);
    const testValue = '2022-01-01';
    const spyEl = {
      classList: {
        add: jest.fn(),
        contains: () => false
      },
      focus: jest.fn(),
      setAttribute: jest.fn()
    };
    // Public
    describe('public', () => {
      it('setValue', async () => {
        await component.setValue(testDate);
        expect(component.previewValue).toEqual(testDate);
        expect(component.value).toEqual(testValue);
      });
      it('focusPreviewDate', async () => {
        await component.focusPreviewMonth();
        expect(spyEl.focus).not.toHaveBeenCalled();
        componentShadowRoot.querySelector = () => {
          return spyEl;
        };
        await component.focusPreviewMonth();
        expect(spyEl.focus).toHaveBeenCalled();
      });
    });
    // Private
    describe('private', () => {
      it('incrementPreviewDateByMonth', async () => {
        jest.useFakeTimers();
        await component.setValue(testDate);
        component.yearLabel = 2022;
        const startingYear = component.yearLabel;
        component.incrementPreviewDateByYear(1);
        jest.runAllTimers();
        expect(component.yearLabel).toEqual(startingYear + 1);
      });
      it('onMonthClick', async () => {
        spyOn(component, 'setValue').and.callFake(() => {
          return;
        });
        await component.onMonthClick(testDate, 0);
        expect(component.setValue).toHaveBeenCalledWith(testDate);
      });
      it('onKeyDown', async () => {
        jest.useFakeTimers();
        spyOn(component, 'setValue').and.callFake(() => {
          return;
        });
        await component.setValue(testDate);
        component.getMonths();
        component.previewValue = testDate;
        component.yearLabel = 2022;
        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.getMonth()).toEqual(3);
        event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.getMonth()).toEqual(4);
        event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.getMonth()).toEqual(1);
        event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.getMonth()).toEqual(0);
        event = new KeyboardEvent('keydown', { key: 'Enter' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.setValue).toHaveBeenCalledTimes(2);
      });
      it('getMonths', () => {
        component.getMonths();
        expect(Object.keys(component.monthsArray).length).toEqual(12);
      });
    });
  });

  // Events
  describe('events', () => {
    it('onInput', async () => {
      const testDate = new Date(2022, 0, 1);
      const testValue = '2022-01';
      await component.setValue(testDate);
      component.emitInput();
      expect(component.input.emit).toHaveBeenCalledWith(testValue);
    });
  });
});
