import { PostOffice } from "./post-office.model"

export type GetPostOfficesResponse = {
  list: PostOffice[],
  total: number
}
