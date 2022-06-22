# gux-toolbar-action



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type      | Default     |
| --------- | --------- | ----------- | --------- | ----------- |
| `icon`    | `icon`    |             | `string`  | `undefined` |
| `primary` | `primary` |             | `boolean` | `undefined` |


## Methods

### `guxActionFocus() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `guxGetActiveAction() => Promise<boolean>`



#### Returns

Type: `Promise<boolean>`



### `guxSetActive(active: boolean) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [gux-tooltip-title](../../../stable/gux-tooltip-title)
- [gux-icon](../../../stable/gux-icon)

### Graph
```mermaid
graph TD;
  gux-toolbar-action --> gux-tooltip-title
  gux-toolbar-action --> gux-icon
  gux-tooltip-title --> gux-tooltip
  style gux-toolbar-action fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
