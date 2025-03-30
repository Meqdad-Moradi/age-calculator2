import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../../components/models/task-manager';

@Injectable({
  providedIn: 'root'
})
export class ApiBoardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/boards'

  /**
   * createNewBoard
   * @param value Board
   * @returns Observable<Board>
   */
  public createNewBoard(value: Board): Observable<Board> {
    return this.http.post<Board>(this.baseUrl, value);
  }
}
