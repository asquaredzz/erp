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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const user_service_1 = require("./user.service");
let AuthService = class AuthService {
    constructor(jwt, userRepo, userSvc) {
        this.jwt = jwt;
        this.userRepo = userRepo;
        this.userSvc = userSvc;
    }
    async validateUser(email, password) {
        const user = await this.userSvc.findByEmail(email);
        if (!user)
            return null;
        const ok = await this.userSvc.verifyPassword(user, password);
        if (!ok)
            return null;
        return user;
    }
    async login(user) {
        const payload = { sub: user.id, email: user.email };
        return { access_token: this.jwt.sign(payload) };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService, typeorm_2.Repository, user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map