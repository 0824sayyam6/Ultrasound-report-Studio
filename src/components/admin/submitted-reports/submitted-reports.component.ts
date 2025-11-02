import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubmittedReportService } from '../../../services/submitted-report.service';
import { UltrasoundReport } from '../../../models/report.model';
import { ClinicProfileService } from '../../../services/clinic-profile.service';

@Component({
  selector: 'app-submitted-reports',
  templateUrl: './submitted-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
})
export class SubmittedReportsComponent {
  private submittedReportService = inject(SubmittedReportService);
  private clinicProfileService = inject(ClinicProfileService);
  private router = inject(Router);

  searchTerm = signal('');
  statusMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  allReports = this.submittedReportService.submittedReports;
  clinic = this.clinicProfileService.profile;

  filteredReports = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.allReports();
    }
    return this.allReports().filter(
      report =>
        report.patient.name.toLowerCase().includes(term) ||
        report.patient.patientId.toLowerCase().includes(term) ||
        report.study.examType.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  viewReport(id: string) {
    this.router.navigate(['/view-report', id]);
  }

  deleteReport(report: UltrasoundReport) {
    if (confirm(`Are you sure you want to delete the report for "${report.patient.name}"? This action cannot be undone.`)) {
      this.submittedReportService.deleteReport(report.id);
      this.statusMessage.set({ type: 'success', text: 'Report deleted successfully.' });
      this.clearStatusMessageAfterDelay();
    }
  }

  exportToPdf() {
    if (this.filteredReports().length === 0) {
      alert('No reports to export.');
      return;
    }
    window.print();
  }

  private clearStatusMessageAfterDelay(delay = 3000) {
    setTimeout(() => this.statusMessage.set(null), delay);
  }
}