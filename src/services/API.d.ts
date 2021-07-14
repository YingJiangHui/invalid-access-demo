declare namespace API {
  export type Authority = 'user' | 'admin' | 'visitor'
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    authority?: Authority[];
    tags?: {
      key: string;
      label: string;
    }[];
    unreadCount?: number;
  }

  export interface User {
    id: number;
    username: string;
    mobile: string;
    status: number;
    lastLoginTime: Date;
    registerTime: Date;
    regMode: number;
  }
}
