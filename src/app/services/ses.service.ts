import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  cc?: string[];
  bcc?: string[];
  replyTo?: string[];
}

export interface TemplatedEmailOptions {
  to: string | string[];
  templateName: string;
  templateData: Record<string, any>;
  cc?: string[];
  bcc?: string[];
  replyTo?: string[];
}

export interface EmailTemplate {
  name: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SesService {
  constructor(private http: HttpClient) {}

  sendEmail(options: EmailOptions): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ses/send`, options);
  }

  sendTemplatedEmail(options: TemplatedEmailOptions): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ses/send-templated`, options);
  }

  sendBulkEmail(recipients: string[], subject: string, body: string, isHtml: boolean = true): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ses/send-bulk`, {
      recipients,
      subject,
      body,
      isHtml
    });
  }

  createTemplate(template: EmailTemplate): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ses/templates`, template);
  }

  updateTemplate(templateName: string, template: EmailTemplate): Observable<any> {
    return this.http.put(`${environment.apiUrl}/ses/templates/${templateName}`, template);
  }

  deleteTemplate(templateName: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/ses/templates/${templateName}`);
  }

  listTemplates(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/ses/templates`);
  }

  getTemplate(templateName: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/ses/templates/${templateName}`);
  }
}
