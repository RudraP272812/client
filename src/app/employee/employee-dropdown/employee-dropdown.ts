import { Component, OnInit, signal, output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatLabel, MatFormField } from '@angular/material/form-field';

import { Employee } from '@app/employee/employee';
import { EmployeeService } from '@app/employee/employee.service';

@Component({
  selector: 'app-employee-dropdown',
  imports: [MatCardModule, MatLabel, MatFormField, MatSelectModule, MatOptionModule],
  templateUrl: './employee-dropdown.html',
  styleUrl: './employee-dropdown.scss'
})
export class EmployeeDropdown implements OnInit {

  constructor(protected employeeService: EmployeeService) {}

  selected = output<Employee>();
  employees = signal<Employee[]>([]);

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (payload: Employee[]) => this.employees.set(payload),
      error: e => console.log(e)
    });
  }

  onEmployeeSelectionChange(selection: MatSelectChange) {
    this.selected.emit(selection.value);
  }
}
