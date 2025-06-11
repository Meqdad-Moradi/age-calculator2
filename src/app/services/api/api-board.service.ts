import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ErrorResponse } from '../../components/models/error-response.model';
import { Board } from '../../components/models/task-manager';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root',
})
export class ApiBoardService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly baseUrl = 'http://localhost:3000/boards';

  /**
   * getBoards
   * @returns Observable<Board[]>
   */
  public getBoards(): Observable<Board[] | ErrorResponse<string>> {
    return this.http.get<Board[]>(this.baseUrl).pipe(
      catchError(
        this.errorService.handleError<Board[]>('api-board.service::getBoards', {
          showInDialog: true,
        })
      )
    );
  }

  /**
   * createNewBoard
   * @param value Board
   * @returns Observable<Board>
   */
  public createNewBoard(
    value: Board
  ): Observable<Board | ErrorResponse<string>> {
    return this.http.post<Board>(this.baseUrl, value).pipe(
      catchError(
        this.errorService.handleError<Board>(
          'api-board.service::createNewBoard',
          {
            showInDialog: true,
          }
        )
      )
    );
  }

  /**
   * deleteBoard
   * @param boardId string
   * @returns Observable<Board>
   */
  public deleteBoard(
    boardId: string
  ): Observable<Board | ErrorResponse<string>> {
    return this.http.delete<Board>(this.baseUrl + '/' + boardId).pipe(
      catchError(
        this.errorService.handleError<Board>('api-board.service::deleteBoard', {
          showInDialog: true,
        })
      )
    );
  }
}
