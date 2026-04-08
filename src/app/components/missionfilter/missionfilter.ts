import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-missionfilter',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './missionfilter.html',
  styleUrl: './missionfilter.css'
})
export class MissionfilterComponent {
  @Input({ required: true }) filterForm!: FormGroup;
  @Input() years: string[] = [];
}
