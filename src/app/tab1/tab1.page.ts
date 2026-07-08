import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonItemSliding,
  IonItemOptions, IonItemOption, IonCheckbox, IonBadge,
  AlertController
} from '@ionic/angular/standalone';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonItemSliding,
    IonItemOptions, IonItemOption, IonCheckbox, IonBadge
  ]
})
export class Tab1Page implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async ionViewWillEnter() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
  }

  async onToggle(id: number) {
    await this.taskService.toggleComplete(id);
    await this.loadTasks();
  }

  async confirmDelete(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(id);
            await this.loadTasks();
          }
        }
      ]
    });
    await alert.present();
  }

  priorityColor(priority: string): string {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'success';
  }
}