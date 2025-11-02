import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AuditLogsComponent } from './components/admin/audit-logs/audit-logs.component';
import { SubmittedReportsComponent } from './components/admin/submitted-reports/submitted-reports.component';
import { TemplateListComponent } from './components/admin/template-list/template-list.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { ReportViewerComponent } from './components/report-viewer/report-viewer.component';
import { ReportWorkspaceComponent } from './components/report-workspace/report-workspace.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'report',
    component: ReportWorkspaceComponent,
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'templates', pathMatch: 'full' },
      { path: 'templates', component: TemplateListComponent },
      { path: 'submitted-reports', component: SubmittedReportsComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'audit-logs', component: AuditLogsComponent },
    ],
  },
  {
    path: 'view-report/:id',
    component: ReportViewerComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/report',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/report', // Fallback route
  },
];