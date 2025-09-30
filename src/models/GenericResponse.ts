export interface GenericResponse<T> {
  success: boolean;
  message: string | null;
  result: T | null;
  responseCode?: string | null;
  errorList?: string[] | null;
}
