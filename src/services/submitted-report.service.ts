import { Injectable, signal } from '@angular/core';
import { UltrasoundReport } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class SubmittedReportService {
  private readonly STORAGE_KEY = 'submitted_ultrasound_reports';

  private loadFromStorage(): UltrasoundReport[] {
    try {
      const savedReportsJson = localStorage.getItem(this.STORAGE_KEY);
      return savedReportsJson ? JSON.parse(savedReportsJson) : [];
    } catch (e) {
      console.error('Failed to load submitted reports from storage', e);
      return [];
    }
  }

  private saveToStorage(reports: UltrasoundReport[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving submitted reports to storage', e);
    }
  }

  submittedReports = signal<UltrasoundReport[]>(this.loadFromStorage());

  addReport(report: UltrasoundReport) {
    this.submittedReports.update(reports => {
      const newReports = [report, ...reports];
      this.saveToStorage(newReports);
      return newReports;
    });
  }

  getReportById(id: string): UltrasoundReport | undefined {
    return this.submittedReports().find(report => report.id === id);
  }

  deleteReport(id: string) {
    this.submittedReports.update(reports => {
      const updatedReports = reports.filter(report => report.id !== id);
      this.saveToStorage(updatedReports);
      return updatedReports;
    });
  }
}
