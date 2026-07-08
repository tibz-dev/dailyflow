import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, ToastController
} from '@ionic/angular/standalone';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton
  ]
})
export class Tab2Page {
  taskName: string = '';
  priority: 'low' | 'medium' | 'high' = 'medium';

  constructor(
    private taskService: TaskService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async saveTask() {
    if (!this.taskName.trim()) {
      return;
    }

    await this.taskService.addTask(this.taskName, this.priority);

    const toast = await this.toastCtrl.create({
      message: 'Task added!',
      duration: 1500,
      color: 'success'
    });
    await toast.present();

    this.taskName = '';
    this.priority = 'medium';

    this.router.navigate(['/tabs/tab1']);
  }
}