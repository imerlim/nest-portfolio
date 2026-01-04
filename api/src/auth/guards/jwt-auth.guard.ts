import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// By extending AuthGuard('jwt'), it automatically looks for 'JwtStrategy'
export class JwtAuthGuard extends AuthGuard('jwt') {}
