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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entity/User");
let UserInput = class UserInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UserInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UserInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], UserInput.prototype, "password", void 0);
UserInput = __decorate([
    type_graphql_1.InputType()
], UserInput);
let LoginUserInput = class LoginUserInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], LoginUserInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], LoginUserInput.prototype, "password", void 0);
LoginUserInput = __decorate([
    type_graphql_1.InputType()
], LoginUserInput);
let UserResolver = class UserResolver {
    singUp(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = input;
            const userIsExist = yield User_1.User.findOne({ email });
            console.log(userIsExist);
            if (userIsExist) {
                throw new Error('This email is already in use');
            }
            ;
            const salt = yield bcryptjs_1.default.genSalt();
            const hashPass = yield bcryptjs_1.default.hash(password, salt);
            try {
                const newUser = User_1.User.create(Object.assign(Object.assign({}, input), { password: hashPass }));
                yield newUser.save();
                return "User created";
            }
            catch (error) {
                throw error;
            }
        });
    }
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = input;
            const userIsExist = yield User_1.User.findOne({ email });
            if (!userIsExist) {
                throw new Error('This user is not registered');
            }
            ;
            const userIsValidate = yield bcryptjs_1.default.compare(password, userIsExist.password);
            if (!userIsValidate) {
                throw new Error('Password is incorrect');
            }
            try {
                const { userID, name, email } = userIsExist;
                const token = jsonwebtoken_1.default.sign({ userID, name, email }, 'secret', { expiresIn: '24h' });
                return token;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('input', () => UserInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "singUp", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('input', () => LoginUserInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginUserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
