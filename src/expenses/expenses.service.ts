import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private userService: UsersService,
  ) {}


  
  async create(createExpenseDto: CreateExpenseDto, user) {
    if (!user) throw new UnauthorizedException();
    const newExpense = await this.expenseModel.create({
      ...createExpenseDto,
      user,
    });
    const usersExpensesUpdate = await this.userService.addExpenses(
      user,
      newExpense,
    );
    return usersExpensesUpdate;
  }



  findAll() {
    return this.expenseModel.find();
  }



  findOne(id) {
    return this.expenseModel.findById(id).populate('user');
  }



  async update(id, updateExpenseDto: UpdateExpenseDto, user) {
    try {
      const expense = await this.expenseModel.findById(id);
      if (!expense) throw new NotFoundException();
      return await this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }



  async remove(id: string) {
    try {
      const expense = await this.expenseModel.findById(id);
      if (!expense) throw new NotFoundException();
      return await this.expenseModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
