import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Launch } from '../../models/launch.model';
import { LaunchStatusPipe } from '../../pipes/launch-status-pipe';

@Component({
  selector: 'app-missionlist',
  imports: [DatePipe, MatCardModule, LaunchStatusPipe],
  templateUrl: './missionlist.html',
  styleUrl: './missionlist.css'
})
export class MissionlistComponent {
  @Input() launches: Launch[] = [];
  @Output() missionSelected = new EventEmitter<number>();

  selectMission(flightNumber: number): void {
    this.missionSelected.emit(flightNumber);
  }
}
