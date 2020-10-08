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
exports.RecipeResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Recipe_1 = require("../entity/Recipe");
const User_1 = require("../entity/User");
const Category_1 = require("../entity/Category");
let RecipeInput = class RecipeInput {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], RecipeInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], RecipeInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    __metadata("design:type", String)
], RecipeInput.prototype, "ingredients", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], RecipeInput.prototype, "category", void 0);
RecipeInput = __decorate([
    type_graphql_1.InputType()
], RecipeInput);
let RecipeSearchInput = class RecipeSearchInput {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RecipeSearchInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RecipeSearchInput.prototype, "ingredient", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RecipeSearchInput.prototype, "category", void 0);
RecipeSearchInput = __decorate([
    type_graphql_1.InputType()
], RecipeSearchInput);
let RecipeOutput = class RecipeOutput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", Number)
], RecipeOutput.prototype, "recipeID", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], RecipeOutput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], RecipeOutput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => [String]),
    __metadata("design:type", Array)
], RecipeOutput.prototype, "ingredients", void 0);
__decorate([
    type_graphql_1.Field(() => Category_1.Category),
    __metadata("design:type", Category_1.Category)
], RecipeOutput.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User),
    __metadata("design:type", User_1.User)
], RecipeOutput.prototype, "createBy", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], RecipeOutput.prototype, "createAt", void 0);
RecipeOutput = __decorate([
    type_graphql_1.ObjectType()
], RecipeOutput);
let RecipeResolver = class RecipeResolver {
    createRecipe(input, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const existingCategory = yield Category_1.Category.findOne({ name: input.category });
                if (!existingCategory) {
                    throw new Error('Not existing category, please create it');
                }
                ;
                let ingredientString = '';
                for (let ingredient of input.ingredients) {
                    if (!ingredientString) {
                        ingredientString = `${ingredient}`;
                    }
                    else {
                        ingredientString = `${ingredientString}, ${ingredient}`;
                    }
                    ;
                }
                ;
                const data = Object.assign(Object.assign({}, input), { ingredients: ingredientString, createBy: ctx, category: { categoryID: existingCategory.categoryID, name: existingCategory.name, createBy: existingCategory.createBy } });
                const newRecipe = Recipe_1.Recipe.create(data);
                yield newRecipe.save();
                return "receta";
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    updateRecipe(input, recipeID, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const recipe = yield Recipe_1.Recipe.findOne({ recipeID }, { relations: ["category", "createBy"] });
                if (!recipe) {
                    throw new Error('Not existing recipe');
                }
                ;
                if (recipe.createBy.userID !== ctx.userID) {
                    throw new Error('Invalid crediantial');
                }
                ;
                const existingCategory = yield Category_1.Category.findOne({ name: input.category });
                if (!existingCategory) {
                    throw new Error('Not existing category, please create it');
                }
                ;
                let ingredientString = '';
                for (let ingredient of input.ingredients) {
                    if (!ingredientString) {
                        ingredientString = `${ingredient}`;
                    }
                    else {
                        ingredientString = `${ingredientString}, ${ingredient}`;
                    }
                    ;
                }
                ;
                const newData = Object.assign(Object.assign({}, input), { ingredients: ingredientString, category: { categoryID: existingCategory.categoryID, name: existingCategory.name, createBy: existingCategory.createBy } });
                yield Recipe_1.Recipe.update({ recipeID }, newData);
                return "updated recipe";
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    deleteRecipe(recipeID, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Please log in');
                }
                ;
                const recipe = yield Recipe_1.Recipe.findOne({ recipeID }, { relations: ["category", "createBy"] });
                if (!recipe) {
                    throw new Error('Not existing recipe');
                }
                ;
                if (recipe.createBy.userID !== ctx.userID) {
                    throw new Error('Invalid crediantial');
                }
                ;
                yield recipe.remove();
                return "deleted recipe";
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    getRecipes(filter, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ctx.userID) {
                    throw new Error('Plase log in');
                }
                ;
                const recipes = yield Recipe_1.Recipe.find({ relations: ["category", "createBy"] });
                const filterRecipes = recipes.filter(recipe => (recipe.name.match(filter.name) && recipe.ingredients.match(filter.ingredient) && recipe.category.name.match(filter.category)));
                if (filterRecipes.length === 0) {
                    throw new Error('There are not results');
                }
                ;
                let output = [];
                output = filterRecipes.map(recipe => {
                    const newRecipe = new RecipeOutput();
                    newRecipe.recipeID = recipe.recipeID;
                    newRecipe.name = recipe.name;
                    newRecipe.description = recipe.description;
                    newRecipe.ingredients = recipe.ingredients.split(', ');
                    newRecipe.category = recipe.category;
                    newRecipe.createBy = recipe.createBy;
                    newRecipe.createAt = recipe.createAt;
                    return newRecipe;
                });
                return output;
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    getOneRecipe(filter, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ;
                if (!filter.name && !filter.category && !filter.ingredient) {
                    throw new Error('It is necessary to use at least one filter');
                }
                ;
                if (!ctx.userID) {
                    throw new Error('Plase log in');
                }
                ;
                const category = yield Category_1.Category.findOne({ name: filter.category });
                let recipe;
                if (category) {
                    recipe = yield Recipe_1.Recipe.findOne(Object.assign(Object.assign({}, filter), { category: category }), { relations: ["category", "createBy"] });
                }
                else {
                    if (filter.name && filter.ingredient) {
                        recipe = yield Recipe_1.Recipe.findOne({ name: filter.name, ingredients: filter.ingredient }, { relations: ["category", "createBy"] });
                    }
                    ;
                    if (filter.name) {
                        recipe = yield Recipe_1.Recipe.findOne({ name: filter.name }, { relations: ["category", "createBy"] });
                    }
                    ;
                    if (filter.ingredient) {
                        recipe = yield Recipe_1.Recipe.findOne({ ingredients: filter.ingredient }, { relations: ["category", "createBy"] });
                    }
                    ;
                }
                ;
                if (!recipe) {
                    throw new Error('There is not result');
                }
                ;
                const newRecipe = new RecipeOutput();
                newRecipe.recipeID = recipe.recipeID;
                newRecipe.name = recipe.name;
                newRecipe.description = recipe.description;
                newRecipe.ingredients = recipe.ingredients.split(', ');
                newRecipe.category = recipe.category;
                newRecipe.createBy = recipe.createBy;
                newRecipe.createAt = recipe.createAt;
                return newRecipe;
            }
            catch (error) {
                throw error;
            }
            ;
        });
    }
    ;
    getMyRecipes(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ctx.userID) {
                throw new Error('Please log in');
            }
            ;
            const recipes = yield Recipe_1.Recipe.find({ relations: ["createBy", "category"] });
            const filterRecipes = recipes.filter(recipe => recipe.createBy.userID === ctx.userID);
            let RecipesOutput = [];
            RecipesOutput = filterRecipes.map(recipe => {
                const newRecipe = new RecipeOutput();
                newRecipe.recipeID = recipe.recipeID;
                newRecipe.name = recipe.name;
                newRecipe.description = recipe.description;
                newRecipe.ingredients = recipe.ingredients.split(', ');
                newRecipe.category = recipe.category;
                newRecipe.createBy = recipe.createBy;
                newRecipe.createAt = recipe.createAt;
                return newRecipe;
            });
            return RecipesOutput;
        });
    }
    ;
};
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('input', () => RecipeInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecipeInput,
        User_1.User]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "createRecipe", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('input', () => RecipeInput)),
    __param(1, type_graphql_1.Arg('recipeID', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecipeInput, Number, User_1.User]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "updateRecipe", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('recipeID', () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, User_1.User]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "deleteRecipe", null);
__decorate([
    type_graphql_1.Query(() => [RecipeOutput]),
    __param(0, type_graphql_1.Arg('filter', () => RecipeSearchInput, { nullable: true })),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecipeSearchInput,
        User_1.User]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getRecipes", null);
__decorate([
    type_graphql_1.Query(() => RecipeOutput),
    __param(0, type_graphql_1.Arg('filter', () => RecipeSearchInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecipeSearchInput,
        User_1.User]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getOneRecipe", null);
__decorate([
    type_graphql_1.Query(() => [RecipeOutput]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getMyRecipes", null);
RecipeResolver = __decorate([
    type_graphql_1.Resolver()
], RecipeResolver);
exports.RecipeResolver = RecipeResolver;
