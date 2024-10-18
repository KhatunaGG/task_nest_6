import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const token = this.getToken(req.headers);
      if (!token) throw new UnauthorizedException();

      const payLoad = await this.jwtService.verifyAsync(token);
      req.userId = payLoad.sub;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  getToken(headers) {
    if (!headers['authorization']) return;
    const [type, token] = headers['authorization'].split(' ');
    return type === 'Bearer' ? token : null;
  }
}
