import { IsEmail, IsString, Length } from "class-validator";

export class SignupUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(6)
    password: string;

    @IsString()
    @Length(6, 16)
    username: string;
}