import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  private logger = new Logger(`HTTP`);

  async use(req: any, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer ')) {
        const user = await this.authService.validateJwt(
          req.headers.authorization.split(' ')[1],
        );
        this.logger.log(
          `Logging HTTP request ${req.method} ${req.baseUrl} ${res.statusCode} from user ${user.userId} body: ${JSON.stringify(req.body)}`,
        );
      } else {
        const apiKey = req.headers.authorization.split(' ')[1];
        this.logger.log(
          `Logging HTTP request ${req.method} ${req.baseUrl} ${res.statusCode} body: ${JSON.stringify(req.body)}, apiKey: ${apiKey}`,
        );
      }
    } else {
      const baseUrl = req.baseUrl;
      if (baseUrl.includes('health')) {
        return next();
      }
      const showBody =
        !baseUrl.includes('login') && !baseUrl.includes('register');
      res.on('close', () => {
        this.logger.log(
          `Logging HTTP request from ${req.method} ${baseUrl} ${
            res.statusCode
          } body: ${showBody ? JSON.stringify(req.body) : 'hidden'}`,
        );
      });
    }
    next();
  }
}
