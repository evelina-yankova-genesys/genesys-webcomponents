# gux-dropdown

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type      | Default     |
| ------------- | ------------- | ----------- | --------- | ----------- |
| `disabled`    | `disabled`    |             | `boolean` | `false`     |
| `filterable`  | `filterable`  |             | `boolean` | `false`     |
| `placeholder` | `placeholder` |             | `string`  | `undefined` |
| `required`    | `required`    |             | `boolean` | `false`     |
| `value`       | `value`       |             | `string`  | `undefined` |


## Slots

| Slot | Description                                      |
| ---- | ------------------------------------------------ |
|      | for a gux-listbox containing gux-option children |


## Dependencies

### Used by

 - [gux-pagination-items-per-page](../gux-pagination/gux-pagination-items-per-page)
 - [gux-pagination-items-per-page-beta](../../beta/gux-pagination-beta/gux-pagination-items-per-page-beta)

### Depends on

- [gux-icon](../gux-icon)
- [gux-popup](../gux-popup)

### Graph
```mermaid
graph TD;
  gux-dropdown --> gux-icon
  gux-dropdown --> gux-popup
  gux-pagination-items-per-page --> gux-dropdown
  gux-pagination-items-per-page-beta --> gux-dropdown
  style gux-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
