import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { Recipe } from './Recipe';

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  categoryID!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => ID)
  @Column()
  createBy!: string;

  @Field(() => [Recipe])
  @OneToMany(() => Recipe, recipe => recipe.category)
  recipes!: Recipe[];

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createAt!: string;
}