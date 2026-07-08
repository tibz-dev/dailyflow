import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonItemSliding,
  IonItemOptions, IonItemOption, IonCheckbox, IonBadge,
  IonSearchbar, IonReorderGroup, IonReorder, IonButtons, IonButton,
  AlertController, ModalController, ActionSheetController
} from '@ionic/angular/standalone';
import { TaskService, Task } from '../services/task.service';
import { EditTaskModalComponent } from '../components/edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonItemSliding,
    IonItemOptions, IonItemOption, IonCheckbox, IonBadge,
    IonSearchbar, IonReorderGroup, IonReorder, IonButtons, IonButton
  ]
})
export class Tab1Page implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  reorderMode: boolean = false;

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async ionViewWillEnter() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
    this.applyFilter();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTasks = term
      ? this.tasks.filter(t => t.name.toLowerCase().includes(term))
      : this.tasks;
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilter();
  }

  toggleReorderMode() {
    this.reorderMode = !this.reorderMode;
  }

  async handleReorder(event: any) {
    // event.detail.complete() reorders the array for us and returns it
    this.filteredTasks = event.detail.complete(this.filteredTasks);
    this.tasks = this.filteredTasks;
    await this.taskService.reorderTasks(this.tasks);
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

  async openEditModal(task: Task) {
    const modal = await this.modalCtrl.create({
      component: EditTaskModalComponent,
      componentProps: { task }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      await this.taskService.updateTask(data);
      await this.loadTasks();
    }
  }

  async openTaskOptions(task: Task) {
    if (this.reorderMode) return; // don't open action sheet while reordering

    const actionSheet = await this.actionSheetCtrl.create({
      header: task.name,
      buttons: [
        {
          text: 'Edit',
          icon: 'create-outline',
          handler: () => {
            this.openEditModal(task);
          }
        },
        {
          text: task.completed ? 'Mark as Incomplete' : 'Mark as Complete',
          icon: 'checkmark-circle-outline',
          handler: () => {
            this.onToggle(task.id);
          }
        },
        {
          text: 'Delete',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.confirmDelete(task.id);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  priorityColor(priority: string): string {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'success';
  }
}