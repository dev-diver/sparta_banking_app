import { ID } from "@customTypes/Id";
import { Integer } from "@customTypes/Integer";

export interface AccountRepositoryDTO {
  id: ID;
  name: string;
  balance: Integer;
}