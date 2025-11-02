import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { GeminiService } from '../../services/gemini.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UltrasoundReport } from '../../models/report.model';

@Component({
  selector: 'app-report-editor',
  templateUrl: './report-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class ReportEditorComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  reportService = inject(ReportService);
  geminiService = inject(GeminiService);

  isLoadingSuggestions = signal(false);
  isSaving = signal(false);
  isSubmitting = signal(false);

  suggestion = signal<string | null>(null);
  error = signal<string | null>(null);
  statusMessage = signal<{ type: 'success' | 'error', text: string } | null>(null);

  isLoadingImpressionSuggestions = signal(false);
  impressionSuggestion = signal<string | null>(null);
  impressionError = signal<string | null>(null);

  private formSub: Subscription;

  reportForm = this.fb.group({
    patient: this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      patientId: ['', Validators.required],
      gender: ['Female', Validators.required],
    }),
    study: this.fb.group({
      examType: ['', Validators.required],
      bodyPart: ['', Validators.required],
      studyDate: ['', Validators.required],
      referringPhysician: ['', Validators.required],
    }),
    findings: ['', Validators.required],
    impression: ['', Validators.required],
    technique: ['', Validators.required],
    comparison: ['', Validators.required],
    recommendations: ['', Validators.required],
  });

  constructor() {
    this.reportForm.patchValue(this.reportService.reportState());
    
    effect(() => {
      const reportStatus = this.reportService.reportState().status;
      if (reportStatus === 'submitted') {
        this.reportForm.disable({ emitEvent: false });
      } else {
        this.reportForm.enable({ emitEvent: false });
      }
    });

    this.formSub = this.reportForm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(() => {
        if (this.reportForm.valid && this.reportService.reportState().status === 'draft') {
            // FIX: Cast the raw form value to satisfy the type checker. The `gender`
            // property is inferred as `string` from the form control, which is incompatible
            // with the `'Male' | 'Female' | 'Other'` type in the UltrasoundReport model.
            this.reportService.updateReport(this.reportForm.getRawValue() as Partial<UltrasoundReport>);
        }
    });
  }
  
  ngOnDestroy() {
    this.formSub.unsubscribe();
  }

  async fetchSuggestions() {
    this.isLoadingSuggestions.set(true);
    this.suggestion.set(null);
    this.error.set(null);
    const examType = this.reportForm.get('study.examType')?.value;

    if (!examType) {
        this.error.set("Please enter an Exam Type to get suggestions.");
        this.isLoadingSuggestions.set(false);
        return;
    }

    try {
      const result = await this.geminiService.getFindingSuggestions(examType);
      this.suggestion.set(result);
    } catch (err: any) {
      this.error.set(err.message || 'An unknown error occurred.');
    } finally {
      this.isLoadingSuggestions.set(false);
    }
  }

  applySuggestion() {
    if (this.suggestion()) {
      const currentFindings = this.reportForm.get('findings')?.value || '';
      const newFindings = currentFindings ? `${currentFindings}\n\n${this.suggestion()}` : this.suggestion();
      this.reportForm.get('findings')?.setValue(newFindings);
      this.suggestion.set(null);
    }
  }

  async fetchImpressionSuggestions() {
    this.isLoadingImpressionSuggestions.set(true);
    this.impressionSuggestion.set(null);
    this.impressionError.set(null);
    const examType = this.reportForm.get('study.examType')?.value;
    const findings = this.reportForm.get('findings')?.value;

    if (!examType || !findings) {
        this.impressionError.set("Please enter an Exam Type and Findings to get an impression suggestion.");
        this.isLoadingImpressionSuggestions.set(false);
        return;
    }

    try {
      const result = await this.geminiService.getImpressionSuggestions(examType, findings);
      this.impressionSuggestion.set(result);
    } catch (err: any) {
      this.impressionError.set(err.message || 'An unknown error occurred.');
    } finally {
      this.isLoadingImpressionSuggestions.set(false);
    }
  }

  applyImpressionSuggestion() {
    if (this.impressionSuggestion()) {
      const currentImpression = this.reportForm.get('impression')?.value || '';
      const newImpression = currentImpression ? `${currentImpression}\n\n${this.impressionSuggestion()}` : this.impressionSuggestion();
      this.reportForm.get('impression')?.setValue(newImpression);
      this.impressionSuggestion.set(null);
    }
  }

  async onSaveDraft() {
    this.isSaving.set(true);
    this.statusMessage.set(null);
    const result = await this.reportService.saveDraft();
    this.statusMessage.set({ type: 'success', text: result.message });
    this.isSaving.set(false);
    this.clearStatusMessageAfterDelay();
  }

  async onSubmitReport() {
    this.reportForm.markAllAsTouched();
    if (this.reportForm.invalid) {
      this.statusMessage.set({ type: 'error', text: 'Please fill all required fields before submitting.' });
      this.clearStatusMessageAfterDelay();
      return;
    }
    this.isSubmitting.set(true);
    this.statusMessage.set(null);
    try {
      const result = await this.reportService.submitReport();
      this.statusMessage.set({ type: 'success', text: result.message });
    } catch (err: any) {
      this.statusMessage.set({ type: 'error', text: err.message || 'An unknown error occurred.' });
    } finally {
      this.isSubmitting.set(false);
      this.clearStatusMessageAfterDelay(5000);
    }
  }

  createNewReport() {
    this.reportService.createNewReportSession();
    this.reportForm.patchValue(this.reportService.reportState());
  }

  private clearStatusMessageAfterDelay(delay = 3000) {
    setTimeout(() => this.statusMessage.set(null), delay);
  }
}