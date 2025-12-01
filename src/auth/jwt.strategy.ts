/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { validateSupabaseToken } from './supabase-client'; // o arquivo acima

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (!secret) throw new Error('SUPABASE_JWT_SECRET is required');

    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = authHeader?.replace('Bearer ', '').trim();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const user = await validateSupabaseToken(token);
      return {
        uid: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (err) {
      console.error('Erro na validação do JWT:', err);
      throw err;
    }
  }
}
