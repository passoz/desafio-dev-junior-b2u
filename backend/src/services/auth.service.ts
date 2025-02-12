import { CryptoService } from './crypto.service';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from '../core/dtos/create-user.dto';
import { ReadUserDto } from '../core/dtos/read-user.dto';
import { DataResponse, Status } from '../core/entities/responses.entity';
import { User } from '../core/entities/user.entity';
import { UpdateUserDto } from '../core/dtos/update-user.dto';
import { sign } from "jsonwebtoken";
import { secret } from '../tools/secret';


export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly cryptoService: CryptoService,
  ) {
    this.login = this.login.bind(this);
    this.secret = secret;
  }

  private secret: string;

  async login(email: string, password: string): Promise<DataResponse<any>> {

    try {
      const user: DataResponse<User> = await this.userRepository.findOneByEmail(email);
      const valid = await this.cryptoService.verify(password, user.data!.password);
      const token = sign({
        id: user.data?.id,
        email: user.data?.email,
        fullname: user.data?.fullname,
        role: "CUSTOMER"
      },
      this.secret,
      {
        expiresIn: 36000,
      })

      const response: DataResponse<User> = {
        status: Status.Ok,
        message: "User logged in",
        token,
        data: user.data!
      }
      return response;
    } catch (error) {
      console.log(error);
      const errorResponse: DataResponse<string> = {
        message: "Invalid email or password",
        status: Status.Error
      }
      return errorResponse;
    }
}
}