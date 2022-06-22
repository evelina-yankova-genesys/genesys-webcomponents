# gux-form-field-text-like



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description | Type                                    | Default     |
| --------------- | ---------------- | ----------- | --------------------------------------- | ----------- |
| `clearable`     | `clearable`      |             | `boolean`                               | `undefined` |
| `labelPosition` | `label-position` |             | `"above" \| "beside" \| "screenreader"` | `undefined` |
| `prefix`        | `prefix`         |             | `boolean`                               | `undefined` |
| `suffix`        | `suffix`         |             | `boolean`                               | `undefined` |


## Slots

| Slot       | Description                     |
| ---------- | ------------------------------- |
| `"error"`  | Optional slot for error message |
| `"input"`  | Required slot for input tag     |
| `"label"`  | Required slot for label tag     |
| `"prefix"` | Optionsal slot for prefix       |
| `"suffix"` | Optionsal slot for suffix       |


## Dependencies

### Used by

 - [gux-pagination-buttons](../../../gux-pagination/gux-pagination-buttons)

### Depends on

- [gux-form-field-input-clear-button](../../helper-components/gux-form-field-input-clear-button)
- [gux-icon](../../../gux-icon)

### Graph
```mermaid
graph TD;
  gux-form-field-text-like --> gux-form-field-input-clear-button
  gux-form-field-text-like --> gux-icon
  gux-form-field-input-clear-button --> gux-icon
  gux-pagination-buttons --> gux-form-field-text-like
  style gux-form-field-text-like fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
