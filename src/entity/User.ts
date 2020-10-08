import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { Recipe } from './Recipe';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  userID!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Field(() => [Recipe])
  @OneToMany(() => Recipe, recipe => recipe.createBy)
  recipes!: Recipe[];

  @Field(() => String)
  @CreateDateColumn({ type: 'timestamp' })
  createAt!: string;
}