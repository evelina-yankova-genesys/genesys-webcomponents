import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { a11yCheck } from '../../../../../tests/e2eTestUtils';

const axeExclusions = [
  {
    issueId: 'duplicate-id-aria',
    exclusionReason:
      'Test uses seeded value for Math.random, so duplicate ids are expected'
  }
];

async function newNonrandomE2EPage(
  {
    html
  }: {
    html: string;
  },
  lang: string = 'en'
): Promise<E2EPage> {
  const page = await newE2EPage();

  await page.evaluateOnNewDocument(() => {
    Math.random = () => 0.5;
  });
  await page.setContent(`<div lang=${lang}>${html}</div>`);
  await page.waitForChanges();
  await page.addScriptTag({
    path: 'node_modules/axe-core/axe.min.js'
  });
  await page.waitForChanges();

  return page;
}

describe('gux-table-beta', () => {
  const tableContent = `
    <table slot="data">
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th data-cell-numeric>Age</th>
          <th data-cell-action>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John</td>
          <td>Doe</td>
          <td data-cell-numeric>25</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>21</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
      </tbody>
    </table>
  `;

  describe('#render', () => {
    [
      {
        description: 'empty table',
        html: `
        <gux-table-beta>
          <table slot="data">
            <thead>
              <tr>
                <th>First name</th>
                <th>Last name</th>
                <th data-cell-numeric>Age</th>
                <th data-cell-action>Action</th>
              </tr>
            </thead>
          </table>
        </gux-table-beta>
        `
      },
      {
        description: 'should render data table',
        html: `<gux-table-beta>${tableContent}</gux-table-beta>`
      },
      {
        description: 'should render compact data table',
        html: `<gux-table-beta compact>${tableContent}</gux-table-beta>`
      },
      {
        description: 'should render object table',
        html: `<gux-table-beta object-table>${tableContent}</gux-table-beta>`
      },

      {
        description: 'should render table with vertical scroll',
        html: `<gux-table-beta style="height: 150px">${tableContent}</gux-table-beta>`
      },
      {
        description: 'should render table with horizontal scroll',
        html: `<gux-table-beta style="width: 300px">${tableContent}</gux-table-beta>`
      },
      {
        description: 'should render table with rows selection',
        html: `<gux-table-beta object-table selectable-rows>${tableContent}</gux-table-beta>`
      },
      {
        description: 'should render empty table with rows selection',
        html: `
          <gux-table-beta object-table selectable-rows>
            <table slot="data">
              <thead>
                <tr>
                  <th>First name</th>
                  <th>Last name</th>
                  <th data-cell-numeric>Age</th>
                  <th data-cell-action>Action</th>
                </tr>
              </thead>
            </table>
          </gux-table-beta>
        `
      },
      {
        description: 'should render a gux-table-select menu',
        html: `
          <gux-table-beta>
            <table slot="data">
              <thead>
                <tr data-row-id="head">
                  <th>
                  <gux-table-select-menu>
                  <gux-all-row-select></gux-all-row-select>
                  <gux-list slot="select-menu-options">
                    <gux-list-item onclick="notify(event)">
                      All on page
                    </gux-list-item>
                    <gux-list-item onclick="notify(event)"> None </gux-list-item>
                    <gux-list-item onclick="notify(event)">
                      Bring selected to top
                    </gux-list-item>
                  </gux-list>
                </gux-table-select-menu>
      
                  </th>
                  <th data-column-name="first-name">First name</th>
                  <th data-column-name="last-name">Last name</th>
                  <th data-column-name="age" data-cell-numeric>Age</th>
                  <th data-column-name="action" data-cell-action>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr data-row-id="person-id-1">
                  <td><gux-row-select disabled></gux-row-select></td>
                  <td>John</td>
                  <td>Doe</td>
                  <td data-cell-numeric>25</td>
                  <td data-cell-action>Delete</td>
                </tr>
                <tr data-row-id="person-id-2">
                  <td><gux-row-select></gux-row-select></td>
                  <td>Jane</td>
                  <td>Doe</td>
                  <td data-cell-numeric>23</td>
                  <td data-cell-action>Delete</td>
                </tr>
                <tr data-row-id="person-id-3">
                  <td><gux-row-select disabled></gux-row-select></td>
                  <td>Jane</td>
                  <td>Doe</td>
                  <td data-cell-numeric>21</td>
                  <td data-cell-action>Delete</td>
                </tr>
                <tr data-row-id="person-id-4">
                  <td><gux-row-select></gux-row-select></td>
                  <td>Jane</td>
                  <td>Doe</td>
                  <td data-cell-numeric>23</td>
                  <td data-cell-action>Delete</td>
                </tr>
              </tbody>
            </table>
          </gux-table-beta>
        `
      }
    ].forEach(({ description, html }) => {
      it(description, async () => {
        const page = await newNonrandomE2EPage({ html });
        const element = await page.find('gux-table-beta');
        await a11yCheck(page, axeExclusions);

        expect(element).toHaveAttribute('hydrated');
        expect(element.outerHTML).toMatchSnapshot();
      });
      it(`${description} with i18n strings`, async () => {
        const page = await newNonrandomE2EPage({ html }, 'ja');
        const element = await page.find('gux-table-beta');
        await a11yCheck(page, axeExclusions);

        expect(element).toHaveAttribute('hydrated');
        expect(element.outerHTML).toMatchSnapshot();
      });
    });
  });

  it('should sort table if table header nested element is wrapped in a span tag', async () => {
    const html = `<gux-table-beta>
    <table slot="data">
      <thead>
        <tr>
          <th data-column-name="first-name" data-sortable aria-sort="ascending">
            <span>First name</span>
          </th>
          <th data-column-name="last-name">Last name</th>
          <th data-column-name="age" data-cell-numeric>Age</th>
          <th data-column-name="action" data-cell-action>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Adam</td>
          <td>Ant</td>
          <td data-cell-numeric>25</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Billy</td>
          <td>Bat</td>
          <td data-cell-numeric>28</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Cathy</td>
          <td>Cat</td>
          <td data-cell-numeric>21</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Debbie</td>
          <td>Dog</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
      </tbody>
    </table>
  </gux-table-beta>`;

    const page = await newE2EPage({ html });

    const columnSortSpy = await page.spyOnEvent('guxsortchanged');
    const headerElement = await page.find('th span');
    await headerElement.click();
    await page.waitForChanges();

    expect(columnSortSpy).toHaveReceivedEventDetail({
      columnName: 'first-name',
      sortDirection: 'descending'
    });
  });

  it('should sort table if table header nested element is not wrapped in a span tag', async () => {
    const html = `<gux-table-beta>
    <table slot="data">
      <thead>
        <tr>
          <th data-column-name="first-name" data-sortable aria-sort="ascending">
            First name
          </th>
          <th data-column-name="last-name">Last name</th>
          <th data-column-name="age" data-cell-numeric>Age</th>
          <th data-column-name="action" data-cell-action>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Adam</td>
          <td>Ant</td>
          <td data-cell-numeric>25</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Billy</td>
          <td>Bat</td>
          <td data-cell-numeric>28</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Cathy</td>
          <td>Cat</td>
          <td data-cell-numeric>21</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr>
          <td>Debbie</td>
          <td>Dog</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
      </tbody>
    </table>
  </gux-table-beta>`;

    const page = await newE2EPage({ html });

    const columnSortEvent = await page.spyOnEvent('guxsortchanged');
    const headerElement = await page.find('th');
    await headerElement.click();

    await page.waitForChanges();

    expect(columnSortEvent).toHaveReceivedEventDetail({
      columnName: 'first-name',
      sortDirection: 'descending'
    });
  });

  it('should return two elements as two of the rows are disabled.', async () => {
    const html = `<gux-table-beta object-table selectable-rows>
    <table slot="data">
      <thead>
        <tr data-row-id="head">
          <th><gux-all-row-select></gux-all-row-select></th>
          <th data-column-name="first-name">First name</th>
          <th data-column-name="last-name">Last name</th>
          <th data-column-name="age" data-cell-numeric>Age</th>
          <th data-column-name="action" data-cell-action>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr data-row-id="person-id-1">
          <td><gux-row-select disabled></gux-row-select></td>
          <td>John</td>
          <td>Doe</td>
          <td data-cell-numeric>25</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-2">
          <td><gux-row-select></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-3">
          <td><gux-row-select disabled></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>21</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-4">
          <td><gux-row-select></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
      </tbody>
    </table>
  </gux-table-beta>`;

    const page = await newE2EPage({ html });
    const selectAllEvent = await page.spyOnEvent('guxselectionchanged');
    const selectAllElement = await page.find('thead tr th gux-all-row-select');
    const inputElement = await selectAllElement.find('input');
    await inputElement.click();
    await page.waitForChanges();

    expect(selectAllEvent).toHaveReceivedEventDetail({
      selectedRowIds: ['person-id-2', 'person-id-4']
    });
  });

  it('should return the disabled selected element even if the select all input has been unselected.', async () => {
    const html = `<gux-table-beta object-table selectable-rows>
    <table slot="data">
      <thead>
        <tr data-row-id="head">
          <th><gux-all-row-select></gux-all-row-select></th>
          <th data-column-name="first-name">First name</th>
          <th data-column-name="last-name">Last name</th>
          <th data-column-name="age" data-cell-numeric>Age</th>
          <th data-column-name="action" data-cell-action>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr data-row-id="person-id-1">
          <td><gux-row-select selected disabled></gux-row-select></td>
          <td>John</td>
          <td>Doe</td>
          <td data-cell-numeric>25</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-2">
          <td><gux-row-select></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-3">
          <td><gux-row-select disabled></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>21</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-4">
          <td><gux-row-select></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
      </tbody>
    </table>
  </gux-table-beta>`;

    const page = await newE2EPage({ html });
    const selectAllEvent = await page.spyOnEvent('guxselectionchanged');
    const selectAllElement = await page.find('thead tr th gux-all-row-select');
    const inputElement = await selectAllElement.find('input');
    await inputElement.click();
    await page.waitForChanges();
    await inputElement.click();
    await page.waitForChanges();
    expect(selectAllEvent).toHaveReceivedEventDetail({
      selectedRowIds: ['person-id-1']
    });
  });

  it('should set the state of selectAll checkbox to true when all checkboxes that are not disabled are checked.', async () => {
    const html = `<gux-table-beta object-table selectable-rows>
    <table slot="data">
      <thead>
        <tr data-row-id="head">
          <th><gux-all-row-select></gux-all-row-select></th>
          <th data-column-name="first-name">First name</th>
          <th data-column-name="last-name">Last name</th>
          <th data-column-name="age" data-cell-numeric>Age</th>
          <th data-column-name="action" data-cell-action>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr data-row-id="person-id-1">
          <td><gux-row-select disabled></gux-row-select></td>
          <td>John</td>
          <td>Doe</td>
          <td data-cell-numeric>25</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-2">
          <td><gux-row-select class="person2" ></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-3">
          <td><gux-row-select disabled></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>21</td>
          <td data-cell-action>Delete</td>
        </tr>
        <tr data-row-id="person-id-4">
          <td><gux-row-select class="person4"></gux-row-select></td>
          <td>Jane</td>
          <td>Doe</td>
          <td data-cell-numeric>23</td>
          <td data-cell-action>Delete</td>
        </tr>
      </tbody>
    </table>
  </gux-table-beta>`;

    const page = await newE2EPage({ html });
    const selectAllElement = await page.find('thead tr th gux-all-row-select');
    const inputElement = await selectAllElement.find('input');

    const secondRow = await page.find('.person2');
    const secondRowInput = await secondRow.find('input');

    const fourthRow = await page.find('.person4');
    const fourthRowInput = await fourthRow.find('input');

    await secondRowInput.click();
    await page.waitForChanges();

    await fourthRowInput.click();
    await page.waitForChanges();

    expect(inputElement.getProperty('checked')).toBeTruthy();
  });
  it('should open and close the table select menu', async () => {
    const html = `
      <gux-table-beta>
        <table slot="data">
          <thead>
            <tr data-row-id="head">
              <th>
                <gux-table-select-menu>
                  <gux-all-row-select></gux-all-row-select>
                  <gux-list slot="select-menu-options">
                    <gux-list-item onclick="notify(event)">
                      All on page
                    </gux-list-item>
                    <gux-list-item onclick="notify(event)"> None </gux-list-item>
                    <gux-list-item onclick="notify(event)">
                      Bring selected to top
                    </gux-list-item>
                  </gux-list>
                </gux-table-select-menu>

              </th>
              <th data-column-name="first-name">First name</th>
              <th data-column-name="last-name">Last name</th>
              <th data-column-name="age" data-cell-numeric>Age</th>
              <th data-column-name="action" data-cell-action>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr data-row-id="person-id-1">
              <td><gux-row-select disabled></gux-row-select></td>
              <td>John</td>
              <td>Doe</td>
              <td data-cell-numeric>25</td>
              <td data-cell-action>Delete</td>
            </tr>
            <tr data-row-id="person-id-2">
              <td><gux-row-select></gux-row-select></td>
              <td>Jane</td>
              <td>Doe</td>
              <td data-cell-numeric>23</td>
              <td data-cell-action>Delete</td>
            </tr>
            <tr data-row-id="person-id-3">
              <td><gux-row-select disabled></gux-row-select></td>
              <td>Jane</td>
              <td>Doe</td>
              <td data-cell-numeric>21</td>
              <td data-cell-action>Delete</td>
            </tr>
            <tr data-row-id="person-id-4">
              <td><gux-row-select></gux-row-select></td>
              <td>Jane</td>
              <td>Doe</td>
              <td data-cell-numeric>23</td>
              <td data-cell-action>Delete</td>
            </tr>
          </tbody>
        </table>
      </gux-table-beta>
    `;

    const page = await newE2EPage({ html });

    const tableSelectMenuElement = await page.find('gux-table-select-menu');
    const tableSelectMenuButton = await tableSelectMenuElement.find(
      '.gux-select-menu-button'
    );
    const tableSelectPopover = await tableSelectMenuElement.find(
      'gux-table-select-popover'
    );

    expect(tableSelectPopover.getAttribute('hidden')).toBe('');

    await tableSelectMenuButton.click();
    await page.waitForChanges();

    expect(tableSelectPopover.getAttribute('hidden')).toBe(null);
  });
});
