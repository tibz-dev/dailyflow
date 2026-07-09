import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonList, IonItem, IonLabel, IonIcon, PopoverController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-options-popover',
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonLabel, IonIcon],
  templateUrl: './task-options-popover.component.html',
})
export class TaskOptionsPopoverComponent {
  constructor(private popoverCtrl: PopoverController) {}

  select(action: string) {
    this.popoverCtrl.dismiss(action);
  }
}