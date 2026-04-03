"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
var mongoose_1 = require("mongoose");
/**
 * Model Role (Hak Akses)
 * Digunakan untuk integrasi RBSA (Role-Based Service Access)
 */
var RoleSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true }, // slug: 'admin', 'partner', etc.
    name: { type: String, required: true },
    description: { type: String, required: true },
    permissions: [{ type: String }], // Array of strings from PERMISSIONS.REPORTS_READ, etc.
}, { timestamps: true });
RoleSchema.virtual('permissionDetails', {
    ref: 'Permission',
    localField: 'permissions',
    foreignField: 'id'
});
RoleSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        if (ret._id) {
            delete ret._id;
        }
    }
});
exports.RoleModel = mongoose_1.default.models.Role || mongoose_1.default.model("Role", RoleSchema);
