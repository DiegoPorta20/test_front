import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SqsMessage {
  message: string;
  delaySeconds?: number;
  messageAttributes?: Record<string, any>;
}

export interface SqsBatchMessage {
  id: string;
  message: string;
  delaySeconds?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SqsService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string, delaySeconds?: number, messageAttributes?: Record<string, any>): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sqs/send`, {
      message,
      delaySeconds,
      messageAttributes
    });
  }

  sendMessageBatch(messages: SqsBatchMessage[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sqs/send-batch`, {
      messages
    });
  }

  receiveMessages(maxMessages?: number, waitTimeSeconds?: number): Observable<any> {
    let url = `${environment.apiUrl}/sqs/receive`;
    const params: string[] = [];
    
    if (maxMessages) params.push(`maxMessages=${maxMessages}`);
    if (waitTimeSeconds) params.push(`waitTimeSeconds=${waitTimeSeconds}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get(url);
  }

  getQueueAttributes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sqs/attributes`);
  }
}
