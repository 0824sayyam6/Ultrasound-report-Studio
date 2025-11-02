import { Injectable, signal } from '@angular/core';

export interface ReportTemplate {
  id: string;
  name: string;
  examType: string;
  findings: string;
  impression: string;
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly DUMMY_TEMPLATES: ReportTemplate[] = [
    { 
      id: '1', 
      name: 'Standard Abdominal', 
      examType: 'Abdominal Ultrasound', 
      findings: 'The liver demonstrates normal size and echotexture. No focal hepatic lesion is identified. The gallbladder is unremarkable. The common bile duct is not dilated. Both kidneys are of normal size and appearance.', 
      impression: 'Normal abdominal ultrasound.' 
    },
    { 
      id: '2', 
      name: 'Obstetric - 2nd Trimester', 
      examType: 'Obstetric Ultrasound, Second Trimester', 
      findings: 'A single live intrauterine pregnancy is identified. Fetal heart rate is [HR] bpm. Placenta is [Anterior/Posterior] and appears normal. Amniotic fluid volume is adequate. Fetal anatomy appears grossly normal for gestational age.', 
      impression: 'Viable intrauterine pregnancy, consistent with dates.' 
    },
    { 
      id: '3', 
      name: 'Renal Scan', 
      examType: 'Renal Ultrasound', 
      findings: 'The right kidney measures [X] cm and the left kidney measures [Y] cm in length. Both kidneys demonstrate normal size, shape, and echotexture. There is no evidence of hydronephrosis, calculus, or mass.', 
      impression: 'Normal renal ultrasound.' 
    },
  ];

  templates = signal<ReportTemplate[]>(this.DUMMY_TEMPLATES);

  addTemplate(templateData: Omit<ReportTemplate, 'id'>) {
    const newTemplate: ReportTemplate = {
      ...templateData,
      id: new Date().toISOString() + Math.random(), // Simple unique ID
    };
    this.templates.update(current => [...current, newTemplate]);
  }

  updateTemplate(updatedTemplate: ReportTemplate) {
    this.templates.update(current => 
      current.map(t => t.id === updatedTemplate.id ? updatedTemplate : t)
    );
  }

  deleteTemplate(id: string) {
    this.templates.update(current => current.filter(t => t.id !== id));
  }
}