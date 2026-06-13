import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.usersService.authenticateUser(dto);
  }

  @UseGuards(AuthGuard)
  @Post('user/verify')
  async verify(@CurrentUser() currentUser: { sub: string }) {
    return this.usersService.verifyUser(currentUser.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('user/:user_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('user_id') userId: string,
    @CurrentUser() currentUser: { sub: string },
  ) {
    await this.usersService.deleteUser(parseInt(userId, 10), currentUser.sub);
  }

  @UseGuards(AuthGuard)
  @Put('user/:user_id')
  async update(
    @Param('user_id') userId: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: { sub: string },
  ) {
    return this.usersService.updateUser(parseInt(userId, 10), dto, currentUser.sub);
  }

  @UseGuards(AuthGuard)
  @Get('user/:user_id/transactions')
  async getUserTransactions(@Param('user_id') userId: string) {
    return this.usersService.getUserTransactions(parseInt(userId, 10));
  }
}
