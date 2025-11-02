import { Injectable, signal, inject } from '@angular/core';
import { UltrasoundReport } from '../models/report.model';
import { SubmittedReportService } from './submitted-report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly STORAGE_KEY = 'ultrasound_report';
  private submittedReportService = inject(SubmittedReportService);

  private createNewReport(): UltrasoundReport {
    return {
      id: new Date().toISOString(),
      status: 'draft',
      lastSaved: null,
      patient: {
        name: 'Jane Doe',
        dob: '1985-05-22',
        patientId: 'P-123456789',
        gender: 'Female',
      },
      study: {
        examType: 'Obstetric Ultrasound, Second Trimester',
        bodyPart: 'Fetus',
        studyDate: new Date().toISOString().split('T')[0],
        referringPhysician: 'Dr. Emily Carter',
      },
      findings: '',
      impression: '',
      technique: 'Real-time grayscale and color Doppler imaging was performed.',
      comparison: 'No prior studies are available for comparison.',
      recommendations: 'Follow-up as clinically indicated.',
    };
  }
  
  private loadReportFromStorage(): UltrasoundReport {
    try {
      const savedReportJson = localStorage.getItem(this.STORAGE_KEY);
      if (savedReportJson) {
        const savedReport = JSON.parse(savedReportJson);
        // Basic validation of stored object
        if (savedReport && savedReport.id && savedReport.patient) {
          return savedReport;
        }
      }
    } catch (e) {
      console.error('Failed to load or parse report from local storage', e);
      localStorage.removeItem(this.STORAGE_KEY);
    }
    return this.createNewReport();
  }

  reportState = signal<UltrasoundReport>(this.loadReportFromStorage());

  constructor() {
    // Backup auto-save every 10 seconds. 
    // The main auto-save is handled via form value changes.
    setInterval(() => {
        if (this.reportState().status === 'draft') {
            this.saveDraft();
        }
    }, 10000);
  }

  // Update parts of the report from the editor's form.
  updateReport(updatedValues: Partial<UltrasoundReport>) {
    this.reportState.update(current => {
       const newState = { ...current, ...updatedValues, lastSaved: new Date().toISOString() };
       this.saveToLocalStorage(newState); // Persist on every update for reliability
       return newState;
    });
  }

  private saveToLocalStorage(report: UltrasoundReport) {
     try {
       localStorage.setItem(this.STORAGE_KEY, JSON.stringify(report));
     } catch(e) {
       console.error("Error saving to local storage", e);
     }
  }

  async saveDraft(): Promise<{ success: boolean; message: string }> {
    return new Promise(resolve => {
      setTimeout(() => { // Simulate network latency
        const updatedReport = {
          ...this.reportState(),
          lastSaved: new Date().toISOString(),
        };
        this.reportState.set(updatedReport);
        this.saveToLocalStorage(updatedReport);
        resolve({ success: true, message: 'Draft saved successfully.' });
      }, 500);
    });
  }

  async submitReport(): Promise<{ success: boolean; message: string }> {
     return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network latency
        const currentReport = this.reportState();
        
        if (!currentReport.patient.name || !currentReport.study.examType || !currentReport.findings || !currentReport.impression) {
            return reject({ success: false, message: 'Please complete all required fields before submitting.' });
        }

        const submittedReport: UltrasoundReport = {
          ...currentReport,
          status: 'submitted',
          lastSaved: new Date().toISOString(),
        };
        this.reportState.set(submittedReport);
        this.saveToLocalStorage(submittedReport); // Persist final state
        this.submittedReportService.addReport(submittedReport); // Add to archive
        resolve({ success: true, message: 'Report submitted successfully.' });
      }, 1000);
    });
  }
  
  createNewReportSession() {
      // In a real app, you might archive the old report. Here we just replace it.
      localStorage.removeItem(this.STORAGE_KEY);
      this.reportState.set(this.createNewReport());
  }
}