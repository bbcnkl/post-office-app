import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { PostOffice } from "../../models/post-office.model";
import { inject } from "@angular/core";
import { PostOfficeService } from "../../services/post-office.service";
import { GetPostOfficesResponse } from "../../models/get-post-offices.response";


export const postOfficeResolver: ResolveFn<GetPostOfficesResponse | null> =
  async () => {
    const postOfficeService = inject(PostOfficeService);
    return postOfficeService.loadAllPostOffices();
  }
