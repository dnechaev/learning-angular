import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {}

  public list( filter: string, page: number, pageSize: number ): Observable<Page> {
    const params = new HttpParams()
      .set('filter', filter)
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this.http.get<Page>(`${environment.apiUrl}/api/users`, { params } );
  }

  public delete( userId: number ): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/users/${userId}`);
  }

}
