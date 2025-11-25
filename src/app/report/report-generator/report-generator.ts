import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Employee } from '@app/employee/employee';
import { EmployeeService } from '@app/employee/employee.service';
import { Expense } from '@app/expense/expense';
import { ExpenseService } from '@app/expense/expense.service';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Report } from '@app/report/report';
import { ReportService } from '@app/report/report.service';

@Component({
  selector: 'app-report-generator',
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule,
    MatLabel, MatFormField, MatSelectModule, MatOptionModule,
    MatTableModule, CommonModule
  ],
  templateUrl: './report-generator.html',
  styleUrl: './report-generator.scss'
})
export class ReportGenerator implements OnInit {
  constructor(
    protected employeeService: EmployeeService,
    protected expenseService: ExpenseService,
    protected reportService: ReportService
  ) {}

  employees = signal<Employee[]>([]);
  employeeExpenses = signal<Expense[]>([]);
  reportCreatedMessage = signal<String>('');

  tableColumns = ['date', 'description', 'amount'];
  reportTable = new MatTableDataSource<Expense>();

  reportForm: FormGroup = new FormGroup({
    employeeId: new FormControl(0), // Initialize to 0 for better control flow
    expenseId: new FormControl(0), // Initialize to 0 for better control flow
  });

  ngOnInit(): void {
    this.loadEmployees();
  }

  selectedEmployeeId(): number {
    return (this.reportForm.get('employeeId')?.value ?? 0) as number;
  }

  selectedExpenseId(): number {
    return (this.reportForm.get('expenseId')?.value ?? 0) as number;
  }

  onEmployeeSelectionChange(selection: MatSelectChange): void {
    this.reportForm.get('expenseId')?.setValue(0); // Unselect the expense
    this.reportTable.data = []; // Clear the table
    this.employeeExpenses.set([]); // Clear the list of employee expenses
    this.reportCreatedMessage.set(''); // Clear the report created message

    this.expenseService.getAllById(selection.value).subscribe({
      next: (payload: Expense[]) => this.employeeExpenses.set(payload),
      error: e => console.log(e),
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (payload: Employee[]) => this.employees.set(payload),
      error: e => console.log(e)
    });
  }

  // Method called in HTML: [disabled]="expenseAlreadyAdded()"
  expenseAlreadyAdded(): boolean {
    return this.reportTable.data.some(expense => expense.id === this.selectedExpenseId());
  }

  // Method called in HTML: {{ reportTotal() | currency : '$' }}
  reportTotal(): number {
    let total = 0;
    this.reportTable.data.forEach(expense => total += expense.amount);
    return total;
  }

  // Method called in HTML: (click)="addExpense()"
  addExpense(): void {
    const expense = this.employeeExpenses().find(expense => expense.id === this.selectedExpenseId());
    if (expense) {
      // Create a new array reference to trigger MatTableDataSource update
      this.reportTable.data = [...this.reportTable.data, expense];
      this.reportForm.get('expenseId')?.setValue(0); // Unselect the added expense
    }
  }

  // Method called in HTML: (click)="removeExpense()"
  removeExpense(): void {
    this.reportTable.data = this.reportTable.data.filter(expense => expense.id !== this.selectedExpenseId());
    // Assigning filtered array back triggers re-render
    this.reportTable.data = this.reportTable.data;
    this.reportForm.get('expenseId')?.setValue(0); // Unselect the removed expense
  }

  // Method called in HTML: (click)="saveReport()"
  saveReport(): void {
    let report: Report = {
      id: 0,
      employeeId: this.selectedEmployeeId(),
      items: [],
      date: ''
    };

    this.reportTable.data.forEach(expense => {
      report.items.push({
        id: 0,
        reportId: 0,
        expenseId: expense.id
      })
    })

    this.reportService.create(report).subscribe({
      next: (payload: Report) => {
        this.reportForm.get('employeeId')?.setValue(0);
        this.reportForm.get('expenseId')?.setValue(0);
        this.reportTable.data = [];
        this.employeeExpenses.set([]);

        this.reportCreatedMessage.set(`Report #${payload.id} created at ${payload.date}`);
      },
      error: e => console.log(e)
    });
  }
}
