import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private downloadJsonSubject = new Subject<boolean>();

  public get downloadJson(): Observable<boolean> {
    return this.downloadJsonSubject.asObservable();
  }

  /**
   * triggerDownloadSubject
   * @param value boolean
   */
  public triggerDownloadSubject(value: boolean): void {
    this.downloadJsonSubject.next(value);
  }

  /**
   * downloadDataAsJson
   * @param data T
   * @param fileName string
   */
  public downloadDataAsJson<T>(data: T, fileName = 'filename') {
    // Convert data to JSON string
    const jsonStr = JSON.stringify(data, null, 2);

    // Create a Blob
    const blob = new Blob([jsonStr], { type: 'application/json' });

    // Create a link element
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.json'; // filename
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  }
}
