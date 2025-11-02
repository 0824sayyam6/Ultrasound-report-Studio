import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { ClinicProfileService } from '../../services/clinic-profile.service';

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ReportPreviewComponent {
  reportService = inject(ReportService);
  clinicProfileService = inject(ClinicProfileService);
  
  report = this.reportService.reportState;
  clinic = this.clinicProfileService.profile;
  
  showHeaders = signal(true);

  toggleHeaders() {
    this.showHeaders.update(value => !value);
  }

  printReport() {
    window.print();
  }
}
