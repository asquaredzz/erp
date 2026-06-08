"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("./user.service");
const jwt_strategy_1 = require("./jwt.strategy");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const role_entity_1 = require("./role.entity");
const permission_entity_1 = require("./permission.entity");
const role_permission_entity_1 = require("./role-permission.entity");
const user_role_entity_1 = require("./user-role.entity");
const roles_guard_1 = require("./roles.guard");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const core_1 = require("@nestjs/core");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'changeme',
                signOptions: { expiresIn: '12h' }
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, role_entity_1.Role, permission_entity_1.Permission, role_permission_entity_1.RolePermission, user_role_entity_1.UserRole])
        ],
        controllers: [require('./auth.controller').AuthController, require('./roles.controller').RolesController, require('./permissions.controller').PermissionsController],
        providers: [auth_service_1.AuthService, user_service_1.UserService, jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard, jwt_auth_guard_1.JwtAuthGuard, core_1.Reflector, require('./roles.service').RolesService, require('./permissions.service').PermissionsService],
        exports: [auth_service_1.AuthService, user_service_1.UserService, roles_guard_1.RolesGuard, jwt_auth_guard_1.JwtAuthGuard]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map