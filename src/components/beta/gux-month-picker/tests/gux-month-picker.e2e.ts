import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

describe('gux-month-picker-beta', () => {
  it('renders', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-month-picker-beta lang="en"></gux-month-picker-beta>`
    });
    const element = await page.find('gux-month-picker-beta');
    expect(element).toHaveAttribute('hydrated');
  });

  it('updates the month display when the month picker’s value property is set', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-month-picker-beta lang="en" value="2022-01"></gux-month-picker-beta>`
    });

    const element = await page.find('gux-month-picker-beta');

    const span = await element.find('pierce/span');
    const value = await span.getProperty('innerText');
    await a11yCheck(page);
    expect(value).toBe('January 2022');
  });

  it('opens the calendar when the display is clicked', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-month-picker-beta lang="en"></gux-month-picker-beta>`
    });
    const monthpicker = await page.find('gux-month-picker-beta');
    const monthpickerContainer = await monthpicker.find(
      'pierce/.gux-month-picker-beta'
    );
    const button = await monthpickerContainer.find('pierce/.gux-month-picker');
    await button.click();
    await page.waitForChanges();
    await a11yCheck(page);
    expect(monthpickerContainer.className).toContain('gux-active');
  });

  it('opens and closes the calendar when the button is clicked', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-month-picker-beta lang="en"></gux-month-picker-beta>`
    });
    const monthpicker = await page.find('gux-month-picker-beta');
    const monthpickerContainer = await monthpicker.find(
      'pierce/.gux-month-picker-beta'
    );
    const calendarButton = await monthpickerContainer.find('button');
    await calendarButton.click();
    await page.waitForChanges();
    expect(monthpickerContainer.className).toContain('gux-active');
    const button = await monthpicker.find('pierce/.gux-calendar-toggle-button');
    await button.click();
    await page.waitForChanges();
    expect(monthpickerContainer.className).not.toContain('gux-active');
  });
});
