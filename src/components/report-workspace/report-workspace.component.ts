import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReportEditorComponent } from '../report-editor/report-editor.component';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-workspace',
  templateUrl: './report-workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReportEditorComponent, ReportPreviewComponent, RouterLink],
})
export class ReportWorkspaceComponent {
  activeView = signal<'editor' | 'preview'>('editor');

  setView(view: 'editor' | 'preview') {
    this.activeView.set(view);
  }
}