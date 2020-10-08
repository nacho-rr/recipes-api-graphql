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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const User_1 = require("./User");
const Category_1 = require("./Category");
let Recipe = class Recipe extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Recipe.prototype, "recipeID", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Recipe.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Recipe.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Recipe.prototype, "ingredients", void 0);
__decorate([
    type_graphql_1.Field(() => Category_1.Category),
    typeorm_1.ManyToOne(() => Category_1.Category, category => category.recipes),
    __metadata("design:type", Category_1.Category)
], Recipe.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    typeorm_1.ManyToOne(() => User_1.User, createBy => createBy.recipes),
    __metadata("design:type", User_1.User)
], Recipe.prototype, "createBy", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", String)
], Recipe.prototype, "createAt", void 0);
Recipe = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Recipe);
exports.Recipe = Recipe;
