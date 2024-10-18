
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;


    @IsNotEmpty()
    @IsEmail()
    @Transform(({value}) => value.toLowerCase() )
    email: string;


    @IsNotEmpty()
    @IsString()
    password: string;

    userImageUrl: string;
}

