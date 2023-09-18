export default class TokenModel {
  private readonly token: string;
  private readonly refreshToken: string;

  public constructor(token?: string, refreshToken?: string) {
    this.token = token || '';
    this.refreshToken = refreshToken || '';
  }

  public getToken(): string {
    return this.token;
  }

  public getRefreshToken(): string {
    return this.refreshToken;
  }
}
