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
exports.VcardsController = void 0;
const common_1 = require("@nestjs/common");
const vcards_service_1 = require("./vcards.service");
const create_vcard_dto_1 = require("./dto/create-vcard.dto");
const update_vcard_dto_1 = require("./dto/update-vcard.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let VcardsController = class VcardsController {
    constructor(vcardsService) {
        this.vcardsService = vcardsService;
    }
    async create(createVCardDto, req) {
        try {
            const organizationId = req.user.organizationId;
            return await this.vcardsService.create(createVCardDto, organizationId);
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('A card with this slug already exists');
            }
            throw error;
        }
    }
    async findAll(req, status, slug) {
        const organizationId = req.user.organizationId;
        if (slug) {
            const existingVCard = await this.vcardsService.findBySlugInOrganization(slug, organizationId);
            if (existingVCard) {
                return { available: false };
            }
            else {
                throw new common_1.NotFoundException('Slug not found');
            }
        }
        return await this.vcardsService.findAll(organizationId, status);
    }
    async findOne(id, req) {
        const organizationId = req.user.organizationId;
        const vcard = await this.vcardsService.findOne(id, organizationId);
        if (!vcard) {
            throw new common_1.NotFoundException('VCard not found');
        }
        return vcard;
    }
    async update(id, updateVCardDto, req) {
        const organizationId = req.user.organizationId;
        try {
            return await this.vcardsService.update(id, updateVCardDto, organizationId);
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('A card with this slug already exists');
            }
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('VCard not found');
            }
            throw error;
        }
    }
    async remove(id, req) {
        const organizationId = req.user.organizationId;
        try {
            return await this.vcardsService.remove(id, organizationId);
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('VCard not found');
            }
            throw error;
        }
    }
    async publish(id, req) {
        const organizationId = req.user.organizationId;
        return await this.vcardsService.publish(id, organizationId);
    }
};
exports.VcardsController = VcardsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new VCard' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'VCard created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Slug already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vcard_dto_1.CreateVCardDto, Object]),
    __metadata("design:returntype", Promise)
], VcardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all VCards for the organization or check slug availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VCards retrieved successfully or slug exists' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Slug not found (available)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], VcardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a VCard by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VCard retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'VCard not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VcardsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a VCard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VCard updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'VCard not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vcard_dto_1.UpdateVCardDto, Object]),
    __metadata("design:returntype", Promise)
], VcardsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a VCard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VCard deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'VCard not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VcardsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish a VCard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VCard published successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'VCard not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VcardsController.prototype, "publish", null);
exports.VcardsController = VcardsController = __decorate([
    (0, swagger_1.ApiTags)('vcards'),
    (0, common_1.Controller)('vcards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [vcards_service_1.VcardsService])
], VcardsController);
//# sourceMappingURL=vcards.controller.js.map