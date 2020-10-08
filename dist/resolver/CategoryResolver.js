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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../entity/Category");
const User_1 = require("../entity/User");
let CategoryInput = class CategoryInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], CategoryInput.prototype, "name", void 0);
CategoryInput = __decorate([
    type_graphql_1.InputType()
], CategoryInput);
let CategoryResolver = class CategoryResolver {
    createCategory(input, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const existingCategory = yield Category_1.Category.findOne({ name: input.name });
                if (existingCategory) {
                    throw new Error('This category already existing');
                }
                ;
                const data = Object.assign(Object.assign({}, input), { createBy: ctx.userID });
                const newRecipe = Category_1.Category.create(data);
                yield newRecipe.save();
                return "created category";
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    updateCategory(categoryID, input, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const existingCategory = yield Category_1.Category.findOne({ categoryID });
                if (!existingCategory) {
                    throw new Error('Not existing category');
                }
                ;
                if (existingCategory.createBy !== ctx.userID) {
                    throw new Error('Invalid crediantial');
                }
                ;
                yield Category_1.Category.update({ categoryID }, input);
                return "created category";
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    deleteCategory(categoryID, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const existingCategory = yield Category_1.Category.findOne({ categoryID });
                if (!existingCategory) {
                    throw new Error('Not existing category');
                }
                ;
                if (existingCategory.createBy !== ctx.userID) {
                    throw new Error('Invalid crediantial');
                }
                ;
                yield existingCategory.remove();
                return "created category";
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    getCategories(filter, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const categories = yield Category_1.Category.find({ relations: ["recipes"] });
                const filterCategories = categories.filter(category => category.name.match(filter.name));
                if (filterCategories.length === 0) {
                    throw new Error('There are not results');
                }
                ;
                return filterCategories;
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    getOneCategory(filter, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const category = yield Category_1.Category.findOne(filter, { relations: ["recipes"] });
                if (!category) {
                    throw new Error('Not existing category');
                }
                ;
                return category;
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
};
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('input', () => CategoryInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryInput,
        User_1.User]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('categoryID', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg('input', () => CategoryInput)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CategoryInput,
        User_1.User]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCategory", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('categoryID', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, User_1.User]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
__decorate([
    type_graphql_1.Query(() => [Category_1.Category]),
    __param(0, type_graphql_1.Arg('filter', () => CategoryInput, { nullable: true })),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryInput,
        User_1.User]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getCategories", null);
__decorate([
    type_graphql_1.Query(() => Category_1.Category),
    __param(0, type_graphql_1.Arg('filter', () => CategoryInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryInput,
        User_1.User]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getOneCategory", null);
CategoryResolver = __decorate([
    type_graphql_1.Resolver()
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
