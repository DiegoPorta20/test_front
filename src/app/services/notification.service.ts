import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  FILE_UPLOADED = 'file_uploaded',
  EMAIL_SENT = 'email_sent',
  MESSAGE_RECEIVED = 'message_received'
}

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  timestamp?: Date;
}

export interface ConnectedUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket | null = null;
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  private connectedSubject = new Subject<boolean>();
  public connected$ = this.connectedSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Conectar al WebSocket
  connect(userId: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(environment.wsUrl);

    // Registrar usuario después de conectar
    this.socket.on('connect', () => {
      this.socket?.emit('register', { userId });
    });

    this.socket.on('welcome', (data: any) => {
      console.log('Welcome:', data);
    });

    this.socket.on('registered', (data: any) => {
      console.log('Usuario registrado:', data);
      this.connectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket desconectado');
      this.connectedSubject.next(false);
    });

    this.socket.on('notification', (notification: Notification) => {
      this.notificationSubject.next({
        ...notification,
        timestamp: new Date()
      });
    });

    this.socket.on('newMessage', (data: any) => {
      this.notificationSubject.next({
        type: NotificationType.MESSAGE_RECEIVED,
        title: 'Nuevo Mensaje',
        message: `Mensaje de ${data.from}`,
        data,
        timestamp: new Date(data.timestamp)
      });
    });

    this.socket.on('broadcastMessage', (data: any) => {
      this.notificationSubject.next({
        type: NotificationType.INFO,
        title: 'Mensaje Broadcast',
        message: data.message,
        data,
        timestamp: new Date(data.timestamp)
      });
    });

    this.socket.on('roomMessage', (data: any) => {
      this.notificationSubject.next({
        type: NotificationType.INFO,
        title: `Mensaje en ${data.room}`,
        message: data.message,
        data,
        timestamp: new Date(data.timestamp)
      });
    });
  }

  // Desconectar del WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Unirse a una sala
  joinRoom(room: string): void {
    if (this.socket?.connected) {
      this.socket.emit('joinRoom', { room });
    }
  }

  // Salir de una sala
  leaveRoom(room: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leaveRoom', { room });
    }
  }

  // Enviar mensaje directo a usuario
  sendDirectMessage(to: string, message: string): void {
    if (this.socket?.connected) {
      this.socket.emit('sendMessage', { to, message });
    }
  }

  // Enviar mensaje a sala
  sendRoomMessage(room: string, message: string): void {
    if (this.socket?.connected) {
      this.socket.emit('roomMessage', { room, message });
    }
  }

  // API REST endpoints
  sendNotification(userId: string, title: string, message: string, type?: NotificationType, data?: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notifications/send`, {
      userId,
      title,
      message,
      type,
      data
    });
  }

  broadcastNotification(title: string, message: string, type?: NotificationType, data?: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notifications/broadcast`, {
      title,
      message,
      type,
      data
    });
  }

  sendRoomNotification(room: string, title: string, message: string, type?: NotificationType, data?: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/notifications/room`, {
      room,
      title,
      message,
      type,
      data
    });
  }

  checkUserStatus(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notifications/status/${userId}`);
  }

  getConnectedUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notifications/connected`);
  }
}
