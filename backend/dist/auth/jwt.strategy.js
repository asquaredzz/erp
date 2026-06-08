"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(dataSource) {
        super({
            jwtFromRequest: (req) => {
                if (!req || !req.headers)
                    return null;
                const h = req.headers['authorization'];
                if (!h)
                    return null;
                const parts = h.split(' ');
                return parts.length === 2 ? parts[1] : null;
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'changeme'
        });
        this.dataSource = dataSource;
    }
    async validate(payload) {
        const userId = payload.sub;
        try {
            const user = await this.dataSource.query('SELECT id, email, display_name FROM users WHERE id = $1', [userId]);
            const roles = await this.dataSource.query('SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1', [userId]);
            const roleNames = Array.isArray(roles) ? roles.map((r) => r.name) : [];
            const u = user && user[0] ? user[0] : { id: userId, email: payload.email };
            return { id: u.id, email: u.email, display_name: u.display_name, roles: roleNames };
        }
        catch (err) {
            return { id: userId, email: payload.email, roles: [] };
        }
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map