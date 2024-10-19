import {
  Body,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AswS3Service } from 'src/aws-s3/asw-s3.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private awsS3Service: AswS3Service,
  ) {}

  findAll() {
    return this.userModel.find();
  }

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  getById(id) {
    return this.userModel.findById(id);
  }

  findOne(query) {
    return this.userModel.findOne(query);
  }

  findByEmail(query) {
    return this.userModel.findOne(query).select('+password');
  }

  async addExpenses(user, newExpense) {
    try {
      if (!user) throw new UnauthorizedException();
      const userToUpdate = await this.userModel.findById(user);
      userToUpdate.expenses.push(newExpense);
      const updatedUsersExpensesArray = await this.userModel.findByIdAndUpdate(
        userToUpdate._id,
        userToUpdate,
        { new: true },
      );
      return updatedUsersExpensesArray;
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id,
    @Body() updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException();

      if (file) {
        const fileType = file.mimetype.split('/')[1];
        const fileName = `task9/${Date.now()}.${fileType}`;
        const uploadedImageUrl = await this.awsS3Service.uploadImage(
          fileName,
          file.buffer,
        );
        updateUserDto.userImageUrl = uploadedImageUrl;
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        { new: true },
      );
      if (!updatedUser) throw new NotFoundException('Failed to update user');
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id, path) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.userImageUrl) {
        const urlParts = user.userImageUrl.split('?');
        const pathSplitParts = urlParts[0].split('/');
        const path = pathSplitParts[pathSplitParts.length - 1];
        const imageToDelete = await this.awsS3Service.deleteImg(`task9/${path}`);
      }
      user.userImageUrl = null;
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }
}
