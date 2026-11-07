import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableActionsContext {
  $implicit: unknown;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() rows: unknown[] = [];
  @Input() loading = false;
  @Input() emptyTitle = 'No hay elementos todavía';
  @Input() emptyMessage = 'Cuando agregues el primero, aparecerá aquí.';
  @Input() showDefaultActions = true;
  @Output() edit = new EventEmitter<unknown>();
  @Output() delete = new EventEmitter<unknown>();
  @ContentChild('rowActions') rowActions?: TemplateRef<TableActionsContext>;

  cell(row: unknown, key: string): unknown {
    return typeof row === 'object' && row !== null ? (row as Record<string, unknown>)[key] : '';
  }
}
