import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, FileLogger } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { User } from './User';
import { Category } from './Category';

@ObjectType()
@Entity()
export class Recipe extends BaseEntity {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  recipeID!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  description!: string;

  @Field(() => [String])
  @Column({ type: "text" })
  ingredients!: string;

  @Field(() => Category)
  @ManyToOne(() => Category, category => category.recipes)
  category!: Category;

  @Field(() => User)
  @ManyToOne(() => User, createBy => createBy.recipes)
  createBy!: User;

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createAt!: string;
}