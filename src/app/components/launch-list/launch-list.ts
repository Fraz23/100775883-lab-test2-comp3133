import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Launch } from '../../models/launch.model';
import { LaunchStatusPipe } from '../../pipes/launch-status-pipe';

@Component({
  selector: 'app-launch-list',
  imports: [DatePipe, FormsModule, LaunchStatusPipe],
  templateUrl: './launch-list.html',
  styleUrl: './launch-list.css',
})
export class LaunchListComponent {
  @Input() launches: Launch[] = [];
  showDetails = true;
}
