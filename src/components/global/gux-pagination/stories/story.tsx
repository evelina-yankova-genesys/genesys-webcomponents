import { action } from '@storybook/addon-actions';
import { array, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/polymer';
import { withReadme } from 'storybook-readme';

import readme from '../readme.md';

const createComponent = () => document.createElement('gux-pagination');

const createActionLoggers = story => {
  const component = story();

  component.addEventListener('pageChanged', ev =>
    action('pageChanged')(ev.detail)
  );

  component.addEventListener('itemsPerPageChanged', ev =>
    action('itemsPerPageChanged')(ev.detail)
  );

  return component;
};

storiesOf('Pagination', module)
  .addDecorator(createActionLoggers)
  .add(
    'Simple',
    withReadme(readme, () => {
      const component = createComponent();
      component.totalItems = number('totalItems', 250);

      return component;
    })
  )
  .add(
    'Complex',
    withReadme(readme, () => {
      const component = createComponent();
      component.totalItems = number('totalItems', 250);
      component.currentPage = number('currentPage', 3);

      // Items per page as optional, mutable props
      component.itemsPerPage = number('itemsPerPage', 5);
      component.itemsPerPageOptions = array('itemsPerPageOptions', [5, 10, 20]);

      return component;
    })
  )
  .add(
    'No Items Per Page options',
    withReadme(readme, () => {
      const component = createComponent();
      component.totalItems = number('totalItems', 250);
      component.currentPage = number('currentPage', 3);

      const itemsPerPage = number('setItemsPerPage(value)', 20);

      component.componentOnReady().then(() => {
        component.setItemsPerPage(itemsPerPage, []);
      });

      return component;
    })
  )
  .add(
    'Responsive Sizing',
    withReadme(readme, () => {
      const component = createComponent();
      component.totalItems = 250;
      component.currentPage = 3;

      const containerSize = number('containerSize', 600, {
        max: 800,
        min: 250,
        range: true,
        step: 10
      });

      if (containerSize >= 600) {
        component.layout = 'large';
      } else if (containerSize >= 350) {
        component.layout = 'medium';
      } else {
        component.layout = 'small';
      }

      // TODO: When .ts file imports are fixed (https://inindca.atlassian.net/browse/COMUI-66), this should be
      // used instead of the hardcoded values.  The '| string' typing on the prop can probably be dropped
      // as well.
      // if (containerSize > recommendedBreakpoints.Medium) {
      //   component.paginationSize = GuxPaginationSize.Large;
      // } else if (containerSize > recommendedBreakpoints.Small) {
      //   component.paginationSize = GuxPaginationSize.Medium;
      // } else {
      //   component.paginationSize = GuxPaginationSize.Small;
      // }

      const container = document.createElement('div');
      container.setAttribute(
        'style',
        `border: 2px dotted; width: ${containerSize}px; padding: 4px 8px`
      );
      container.appendChild(component);

      return container;
    })
  );
