export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

export class GoogleDriveService {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isConnected(): boolean {
    return Boolean(this.accessToken);
  }

  async listFiles(folderId: string = 'root'): Promise<GoogleDriveFile[]> {
    if (!this.accessToken) {
      throw new Error('Google Drive is not connected. Please connect your Google Drive first.');
    }

    const query = `'${folderId}' in parents and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,modifiedTime,size)`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to list Google Drive files: ${res.statusText}`);
    }

    const data = await res.json();
    return data.files || [];
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.accessToken) {
      throw new Error('Google Drive is not connected.');
    }

    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to download file from Google Drive.`);
    }

    return res.blob();
  }
}

export const googleDriveService = new GoogleDriveService();
