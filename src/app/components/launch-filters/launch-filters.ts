import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-launch-filters',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './launch-filters.html',
  styleUrl: './launch-filters.css',
})
export class LaunchFiltersComponent {
  @Input({ required: true }) filterForm!: FormGroup;
  @Input() years: string[] = [];
}
