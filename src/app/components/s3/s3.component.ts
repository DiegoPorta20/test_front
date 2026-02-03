import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { S3Service, UploadResult } from '../../services/s3.service';

interface UploadedFile {
  name: string;
  key: string;
  url: string;
  bucket: string;
  uploadedAt: Date;
  loadingUrl?: boolean;
  deleting?: boolean;
}

@Component({
  selector: 'app-s3',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTabsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzUploadModule,
    NzListModule,
    NzAvatarModule,
    NzEmptyModule,
    NzModalModule,
    NzIconModule
  ],
  templateUrl: './s3.component.html',
  styleUrls: ['./s3.component.scss']
})
export class S3Component {
  // Upload simple
  fileList: NzUploadFile[] = [];
  uploading = false;
  folder = '';
  userId = '';

  // Upload múltiple
  multipleFileList: NzUploadFile[] = [];
  uploadingMultiple = false;
  folderMultiple = '';

  // Archivos subidos
  uploadedFiles: UploadedFile[] = [];

  // Modal URL firmada
  signedUrlModalVisible = false;
  signedUrl = '';
  signedUrlExpiration = 3600;

  constructor(
    private s3Service: S3Service,
    private message: NzMessageService
  ) {}

  // Upload simple
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    return false;
  };

  handleRemove = (): boolean => {
    this.fileList = [];
    return true;
  };

  handleUpload(): void {
    if (this.fileList.length === 0) {
      return;
    }

    this.uploading = true;
    const file = this.fileList[0] as any;

    this.s3Service.uploadFile(file, this.folder, this.userId).subscribe({
      next: (response) => {
        this.uploading = false;
        this.message.success('Archivo subido exitosamente');

        this.uploadedFiles.unshift({
          name: file.name,
          key: response.data.key,
          url: response.data.url,
          bucket: response.data.bucket || 'N/A',
          uploadedAt: new Date()
        });

        this.fileList = [];
        this.folder = '';
        this.userId = '';
      },
      error: (error) => {
        this.uploading = false;
        this.message.error('Error al subir archivo');
        console.error(error);
      }
    });
  }

  // Upload múltiple
  beforeUploadMultiple = (file: NzUploadFile): boolean => {
    this.multipleFileList = [...this.multipleFileList, file];
    return false;
  };

  handleRemoveMultiple = (file: NzUploadFile): boolean => {
    this.multipleFileList = this.multipleFileList.filter(f => f.uid !== file.uid);
    return true;
  };

  handleUploadMultiple(): void {
    if (this.multipleFileList.length === 0) {
      return;
    }

    this.uploadingMultiple = true;
    const files = this.multipleFileList.map(f => f as any);

    this.s3Service.uploadMultipleFiles(files, this.folderMultiple).subscribe({
      next: (response) => {
        this.uploadingMultiple = false;
        this.message.success(`${response.data.length} archivos subidos exitosamente`);

        response.data.forEach((result: UploadResult, index: number) => {
          this.uploadedFiles.unshift({
            name: files[index].name,
            key: result.key,
            url: result.url,
            bucket: result.bucket || 'N/A',
            uploadedAt: new Date()
          });
        });

        this.multipleFileList = [];
        this.folderMultiple = '';
      },
      error: (error) => {
        this.uploadingMultiple = false;
        this.message.error('Error al subir archivos');
        console.error(error);
      }
    });
  }

  // Obtener URL firmada
  getSignedUrl(key: string): void {
    const file = this.uploadedFiles.find(f => f.key === key);
    if (!file) return;

    file.loadingUrl = true;

    this.s3Service.getSignedUrl(key, 3600).subscribe({
      next: (response) => {
        file.loadingUrl = false;
        this.signedUrl = response.data.url;
        this.signedUrlExpiration = response.data.expiresIn;
        this.signedUrlModalVisible = true;
      },
      error: (error) => {
        file.loadingUrl = false;
        this.message.error('Error al generar URL firmada');
        console.error(error);
      }
    });
  }

  // Eliminar archivo
  deleteFile(key: string): void {
    const file = this.uploadedFiles.find(f => f.key === key);
    if (!file) return;

    file.deleting = true;

    this.s3Service.deleteFile(key).subscribe({
      next: () => {
        file.deleting = false;
        this.message.success('Archivo eliminado exitosamente');
        this.uploadedFiles = this.uploadedFiles.filter(f => f.key !== key);
      },
      error: (error) => {
        file.deleting = false;
        this.message.error('Error al eliminar archivo');
        console.error(error);
      }
    });
  }

  // Copiar al portapapeles
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.message.success('URL copiada al portapapeles');
    });
  }

  // Abrir URL
  openUrl(url: string): void {
    window.open(url, '_blank');
  }
}
