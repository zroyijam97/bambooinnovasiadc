"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVCardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_vcard_dto_1 = require("./create-vcard.dto");
class UpdateVCardDto extends (0, swagger_1.PartialType)(create_vcard_dto_1.CreateVCardDto) {
}
exports.UpdateVCardDto = UpdateVCardDto;
//# sourceMappingURL=update-vcard.dto.js.map