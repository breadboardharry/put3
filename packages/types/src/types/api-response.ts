export type APIResponse<Tdata extends any = undefined> = {
    success: boolean;
    message: string;
    data: Tdata;
    errors?:
        | string
        | {
              message: string;
              rule: string;
              field: string;
          };
};
