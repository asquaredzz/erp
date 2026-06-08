import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '12h' }
    }),
    TypeOrmModule.forFeature([User, Role, Permission, RolePermission, UserRole])
  ],
  controllers: [require('./auth.controller').AuthController, require('./roles.controller').RolesController, require('./permissions.controller').PermissionsController],
  providers: [AuthService, UserService, JwtStrategy, RolesGuard, JwtAuthGuard, Reflector, require('./roles.service').RolesService, require('./permissions.service').PermissionsService],
  exports: [AuthService, UserService, RolesGuard, JwtAuthGuard]
})
export class AuthModule {}
