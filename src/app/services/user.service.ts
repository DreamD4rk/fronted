import { Injectable } from '@angular/core';
import { CreateUserDto, UpdateUserDto, User } from '../models/user';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];

  private url: string = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  findAllPageable(page: number): Observable<any> {
    return this.http.get<any>(`${this.url}/page/${page}`);
  }

  findById(idUser: number): Observable<User | undefined> {
    return this.http.get<User>(`${this.url}/${idUser}`)
  }

  create(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.url, dto);
  }

  update(idUser: number, dto: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.url}/${idUser}`, dto);
  }

}


