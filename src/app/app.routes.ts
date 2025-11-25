import { Routes } from '@angular/router';
import { Home } from '../app/home/home'
import { EmployeeHome } from '@app/employee/employee-home/employee-home';
import { ExpenseHome } from '@app/expense/expense-home/expense-home';
import { ReportGenerator } from './report/report-generator/report-generator';
import { ReportViewer } from './report/report-viewer/report-viewer';

export const routes: Routes = [
  { path: '', component: Home, },
  { path: 'employees', component: EmployeeHome, },
  { path: 'expenses', component: ExpenseHome, },
  { path: 'generator', component: ReportGenerator },
  { path: 'viewer', component: ReportViewer, },
];
