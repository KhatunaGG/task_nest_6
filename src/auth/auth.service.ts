import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userServices: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  getAllUsers() {
    return this.userServices.findAll();
  }

  async signUp(createUserDto: CreateUserDto) {
    const { name, email, password, userImageUrl} = createUserDto;
    const user = await this.userServices.findOne({ email });
    if (user) throw new BadRequestException('User already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userServices.create({ name, email, password: hashedPassword, userImageUrl});
    return { success: true, message: 'User registered successfully' };


  }

  async signIn(signInDto: SignInDto) {
    const { email, password, rememberMe, userImageUrl } = signInDto;
    const user = await this.userServices.findByEmail({ email });
    if (!user) throw new BadRequestException('Invalid credentials');
    const isPasswordsEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordsEqual) throw new BadRequestException('Invalid credentials');

    const payLoad = {
      sub: user._id,
    };
    const expire = rememberMe ? '7d' : '1h';

    return {
      accessToken: await this.jwtService.signAsync(payLoad, {
        expiresIn: expire,
      }),
    };
  }

  async getCurrentUser(req) {
    const id = req.userId;
    const currentUser = await this.userServices.getById(id);
    return currentUser;
  }


 

  findById(id: string) {
    return  this.userServices.getById(id).populate('expenses');
  }


  
  async updateCurrentUser(id: string, updateUserDto: UpdateUserDto, file?: Express.Multer.File) {
    return this.userServices.update(id, updateUserDto, file);
  }


}


