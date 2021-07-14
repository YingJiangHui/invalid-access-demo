import { request } from 'umi';


export async function queryCurrentUser(): Promise<any> {
  return request(`/api/users/currentUser`);
}
