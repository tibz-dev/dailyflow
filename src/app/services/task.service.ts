import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface Task {
  id: number;
  name: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private STORAGE_KEY = 'dailyflow_tasks';

  async getTasks(): Promise<Task[]> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  async addTask(name: string, priority: 'low' | 'medium' | 'high'): Promise<void> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      id: Date.now(),
      name,
      priority,
      completed: false
    };
    tasks.push(newTask);
    await Preferences.set({ key: this.STORAGE_KEY, value: JSON.stringify(tasks) });
  }

  async deleteTask(id: number): Promise<void> {
    const tasks = await this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    await Preferences.set({ key: this.STORAGE_KEY, value: JSON.stringify(filtered) });
  }

  async toggleComplete(id: number): Promise<void> {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      await Preferences.set({ key: this.STORAGE_KEY, value: JSON.stringify(tasks) });
    }
  }
}