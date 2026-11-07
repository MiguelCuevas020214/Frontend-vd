import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadgeComponent {
  @Input() status = 'active';
  @Input() label = '';

  get config(): { text: string; classes: string } {
    const values: Record<string, { text: string; classes: string }> = {
      active: {
        text: 'Activo',
        classes: 'bg-green-50 text-green-700 ring-green-600/20',
      },
      inactive: { text: 'Inactivo', classes: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
      pending: { text: 'Pendiente', classes: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
      confirmed: { text: 'Confirmado', classes: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
      cancelled: { text: 'Cancelado', classes: 'bg-rose-50 text-rose-700 ring-rose-600/20' },
      available: {
        text: 'Disponible',
        classes: 'bg-green-50 text-green-700 ring-green-600/20',
      },
      featured: { text: 'Destacado', classes: 'bg-amber-100 text-amber-800 ring-amber-600/20' },
      owner: { text: 'Dueño', classes: 'bg-violet-50 text-violet-700 ring-violet-600/20' },
      editor: { text: 'Editor', classes: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
    };
    return (
      values[this.status] ?? {
        text: this.status,
        classes: 'bg-slate-100 text-slate-600 ring-slate-500/20',
      }
    );
  }
}
