import { newSparkE2EPage, a11yCheck } from '../../../../../tests/e2eTestUtils';
import { html } from './gux-accordion.markup';

describe('gux-accordion', () => {
  it('renders', async () => {
    const page = await newSparkE2EPage({ html });
    const element = await page.find('gux-accordion');

    await a11yCheck(page);

    expect(element.outerHTML).toMatchSnapshot();
  });
});
