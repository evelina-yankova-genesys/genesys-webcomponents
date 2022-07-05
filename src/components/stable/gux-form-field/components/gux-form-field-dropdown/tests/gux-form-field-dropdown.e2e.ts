import { E2EPage, newE2EPage } from '@stencil/core/testing';
import {
  newSparkE2EPage,
  a11yCheck
} from '../../../../../../../tests/e2eTestUtils';

const axeExclusions = [];

async function newNonrandomE2EPage({
  html
}: {
  html: string;
}): Promise<E2EPage> {
  const page = await newE2EPage();

  await page.evaluateOnNewDocument(() => {
    Math.random = () => 0.5;
  });
  await page.setContent(html);
  await page.waitForChanges();

  return page;
}

describe('gux-form-field-dropdown', () => {
  describe('#render', () => {
    describe('single select dropdown', () => {
      describe('label-position', () => {
        [
          '',
          'label-position="above"',
          'label-position="beside"',
          'label-position="screenreader"'
        ].forEach((componentAttribute, index) => {
          const html = `
            <gux-form-field-dropdown ${componentAttribute}>
              <gux-dropdown>
                <gux-listbox>
                  <gux-option value="a" disabled>Ant</gux-option>
                  <gux-option value="b">Bat</gux-option>
                  <gux-option value="c">Cat</gux-option>
                </gux-listbox>
              </gux-dropdown>
              <label slot="label">Default</label>
              <span slot="error">This is an error message</span>
            </gux-form-field-dropdown>
          `;

          it(`should render component as expected (${index + 1})`, async () => {
            const page = await newNonrandomE2EPage({ html });
            const element = await page.find('gux-form-field-dropdown');
            const elementShadowDom = await element.find(
              'pierce/.gux-form-field-container'
            );

            expect(element.outerHTML).toMatchSnapshot();
            expect(elementShadowDom).toMatchSnapshot();
          });

          it(`should be accessible (${index + 1})`, async () => {
            const page = await newSparkE2EPage({ html });

            await a11yCheck(page, axeExclusions);
          });
        });
      });

      describe('input attributes', () => {
        ['', 'disabled', 'required'].forEach((inputAttribute, index) => {
          const html = `
          <gux-form-field-dropdown>
            <gux-dropdown ${inputAttribute}>
              <gux-listbox>
                <gux-option value="a" disabled>Ant</gux-option>
                <gux-option value="b">Bat</gux-option>
                <gux-option value="c">Cat</gux-option>
              </gux-listbox>
            </gux-dropdown>
            <label slot="label">This will be read by a screen reader</label>
          </gux-form-field-dropdown>
          `;

          it(`should render component as expected (${index + 1})`, async () => {
            const page = await newNonrandomE2EPage({ html });
            const element = await page.find('gux-form-field-dropdown');
            const elementShadowDom = await element.find(
              'pierce/.gux-form-field-container'
            );

            expect(element.outerHTML).toMatchSnapshot();
            expect(elementShadowDom).toMatchSnapshot();
          });

          it(`should be accessible (${index + 1})`, async () => {
            const page = await newSparkE2EPage({ html });

            await a11yCheck(page, axeExclusions);
          });
        });
      });
    });
    describe('multi select dropdown', () => {
      describe('label-position', () => {
        [
          '',
          'label-position="above"',
          'label-position="beside"',
          'label-position="screenreader"'
        ].forEach((componentAttribute, index) => {
          const html = `
            <gux-form-field-dropdown ${componentAttribute}>
              <gux-dropdown-multi-beta>
                <gux-listbox-multi>
                  <gux-option-multi value="a" disabled>Ant</gux-option-multi>
                  <gux-option-multi value="b">Bat</gux-option-multi>
                  <gux-option-multi value="c">Cat</gux-option-multi>
                </gux-listbox-multi>
              </gux-dropdown-multi-beta>
              <label slot="label">Default</label>
              <span slot="error">This is an error message</span>
            </gux-form-field-dropdown>
          `;

          it(`should render component as expected (${index + 1})`, async () => {
            const page = await newNonrandomE2EPage({ html });
            const element = await page.find('gux-form-field-dropdown');
            const elementShadowDom = await element.find(
              'pierce/.gux-form-field-container'
            );

            expect(element.outerHTML).toMatchSnapshot();
            expect(elementShadowDom).toMatchSnapshot();
          });

          it(`should be accessible (${index + 1})`, async () => {
            const page = await newSparkE2EPage({ html });

            await a11yCheck(page, axeExclusions);
          });
        });
      });
      ['', 'disabled', 'required'].forEach((inputAttribute, index) => {
        const html = `
          <gux-form-field-dropdown>
            <gux-dropdown-multi-beta ${inputAttribute}>
              <gux-listbox-multi>
                <gux-option-multi value="a" disabled>Ant</gux-option-multi>
                <gux-option-multi value="b">Bat</gux-option-multi>
                <gux-option-multi value="c">Cat</gux-option-multi>
              </gux-listbox-multi>
            </gux-dropdown-multi-beta>
            <label slot="label">Default</label>
          </gux-form-field-dropdown>
        `;

        it(`should render component as expected (${index + 1})`, async () => {
          const page = await newNonrandomE2EPage({ html });
          const element = await page.find('gux-form-field-dropdown');
          const elementShadowDom = await element.find(
            'pierce/.gux-form-field-container'
          );

          expect(element.outerHTML).toMatchSnapshot();
          expect(elementShadowDom).toMatchSnapshot();
        });

        it(`should be accessible (${index + 1})`, async () => {
          const page = await newSparkE2EPage({ html });

          await a11yCheck(page, axeExclusions);
        });
      });
    });
  });
});
