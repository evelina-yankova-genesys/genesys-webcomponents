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
    component.value = '2022-01';
    component.previewValue = {
      year: 2022,
      month: 1
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
  it('builds', async () => {
    await component.componentWillLoad();
    component.render();
    expect(component).toBeTruthy();
  });
  // Methods
  describe('methods', () => {
    const testValue = '2022-01';
    const testPreviewValue = {
      year: 2022,
      month: 1
    };
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
        await component.setValue(testValue);
        expect(component.previewValue).toEqual(testPreviewValue);
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
        await component.setValue(testValue);
        const startingYear = 2022;
        component.incrementPreviewDateByYear(1);
        jest.runAllTimers();
        expect(component.previewValue.year).toEqual(startingYear + 1);
      });
      it('onMonthClick', async () => {
        spyOn(component, 'setValue').and.callFake(() => {
          return;
        });
        await component.onMonthClick(testPreviewValue);
        expect(component.setValue).toHaveBeenCalledWith('2022-1');
      });
      it('onKeyDown', async () => {
        jest.useFakeTimers();
        spyOn(component, 'setValue').and.callFake(() => {
          return;
        });
        await component.setValue(testValue);
        component.getMonths();
        component.previewValue = testPreviewValue;
        let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.month).toEqual(4);
        event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.month).toEqual(5);
        event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.month).toEqual(2);
        event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        await component.onKeyDown(event);
        jest.runAllTimers();
        expect(component.previewValue.month).toEqual(1);
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
      const testValue = '2022-01';
      await component.setValue(testValue);
      component.emitInput();
      expect(component.input.emit).toHaveBeenCalledWith(testValue);
    });
  });
});
