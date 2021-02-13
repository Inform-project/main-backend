import { IsNumber, IsString, Length } from "class-validator";

export class CreatePostDto {
    @IsString()
    @Length(1, 80)
    title: string;

    @IsString()
    description: string;
}

export class UpdatePostDto extends CreatePostDto {
    @IsNumber()
    id: number;
}