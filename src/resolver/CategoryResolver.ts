import { Resolver, Mutation, Query, Arg, Ctx, InputType, Field, Int} from 'type-graphql';

import { Category } from '../entity/Category';
import { User } from '../entity/User';

@InputType()
class CategoryInput {
  
  @Field(() => String)
  name!: string;
}

@Resolver()
export class CategoryResolver {

  @Mutation(() => String)
  async createCategory(
    @Arg('input', () => CategoryInput) input: CategoryInput,
    @Ctx() ctx: User
  ) {

    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };
  
      const existingCategory = await Category.findOne({ name: input.name });
      if(existingCategory){
        throw new Error ('This category already existing');
      };
  
      const data = { ...input, createBy: ctx.userID }
  
      const newRecipe = Category.create(data);
      await newRecipe.save();
      return "created category";
    } catch (error) {
      throw error;
    };
  };

  @Mutation(() => String)
  async updateCategory(
    @Arg('categoryID', () => Int) categoryID: number,
    @Arg('input', () => CategoryInput) input: CategoryInput,
    @Ctx() ctx: User
  ) {

    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };
  
      const existingCategory = await Category.findOne({ categoryID });
      if(!existingCategory){
        throw new Error ('Not existing category');
      };

      if(existingCategory.createBy !== ctx.userID){
        throw new Error ('Invalid crediantial');
      };
  
      await Category.update({ categoryID }, input);
      return "created category";
    } catch (error) {
      throw error;
    };
  };

  @Mutation(() => String)
  async deleteCategory(
    @Arg('categoryID', () => Int) categoryID: number,
    @Ctx() ctx: User
  ) {

    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };
  
      const existingCategory = await Category.findOne({ categoryID });
      if(!existingCategory){
        throw new Error ('Not existing category');
      };

      if(existingCategory.createBy !== ctx.userID){
        throw new Error ('Invalid crediantial');
      };
  
      await existingCategory.remove();
      return "created category";
    } catch (error) {
      throw error;
    };
  };

  @Query(() => [Category])
  async getCategories(
    @Arg('filter', () => CategoryInput, { nullable: true }) filter: CategoryInput,
    @Ctx() ctx: User
  ) {
    
    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };

      const categories = await Category.find({ relations: ["recipes"] });
      const filterCategories = categories.filter(category => category.name.match(filter.name));

      if(filterCategories.length === 0){
        throw new Error ('There are not results');
      };

      return filterCategories;
    } catch (error) {
      throw error;
    };
  };

  @Query(() => Category)
  async getOneCategory(
    @Arg('filter', () => CategoryInput) filter: CategoryInput,
    @Ctx() ctx: User
  ) {

    try {
      if(!ctx.userID){
        throw new Error ('Please log in');
      };
  
      const category = await Category.findOne(filter, { relations: ["recipes"] });

      if(!category){
        throw new Error ('Not existing category')
      };

      return category;
    } catch (error) {
      throw error;
    };
  };
}