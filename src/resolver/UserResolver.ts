import { Resolver, Mutation, Arg, Field, InputType } from 'type-graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../entity/User';

@InputType()
class UserInput {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string
}

@InputType()
class LoginUserInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string
}

@Resolver()
export class UserResolver {

  @Mutation(() => String)
  async singUp(
    @Arg('input', () => UserInput) input: UserInput
  ) {
    const { email, password } = input;

    const userIsExist = await User.findOne({email});
    console.log(userIsExist)
    if(userIsExist){
      throw new Error ('This email is already in use');
    };

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    try {
      const newUser = User.create({ ...input, password: hashPass });
      await newUser.save();
      return "User created" 
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => String)
  async login(
    @Arg('input', () => LoginUserInput) input: LoginUserInput
  ) {
    const { email, password } = input;
    const userIsExist = await User.findOne({email});
    if(!userIsExist){
      throw new Error ('This user is not registered');
    };

    const userIsValidate = await bcrypt.compare(password, userIsExist.password);
    if(!userIsValidate){
      throw new Error ('Password is incorrect');
    }

    try {
      const { userID, name, email } = userIsExist
      const token = jwt.sign({ userID, name, email }, 'secret', { expiresIn: '24h' });
      return token;
    } catch (error) {
      throw error;
    }
  }
}