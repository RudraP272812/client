import { Component, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { Expense } from '@app/expense/expense';
import { ExpenseService } from '@app/expense/expense.service';
import { Employee } from '@app/employee/employee';
import { EmployeeDropdown } from '@app/employee/employee-dropdown/employee-dropdown';
import { ReportTable } from '../report-table/report-table';
import { Report } from '../report';
import { ReportItem } from '../report-item';
import { ReportDropdown } from '../report-dropdown/report-dropdown';

import { REPORT_DEFAULT } from '@app/constants';

@Component({
  selector: 'app-report-viewer',
  imports: [MatCardModule, EmployeeDropdown, ReportDropdown , ReportTable],
  templateUrl: './report-viewer.html',
  styleUrl: './report-viewer.scss'
})
export class ReportViewer {

 constructor(protected expenseService: ExpenseService) {
  }
  employeeExpenses = signal<Expense[]>([]);
  expensesForReport = signal<Expense[]>([]);

  employeeId = signal<number>(0);
  report = signal<Report>(REPORT_DEFAULT);

  employeeSelected(employee: Employee) {
    this.employeeId.set(employee.id);
    this.report.set(REPORT_DEFAULT);
    this.expensesForReport.set([]);
    this.expenseService.getAllById(this.employeeId()).subscribe({
      next: (payload: Expense[]) => this.employeeExpenses.set(payload),
      error: e => console.log(e),
    });
  }

   reportSelected(report: Report) {
    console.log(report);
    this.report.set(report);

    // We need to "convert" a Report and ReportItems into Expenses (what ReportTable needs)
    let expenseIds = report.items.map((reportItem: ReportItem) => reportItem.expenseId);

    this.expensesForReport.set([]);
    expenseIds.forEach((expenseId: number) => {
      let expense = this.employeeExpenses().find(e => e.id == expenseId);
      if (expense) {
        this.expensesForReport().push(expense);
      }
    });
  }
}
