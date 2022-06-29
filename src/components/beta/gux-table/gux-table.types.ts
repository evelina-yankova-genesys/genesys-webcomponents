export interface GuxTableColumnResizeState {
  resizableColumn: HTMLElement;
  resizableColumnInitialWidth: number;
  columnResizeMouseStartX: number;
}

export interface GuxTableSortState {
  columnName: string;
  sortDirection: string;
}

export interface GuxTableExpandedRowState {
  expanded: boolean;
  buttonId: string;
}

export interface GuxTableSelectedState {
  selectedRowIds: string[];
}
