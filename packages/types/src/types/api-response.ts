export type APIResponse<Tdata = any> = {
    success: boolean;
    message: string;
    data?: Tdata;
    errors?:
        | string
        | {
              message: string;
              rule: string;
              field: string;
          };
};
