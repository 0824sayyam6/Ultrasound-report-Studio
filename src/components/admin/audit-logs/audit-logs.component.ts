import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-audit-logs',
  template: `
    <div class="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div class="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Audit Logs</h2>
          <p class="text-sm text-slate-500 mt-1">Review system and user activity.</p>
        </div>
      </div>
      <div class="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
        <i class="fas fa-history text-4xl text-slate-400"></i>
        <p class="mt-4 text-slate-500">Audit logs feature is coming soon.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsComponent {}
