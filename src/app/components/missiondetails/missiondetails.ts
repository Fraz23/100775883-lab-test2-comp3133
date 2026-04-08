import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Launch } from '../../models/launch.model';
import { SpacexService } from '../../services/spacex';

@Component({
  selector: 'app-missiondetails',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './missiondetails.html',
  styleUrl: './missiondetails.css'
})
export class MissiondetailsComponent implements OnChanges {
  private readonly spacexService = inject(SpacexService);

  @Input() flightNumber: number | null = null;
  @Output() closeRequested = new EventEmitter<void>();

  readonly mission = signal<Launch | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['flightNumber']) {
      return;
    }

    if (this.flightNumber == null) {
      this.mission.set(null);
      this.error.set(null);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.spacexService.fetchMissionDetails(this.flightNumber).subscribe({
      next: (mission) => {
        this.mission.set(mission);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to fetch mission details right now.');
        this.loading.set(false);
      }
    });
  }

  close(): void {
    this.closeRequested.emit();
  }
}
