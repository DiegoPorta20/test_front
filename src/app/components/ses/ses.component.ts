import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SesService, EmailTemplate } from '../../services/ses.service';

@Component({
  selector: 'app-ses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzTabsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzListModule,
    NzEmptyModule,
    NzModalModule,
    NzDescriptionsModule,
    NzIconModule
  ],
  templateUrl: './ses.component.html',
  styleUrls: ['./ses.component.scss']
})
export class SesComponent implements OnInit {
  emailForm: FormGroup;
  bulkEmailForm: FormGroup;
  templateForm: FormGroup;
  templatedEmailForm: FormGroup;

  sending = false;
  sendingBulk = false;
  sendingTemplated = false;
  loadingTemplates = false;
  creatingTemplate = false;

  templates: any[] = [];
  
  createTemplateModalVisible = false;
  useTemplateModalVisible = false;
  viewTemplateModalVisible = false;
  
  selectedTemplateName = '';
  viewingTemplate: any = null;

  constructor(
    private fb: FormBuilder,
    private sesService: SesService,
    private message: NzMessageService
  ) {
    this.emailForm = this.fb.group({
      to: [[], [Validators.required, Validators.minLength(1)]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      isHtml: [true],
      cc: [[]],
      bcc: [[]],
      replyTo: [[]]
    });

    this.bulkEmailForm = this.fb.group({
      recipients: [[], [Validators.required, Validators.minLength(1)]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      isHtml: [true]
    });

    this.templateForm = this.fb.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      htmlBody: ['', [Validators.required]],
      textBody: ['']
    });

    this.templatedEmailForm = this.fb.group({
      to: [[], [Validators.required, Validators.minLength(1)]],
      templateData: ['{}', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
  }

  sendEmail(): void {
    if (this.emailForm.valid) {
      this.sending = true;
      const formValue = this.emailForm.value;

      this.sesService.sendEmail(formValue).subscribe({
        next: (response) => {
          this.sending = false;
          this.message.success('Correo enviado exitosamente');
          this.emailForm.reset({ isHtml: true, to: [], cc: [], bcc: [], replyTo: [] });
        },
        error: (error) => {
          this.sending = false;
          this.message.error('Error al enviar correo');
          console.error(error);
        }
      });
    }
  }

  sendBulkEmail(): void {
    if (this.bulkEmailForm.valid) {
      this.sendingBulk = true;
      const formValue = this.bulkEmailForm.value;

      this.sesService.sendBulkEmail(
        formValue.recipients,
        formValue.subject,
        formValue.body,
        formValue.isHtml
      ).subscribe({
        next: (response) => {
          this.sendingBulk = false;
          this.message.success(`Correos enviados a ${formValue.recipients.length} destinatarios`);
          this.bulkEmailForm.reset({ isHtml: true, recipients: [] });
        },
        error: (error) => {
          this.sendingBulk = false;
          this.message.error('Error al enviar correos masivos');
          console.error(error);
        }
      });
    }
  }

  loadTemplates(): void {
    this.loadingTemplates = true;

    this.sesService.listTemplates().subscribe({
      next: (response) => {
        this.loadingTemplates = false;
        this.templates = response.data || [];
        this.message.success(`${this.templates.length} plantillas cargadas`);
      },
      error: (error) => {
        this.loadingTemplates = false;
        this.message.error('Error al cargar plantillas');
        console.error(error);
      }
    });
  }

  showCreateTemplateModal(): void {
    this.templateForm.reset();
    this.createTemplateModalVisible = true;
  }

  createTemplate(): void {
    if (this.templateForm.valid) {
      this.creatingTemplate = true;
      const template: EmailTemplate = this.templateForm.value;

      this.sesService.createTemplate(template).subscribe({
        next: (response) => {
          this.creatingTemplate = false;
          this.createTemplateModalVisible = false;
          this.message.success('Plantilla creada exitosamente');
          this.loadTemplates();
          this.templateForm.reset();
        },
        error: (error) => {
          this.creatingTemplate = false;
          this.message.error('Error al crear plantilla');
          console.error(error);
        }
      });
    }
  }

  useTemplate(templateName: string): void {
    this.selectedTemplateName = templateName;
    this.templatedEmailForm.reset({ to: [], templateData: '{}' });
    this.useTemplateModalVisible = true;
  }

  sendTemplatedEmail(): void {
    if (this.templatedEmailForm.valid) {
      this.sendingTemplated = true;
      const formValue = this.templatedEmailForm.value;

      try {
        const templateData = JSON.parse(formValue.templateData);

        this.sesService.sendTemplatedEmail({
          to: formValue.to,
          templateName: this.selectedTemplateName,
          templateData
        }).subscribe({
          next: (response) => {
            this.sendingTemplated = false;
            this.useTemplateModalVisible = false;
            this.message.success('Correo con plantilla enviado exitosamente');
          },
          error: (error) => {
            this.sendingTemplated = false;
            this.message.error('Error al enviar correo con plantilla');
            console.error(error);
          }
        });
      } catch (error) {
        this.sendingTemplated = false;
        this.message.error('JSON de datos inválido');
      }
    }
  }

  viewTemplate(templateName: string): void {
    this.selectedTemplateName = templateName;
    
    this.sesService.getTemplate(templateName).subscribe({
      next: (response) => {
        this.viewingTemplate = response.data;
        this.viewTemplateModalVisible = true;
      },
      error: (error) => {
        this.message.error('Error al cargar plantilla');
        console.error(error);
      }
    });
  }

  deleteTemplate(templateName: string): void {
    this.sesService.deleteTemplate(templateName).subscribe({
      next: (response) => {
        this.message.success('Plantilla eliminada exitosamente');
        this.loadTemplates();
      },
      error: (error) => {
        this.message.error('Error al eliminar plantilla');
        console.error(error);
      }
    });
  }
}
