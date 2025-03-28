export class ApiResponse {
  message!: string;
  isUserFriendly: boolean;
  data: unknown;

  constructor(
    message: string,
    data: unknown = null,
    isUserFriendly: boolean = true
  ) {
    this.message = message;
    this.data = data;
    this.isUserFriendly = isUserFriendly;
  }
}
