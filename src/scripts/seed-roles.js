"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path_1 = require("path");
dotenv.config({ path: path_1.default.resolve(process.cwd(), '.env') });
var mongodb_1 = require("../lib/mongodb");
var Role_1 = require("../lib/models/Role");
var permissions_1 = require("../lib/permissions");
var ROLES = [
    {
        id: 'superadmin',
        name: 'Super Admin',
        description: 'Akses penuh ke semua modul sistem.',
        permissions: Object.values(permissions_1.PERMISSIONS)
    },
    {
        id: 'admin',
        name: 'Administrator',
        description: 'Manajemen operasional harian.',
        permissions: [
            permissions_1.PERMISSIONS.REPORTS_READ, permissions_1.PERMISSIONS.REPORTS_EDIT, permissions_1.PERMISSIONS.REPORTS_VERIFY,
            permissions_1.PERMISSIONS.REPORTS_REPLY,
            permissions_1.PERMISSIONS.TASKS_READ, permissions_1.PERMISSIONS.TASKS_MANAGE,
            permissions_1.PERMISSIONS.USERS_READ, permissions_1.PERMISSIONS.USERS_MANAGE,
            permissions_1.PERMISSIONS.AUDIT_READ, permissions_1.PERMISSIONS.FINANCE_READ,
            permissions_1.PERMISSIONS.BLOG_READ, permissions_1.PERMISSIONS.BLOG_MANAGE,
            permissions_1.PERMISSIONS.MAP_READ, permissions_1.PERMISSIONS.INTEL_READ
        ]
    },
    {
        id: 'partner',
        name: 'Mitra Kerja (Satgas/K/L)',
        description: 'Akses portal khusus mitra kerja.',
        permissions: [
            permissions_1.PERMISSIONS.REPORTS_READ, permissions_1.PERMISSIONS.REPORTS_CREATE,
            permissions_1.PERMISSIONS.TASKS_READ, permissions_1.PERMISSIONS.TASKS_MANAGE,
            permissions_1.PERMISSIONS.FINANCE_READ, permissions_1.PERMISSIONS.FINANCE_MANAGE,
            permissions_1.PERMISSIONS.MAP_READ,
            permissions_1.PERMISSIONS.PORTAL_PARTNER_ACCESS
        ]
    },
    {
        id: 'operator',
        name: 'Operator',
        description: 'Input data dan verifikator dasar.',
        permissions: [
            permissions_1.PERMISSIONS.REPORTS_READ, permissions_1.PERMISSIONS.REPORTS_CREATE,
            permissions_1.PERMISSIONS.REPORTS_REPLY, permissions_1.PERMISSIONS.TASKS_READ,
            permissions_1.PERMISSIONS.BLOG_READ, permissions_1.PERMISSIONS.MAP_READ
        ]
    }
];
function seedRoles() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, ROLES_1, roleData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Starting Role Seeding...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, (0, mongodb_1.default)()];
                case 2:
                    _a.sent();
                    console.log('📡 Connected to MongoDB');
                    _i = 0, ROLES_1 = ROLES;
                    _a.label = 3;
                case 3:
                    if (!(_i < ROLES_1.length)) return [3 /*break*/, 6];
                    roleData = ROLES_1[_i];
                    console.log("\uD83D\uDEE1\uFE0F Seeding role: ".concat(roleData.name));
                    return [4 /*yield*/, Role_1.RoleModel.findOneAndUpdate({ id: roleData.id }, roleData, { upsert: true, returnDocument: 'after' })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log('✅ Roles Seeded Successfully!');
                    process.exit(0);
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('❌ Error Seeding Roles:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
seedRoles();
