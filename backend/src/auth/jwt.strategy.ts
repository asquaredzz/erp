import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.headers) return null;
        const h = req.headers['authorization'] as string;
        if (!h) return null;
        const parts = h.split(' ');
        return parts.length === 2 ? parts[1] : null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'changeme'
    });
  }

  // Enrich the validated user with DB roles for RBAC checks
  async validate(payload: any) {
    const userId = payload.sub;
    try {
      const user = await this.dataSource.query('SELECT id, email, display_name FROM users WHERE id = $1', [userId]);
      const roles = await this.dataSource.query(
        'SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1',
        [userId]
      );
      const roleNames = Array.isArray(roles) ? roles.map((r: any) => r.name) : [];
      const u = user && user[0] ? user[0] : { id: userId, email: payload.email };
      return { id: u.id, email: u.email, display_name: u.display_name, roles: roleNames };
    } catch (err) {
      return { id: userId, email: payload.email, roles: [] };
    }
  }
}
