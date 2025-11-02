import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateService, ReportTemplate } from '../../../services/template.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TemplateListComponent {
  templateService = inject(TemplateService);
  private fb = inject(FormBuilder);

  templates = this.templateService.templates;
  
  showEditor = signal(false);
  editingTemplateId = signal<string | null>(null);

  selectedTemplate = computed(() => {
    const id = this.editingTemplateId();
    if (!id) return null;
    return this.templates().find(t => t.id === id) ?? null;
  });

  editorTitle = computed(() => this.editingTemplateId() ? 'Edit Template' : 'Create New Template');

  templateForm = this.fb.group({
    name: ['', Validators.required],
    examType: ['', Validators.required],
    findings: [''],
    impression: [''],
  });

  constructor() {
    effect(() => {
      const template = this.selectedTemplate();
      if (this.showEditor() && template) {
        this.templateForm.patchValue(template);
      } else {
        this.templateForm.reset();
      }
    });
  }

  openEditor(template: ReportTemplate | null) {
    this.editingTemplateId.set(template?.id ?? null);
    if (template) {
      this.templateForm.patchValue(template);
    } else {
      this.templateForm.reset();
    }
    this.showEditor.set(true);
  }

  closeEditor() {
    this.showEditor.set(false);
    this.editingTemplateId.set(null);
    this.templateForm.reset();
  }

  saveTemplate() {
    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const formValue = this.templateForm.getRawValue();
    const id = this.editingTemplateId();

    if (id) {
      this.templateService.updateTemplate({ id, ...formValue } as ReportTemplate);
    } else {
      this.templateService.addTemplate(formValue as Omit<ReportTemplate, 'id'>);
    }
    this.closeEditor();
  }

  deleteTemplate(template: ReportTemplate) {
    if (confirm(`Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`)) {
      this.templateService.deleteTemplate(template.id);
    }
  }
}