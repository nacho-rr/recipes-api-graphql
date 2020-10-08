import { Resolver, Mutation, Query, Arg, Ctx, InputType, Field, Int, ObjectType, ID } from 'type-graphql';

import { Recipe } from '../entity/Recipe';
import { User } from '../entity/User';
import { Category } from '../entity/Category';

@InputType()
class RecipeInput {

  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;

  @Field(() => [String])
  ingredients!: string;

  @Field(() => String)
  category!: string;
}

@InputType()
class RecipeSearchInput {

  @Field(() => String, { nullable: true })
  name!: string;

  @Field(() => String, { nullable: true })
  ingredient!: string;

  @Field(() => String, { nullable: true })
  category!: string;
}

@ObjectType()
class RecipeOutput {
  
  @Field(() => ID)
  recipeID!: number;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;

  @Field(() => [String])
  ingredients!: string[];

  @Field(() => Category)
  category!: Category;

  @Field(() => User)
  createBy!: User;

  @Field(() => String)
  createAt!: string;
}


@Resolver()
export class RecipeResolver {

  @Mutation(() => String)
  async createRecipe(
    @Arg('input', () => RecipeInput) input: RecipeInput,
    @Ctx() ctx: User
  ) {
    
    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };
  
      const existingCategory = await Category.findOne({ name: input.category });
      if(!existingCategory){
        throw new Error ('Not existing category, please create it');
      };
  
      let ingredientString = '';
      for(let ingredient of input.ingredients){
        if(!ingredientString){
          ingredientString = `${ingredient}`;
        }else{
          ingredientString = `${ingredientString}, ${ingredient}`;
        };
      };
  
      const data = { ...input, ingredients: ingredientString, createBy: ctx, category: { categoryID: existingCategory.categoryID, name: existingCategory.name, createBy: existingCategory.createBy } }
  
      const newRecipe = Recipe.create(data);
      await newRecipe.save();
      return "receta";
    } catch (error) {
      throw error;
    };
  };

  @Mutation(() => String)
  async updateRecipe(
    @Arg('input', () => RecipeInput) input: RecipeInput,
    @Arg('recipeID', () => Int) recipeID: number,
    @Ctx() ctx: User
  ) {
    
    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };
      
      const recipe = await Recipe.findOne({ recipeID }, { relations: ["category", "createBy"] });
      if(!recipe){
        throw new Error ('Not existing recipe');
      };

      if(recipe.createBy.userID !== ctx.userID){
        throw new Error ('Invalid crediantial');
      };

      const existingCategory = await Category.findOne({ name: input.category });
      if(!existingCategory){
        throw new Error ('Not existing category, please create it');
      };

      let ingredientString = '';
      for(let ingredient of input.ingredients){
        if(!ingredientString){
          ingredientString = `${ingredient}`;
        }else{
          ingredientString = `${ingredientString}, ${ingredient}`;
        };
      };
  
      const newData = { ...input, ingredients: ingredientString, category: { categoryID: existingCategory.categoryID, name: existingCategory.name, createBy: existingCategory.createBy } };
      
      await Recipe.update({ recipeID }, newData);
      return "updated recipe";
    } catch (error) {
      throw error;
    };
  };

  @Mutation(() => String)
  async deleteRecipe(
    @Arg('recipeID', () => Int) recipeID: number,
    @Ctx() ctx: User
  ) {
    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };
      
      const recipe = await Recipe.findOne({recipeID}, { relations: ["category", "createBy"] });
      if(!recipe){
        throw new Error ('Not existing recipe');
      };

      if(recipe.createBy.userID !== ctx.userID){
        throw new Error ('Invalid crediantial');
      };

      await recipe.remove();
      return "deleted recipe";
    } catch (error) {
      throw error;
    };
  };

  @Query(() => [RecipeOutput])
  async getRecipes(
    @Arg('filter', () => RecipeSearchInput, { nullable: true }) filter: RecipeSearchInput,
    @Ctx() ctx: User
  ) {

    try {
      if(!ctx.userID){
        throw new Error ('Plase log in');
      };
  
      const recipes = await Recipe.find({ relations: ["category", "createBy"] });
      const filterRecipes = recipes.filter(recipe => (recipe.name.match(filter.name) && recipe.ingredients.match(filter.ingredient) && recipe.category.name.match(filter.category)));
  
      if(filterRecipes.length === 0){
        throw new Error ('There are not results');
      };
  
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
    } catch (error) {
      throw error;
    };
  };

  @Query(() => RecipeOutput)
  async getOneRecipe(
    @Arg('filter', () => RecipeSearchInput) filter: RecipeSearchInput,
    @Ctx() ctx: User
  ) {

    try {;
      if(!filter.name && !filter.category && !filter.ingredient){
        throw new Error ('It is necessary to use at least one filter');
      };

      if(!ctx.userID){
        throw new Error ('Plase log in');
      };
      
      const category = await Category.findOne({ name: filter.category });
      
      let recipe: Recipe | undefined;
      if(category){
        recipe = await Recipe.findOne({ ...filter, category: category }, { relations: ["category", "createBy"] });
      }else{
        
        if(filter.name && filter.ingredient){
          recipe = await Recipe.findOne({ name: filter.name, ingredients: filter.ingredient }, { relations: ["category", "createBy"] });
        };

        if(filter.name){
          recipe = await Recipe.findOne({ name: filter.name }, { relations: ["category", "createBy"] });
        };

        if(filter.ingredient){
          recipe = await Recipe.findOne({ ingredients: filter.ingredient }, { relations: ["category", "createBy"] });
        };
      };

      if(!recipe){
        throw new Error ('There is not result');
      };
      
      const newRecipe = new RecipeOutput();
        
      newRecipe.recipeID = recipe.recipeID;
      newRecipe.name = recipe.name;
      newRecipe.description = recipe.description;
      newRecipe.ingredients = recipe.ingredients.split(', ');
      newRecipe.category = recipe.category;
      newRecipe.createBy = recipe.createBy;
      newRecipe.createAt = recipe.createAt;

      return newRecipe;
    } catch (error) {
      throw error;
    };
  };

  @Query(() => [RecipeOutput])
  async getMyRecipes(
    @Ctx() ctx: User
  ) {
    if(!ctx.userID){
      throw new Error ('Please log in');
    };

    const recipes = await Recipe.find({ relations: ["createBy", "category"] });
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
  };
}