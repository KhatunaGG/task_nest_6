import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@Req() req) {
    return this.authService.getCurrentUser(req);
  }

  @Get('users/:id')
  findById(@Param() params) {
    const { id } = params;
    return this.authService.findById(id);
  }

  @Patch('current-user')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateCurrentUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateCurrentUser(req.userId, updateUserDto, file);
  }



  @Delete('delete-image')
  @UseGuards(AuthGuard)
  deleteImage(@Req() req, @Body('path') path) {
    console.log(path, 'path from controller')



    return this.authService.deleteImage(req.userId, path);
  }
}
