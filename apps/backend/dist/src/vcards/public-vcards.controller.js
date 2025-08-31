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
exports.PublicVcardsController = void 0;
const common_1 = require("@nestjs/common");
const vcards_service_1 = require("./vcards.service");
const swagger_1 = require("@nestjs/swagger");
let PublicVcardsController = class PublicVcardsController {
    constructor(vcardsService) {
        this.vcardsService = vcardsService;
    }
    async getPublicVCard(slug) {
        const vcard = await this.vcardsService.findBySlug(slug);
        if (!vcard) {
            throw new common_1.NotFoundException('VCard not found or not published');
        }
        return vcard;
    }
};
exports.PublicVcardsController = PublicVcardsController;
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a published VCard by slug (public endpoint)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VCard retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'VCard not found or not published' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicVcardsController.prototype, "getPublicVCard", null);
exports.PublicVcardsController = PublicVcardsController = __decorate([
    (0, swagger_1.ApiTags)('public-vcards'),
    (0, common_1.Controller)('v'),
    __metadata("design:paramtypes", [vcards_service_1.VcardsService])
], PublicVcardsController);
//# sourceMappingURL=public-vcards.controller.js.map