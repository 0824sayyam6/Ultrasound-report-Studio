import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SubmittedReportService } from '../../services/submitted-report.service';
import { UltrasoundReport } from '../../models/report.model';
import { ClinicProfileService } from '../../services/clinic-profile.service';

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class ReportViewerComponent {
  private route = inject(ActivatedRoute);
  private submittedReportService = inject(SubmittedReportService);
  private clinicProfileService = inject(ClinicProfileService);

  report = signal<UltrasoundReport | null>(null);
  clinic = this.clinicProfileService.profile;

  constructor() {
    const reportId = this.route.snapshot.paramMap.get('id');
    if (reportId) {
      const foundReport = this.submittedReportService.getReportById(reportId);
      this.report.set(foundReport ?? null);
    }
  }

  printReport() {
    window.print();
  }
}
