
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// FIX: Corrected the relative import path for ReportService to resolve the type correctly.
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ReportPreviewComponent {
  reportService = inject(ReportService);
  report = this.reportService.reportState;
  
  showHeaders = signal(true);

  toggleHeaders() {
    this.showHeaders.update(value => !value);
  }

  printReport() {
    window.print();
  }
}
