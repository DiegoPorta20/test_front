import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UploadResult {
  key: string;
  url: string;
  bucket?: string;
}

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, folder?: string, userId?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    let url = `${environment.apiUrl}/s3/upload`;
    const params: string[] = [];
    
    if (folder) params.push(`folder=${folder}`);
    if (userId) params.push(`userId=${userId}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.post(url, formData);
  }

  uploadMultipleFiles(files: File[], folder?: string): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    let url = `${environment.apiUrl}/s3/upload-multiple`;
    if (folder) {
      url += `?folder=${folder}`;
    }

    return this.http.post(url, formData);
  }

  getSignedUrl(key: string, expiresIn?: number): Observable<any> {
    let url = `${environment.apiUrl}/s3/signed-url/${key}`;
    if (expiresIn) {
      url += `?expiresIn=${expiresIn}`;
    }
    return this.http.get(url);
  }

  deleteFile(key: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/s3/${key}`);
  }
}
