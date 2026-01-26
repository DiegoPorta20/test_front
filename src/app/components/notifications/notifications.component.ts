import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NotificationService, Notification, NotificationType, ConnectedUser } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTabsModule,
    NzBadgeModule,
    NzListModule,
    NzAvatarModule,
    NzEmptyModule,
    NzTimelineModule,
    NzTagModule,
    NzIconModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  sendUserForm: FormGroup;
  broadcastForm: FormGroup;
  roomForm: FormGroup;
  
  loading = false;
  wsConnected = false;
  selectedTabIndex = 0;
  
  connectedUsers: ConnectedUser[] = [];
  receivedNotifications: Notification[] = [];
  
  private notificationSubscription?: Subscription;
  private connectedSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private message: NzMessageService
  ) {
    this.sendUserForm = this.fb.group({
      userId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      type: ['info']
    });

    this.broadcastForm = this.fb.group({
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      type: ['info']
    });

    this.roomForm = this.fb.group({
      room: ['', [Validators.required]],
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      type: ['info']
    });
  }

  ngOnInit(): void {
    // Conectar al WebSocket con un ID de usuario demo
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);
    this.notificationService.connect(userId);

    // Escuchar notificaciones
    this.notificationSubscription = this.notificationService.notifications$.subscribe(
      (notification) => {
        this.receivedNotifications.unshift(notification);
        this.showNotification(notification);
      }
    );

    // Escuchar estado de conexión
    this.connectedSubscription = this.notificationService.connected$.subscribe(
      (connected) => {
        this.wsConnected = connected;
        if (connected) {
          this.message.success('WebSocket conectado');
        } else {
          this.message.error('WebSocket desconectado');
        }
      }
    );

    // Cargar usuarios conectados
    this.loadConnectedUsers();
  }

  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
    this.connectedSubscription?.unsubscribe();
    this.notificationService.disconnect();
  }

  sendToUser(): void {
    if (this.sendUserForm.valid) {
      this.loading = true;
      const formValue = this.sendUserForm.value;
      
      this.notificationService.sendNotification(
        formValue.userId,
        formValue.title,
        formValue.message,
        formValue.type
      ).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.data.sent) {
            this.message.success('Notificación enviada exitosamente');
            this.sendUserForm.reset({ type: 'info' });
          } else {
            this.message.warning('Usuario no conectado');
          }
        },
        error: (error) => {
          this.loading = false;
          this.message.error('Error al enviar notificación');
          console.error(error);
        }
      });
    }
  }

  broadcast(): void {
    if (this.broadcastForm.valid) {
      this.loading = true;
      const formValue = this.broadcastForm.value;
      
      this.notificationService.broadcastNotification(
        formValue.title,
        formValue.message,
        formValue.type
      ).subscribe({
        next: () => {
          this.loading = false;
          this.message.success('Notificación broadcast enviada');
          this.broadcastForm.reset({ type: 'info' });
        },
        error: (error) => {
          this.loading = false;
          this.message.error('Error al enviar broadcast');
          console.error(error);
        }
      });
    }
  }

  sendToRoom(): void {
    if (this.roomForm.valid) {
      this.loading = true;
      const formValue = this.roomForm.value;
      
      this.notificationService.sendRoomNotification(
        formValue.room,
        formValue.title,
        formValue.message,
        formValue.type
      ).subscribe({
        next: () => {
          this.loading = false;
          this.message.success(`Notificación enviada a la sala ${formValue.room}`);
          this.roomForm.reset({ type: 'info' });
        },
        error: (error) => {
          this.loading = false;
          this.message.error('Error al enviar notificación a sala');
          console.error(error);
        }
      });
    }
  }

  loadConnectedUsers(): void {
    this.loading = true;
    this.notificationService.getConnectedUsers().subscribe({
      next: (response) => {
        this.loading = false;
        this.connectedUsers = response.data.users;
        this.message.success(`${response.data.count} usuarios conectados`);
      },
      error: (error) => {
        this.loading = false;
        this.message.error('Error al cargar usuarios conectados');
        console.error(error);
      }
    });
  }

  clearNotifications(): void {
    this.receivedNotifications = [];
    this.message.info('Notificaciones limpiadas');
  }

  showNotification(notification: Notification): void {
    const type = notification.type || NotificationType.INFO;
    const options = {
      nzDuration: 5000
    };

    switch (type) {
      case NotificationType.SUCCESS:
        this.message.success(notification.message, options);
        break;
      case NotificationType.WARNING:
        this.message.warning(notification.message, options);
        break;
      case NotificationType.ERROR:
        this.message.error(notification.message, options);
        break;
      default:
        this.message.info(notification.message, options);
    }
  }

  getTimelineColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS: return 'green';
      case NotificationType.WARNING: return 'orange';
      case NotificationType.ERROR: return 'red';
      default: return 'blue';
    }
  }

  getTagColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS: return 'success';
      case NotificationType.WARNING: return 'warning';
      case NotificationType.ERROR: return 'error';
      default: return 'default';
    }
  }
}
