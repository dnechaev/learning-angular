import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Page } from '../core/page.model';
import { User, UserAdapter } from '../core/user.model';
import { URL_API_USERS } from '../core/consts';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl: string = URL_API_USERS;

  constructor(
    private http: HttpClient,
    private adapter: UserAdapter
  ) {}

  getUsers( where: object, order: object, page: number, pageSize: number ): Observable<Page> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('where', JSON.stringify(where))
      .set('order', JSON.stringify(order));

    return this.http.get<Page>(this.baseUrl, { params } ).pipe(
      map((p: Page) => {
        p.rows = p.rows.map(item => this.adapter.input(item));
        return p;
      }),
    );
  }

  getUserById( userId: number ): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + userId ).pipe(
      map((u) => this.adapter.input(u))
    );
  }

  createUser( user: User ): Observable<User> {
    return this.http.post<User>(this.baseUrl, this.adapter.output(user)).pipe(
      map((u) => this.adapter.input(u))
    );
  }

  updateUser( userId: number, user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/' + userId, this.adapter.output(user)).pipe(
      map((u) => this.adapter.input(u))
    );
  }

  deleteUser( userId: number ): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + userId);
  }

}
