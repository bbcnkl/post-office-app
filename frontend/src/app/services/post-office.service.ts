import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PostOffice } from '../models/post-office.model';
import { environment } from '../../environments/environment';
import { GetPostOfficesResponse } from '../models/get-post-offices.response';

@Injectable({
  providedIn: 'root',
})
export class PostOfficeService {
  http = inject(HttpClient);
  env = environment;

  constructor() {}

  async loadAllPostOffices(): Promise<GetPostOfficesResponse> {
    const postOffices$ = this.http.get<GetPostOfficesResponse>(
      `${this.env.apiRoot}/post-office/list`
    );
    const response = await firstValueFrom(postOffices$);
    return response;
  }

  async createPostOffice(data: Partial<PostOffice>): Promise<PostOffice> {
    const createPostOffice$ = this.http.post<PostOffice>(
      `${this.env.apiRoot}/post-office`,
      data
    );
    return firstValueFrom(createPostOffice$);
  }

  async updatePostOffice(
    changes: Partial<PostOffice>,
    id: string
  ): Promise<PostOffice> {
    const postOffice$ = this.http.put<PostOffice>(
      `${this.env.apiRoot}/post-office/${id}`,
      changes
    );
    return firstValueFrom(postOffice$);
  }

  async deletePostOffice(id: string) {
    const delete$ = this.http.delete(`${this.env.apiRoot}/post-office/${id}`);
    return firstValueFrom(delete$);
  }
}
