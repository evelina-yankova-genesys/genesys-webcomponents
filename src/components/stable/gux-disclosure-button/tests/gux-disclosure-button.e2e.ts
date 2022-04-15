import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';

const axeExclusions = [];

describe('gux-disclosure-button', () => {
  it('renders', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-disclosure-button></gux-disclosure-button>`
    });

    const element = await page.find('gux-disclosure-button');
    await a11yCheck(page, axeExclusions);
    expect(element).toHaveAttribute('hydrated');
  });

  it('renders panel when button pressed', async () => {
    const page = await newSparkE2EPage({
      html: `<gux-disclosure-button></gux-disclosure-button>`
    });

    page.waitForChanges();
    const button = await page.find('.gux-disclosure-button');
    const panel = await page.find('.gux-disclosure-panel');
    await button.click();
    expect(panel).toHaveClass('gux-active');
  });

  describe('disclosure panel is-open', () => {
    it('should not open disclosure panel when property openAtStart is set to false or not specified', async () => {
      const page = await newSparkE2EPage({
        html: `<gux-disclosure-button></gux-disclosure-button>`
      });

      page.waitForChanges();
      const panel = await page.find('.gux-disclosure-panel');
      await a11yCheck(page, axeExclusions);
      expect(panel).not.toHaveClass('gux-active');
    });

    it('opens disclosure panel when property openAtStart is set to true', async () => {
      const page = await newSparkE2EPage({
        html: `<gux-disclosure-button is-open="true"></gux-disclosure-button>`
      });

      page.waitForChanges();
      const panel = await page.find('.gux-disclosure-panel');
      await a11yCheck(page, axeExclusions);
      expect(panel).toHaveClass('gux-active');
    });
  });

  describe('button icon', () => {
    const expandRight = 'arrow-solid-right';
    const expandLeft = 'arrow-solid-left';

    const testStates = [
      {
        initial: { position: 'left', isOpen: false, expectedIcon: expandRight },
        updated: { isOpen: true, expectedIcon: expandLeft }
      } as const,
      {
        initial: { position: 'right', isOpen: false, expectedIcon: expandLeft },
        updated: { isOpen: true, expectedIcon: expandRight }
      } as const
    ];

    testStates.forEach(({ initial, updated }, index) => {
      it(`should update on is-open change (${index + 1})`, async () => {
        const page = await newSparkE2EPage({
          html: `<gux-disclosure-button position="${initial.position}" is-open="${initial.isOpen}"></gux-disclosure-button>`
        });

        page.waitForChanges();

        const disclosureElement = await page.find('gux-disclosure-button');
        const iconElement = await page.find('gux-icon');

        expect(iconElement).toEqualAttribute('icon-name', initial.expectedIcon);

        disclosureElement.setAttribute('is-open', updated.isOpen);
        await page.waitForChanges();
        expect(iconElement).toEqualAttribute('icon-name', updated.expectedIcon);
      });

      it(`should update on button click (${index + 1})`, async () => {
        const page = await newSparkE2EPage({
          html: `<gux-disclosure-button position="${initial.position}" is-open="${initial.isOpen}"></gux-disclosure-button>`
        });

        page.waitForChanges();

        const buttonElement = await page.find('.gux-disclosure-button');
        const iconElement = await page.find('gux-icon');

        expect(iconElement).toEqualAttribute('icon-name', initial.expectedIcon);

        await buttonElement.click();
        expect(iconElement).toEqualAttribute('icon-name', updated.expectedIcon);
      });
    });
  });
});
