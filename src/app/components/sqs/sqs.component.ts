import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SqsService, SqsBatchMessage } from '../../services/sqs.service';

@Component({
  selector: 'app-sqs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzCardModule,
    NzTabsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzListModule,
    NzEmptyModule,
    NzDividerModule,
    NzDescriptionsModule,
    NzIconModule
  ],
  templateUrl: './sqs.component.html',
  styleUrls: ['./sqs.component.scss']
})
export class SqsComponent implements OnInit {
  sendMessageForm: FormGroup;

  // Enviar mensaje simple
  sending = false;

  // Batch
  batchMessages: SqsBatchMessage[] = [];
  sendingBatch = false;

  // Recibir mensajes
  maxMessages = 1;
  waitTimeSeconds = 0;
  receivedMessages: any[] = [];
  receiving = false;

  // Atributos de cola
  queueAttributes: any = null;
  loadingAttributes = false;

  constructor(
    private fb: FormBuilder,
    private sqsService: SqsService,
    private message: NzMessageService
  ) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
      delaySeconds: [0]
    });
  }

  ngOnInit(): void {
    this.addBatchMessage();
  }

  // Enviar mensaje simple
  sendMessage(): void {
    if (this.sendMessageForm.valid) {
      this.sending = true;
      const formValue = this.sendMessageForm.value;

      this.sqsService.sendMessage(
        formValue.message,
        formValue.delaySeconds
      ).subscribe({
        next: (response) => {
          this.sending = false;
          this.message.success('Mensaje enviado a SQS');
          this.sendMessageForm.reset({ delaySeconds: 0 });
        },
        error: (error) => {
          this.sending = false;
          this.message.error('Error al enviar mensaje');
          console.error(error);
        }
      });
    }
  }

  // Batch messages
  addBatchMessage(): void {
    const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    this.batchMessages.push({
      id,
      message: '',
      delaySeconds: 0
    });
  }

  removeBatchMessage(index: number): void {
    this.batchMessages.splice(index, 1);
  }

  sendMessageBatch(): void {
    // Validar que todos los mensajes tengan contenido
    const validMessages = this.batchMessages.filter(msg => msg.message.trim() !== '');

    if (validMessages.length === 0) {
      this.message.warning('Debe agregar al menos un mensaje con contenido');
      return;
    }

    this.sendingBatch = true;

    this.sqsService.sendMessageBatch(validMessages).subscribe({
      next: (response) => {
        this.sendingBatch = false;
        this.message.success(`${validMessages.length} mensajes enviados a SQS`);
        this.batchMessages = [];
        this.addBatchMessage();
      },
      error: (error) => {
        this.sendingBatch = false;
        this.message.error('Error al enviar batch de mensajes');
        console.error(error);
      }
    });
  }

  // Recibir mensajes
  receiveMessages(): void {
    this.receiving = true;

    this.sqsService.receiveMessages(this.maxMessages, this.waitTimeSeconds).subscribe({
      next: (response) => {
        this.receiving = false;
        this.receivedMessages = response.data;
        this.message.success(response.message);
      },
      error: (error) => {
        this.receiving = false;
        this.message.error('Error al recibir mensajes');
        console.error(error);
      }
    });
  }

  // Atributos de cola
  loadQueueAttributes(): void {
    this.loadingAttributes = true;

    this.sqsService.getQueueAttributes().subscribe({
      next: (response) => {
        this.loadingAttributes = false;
        this.queueAttributes = response.data;
        this.message.success('Atributos de cola cargados');
      },
      error: (error) => {
        this.loadingAttributes = false;
        this.message.error('Error al cargar atributos');
        console.error(error);
      }
    });
  }

  // Utilidades
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
