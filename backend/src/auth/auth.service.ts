import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/entity/user.entity'; // Якщо є така ентіті
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Перевірка, чи користувач вже є у БД, і створення, якщо ні
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    const auth0Id = payload.sub;
    const email = payload.email;

    let user = await this.usersRepository.findOne({ where: { auth0_id: auth0Id } });

    if (!user) {
      user = this.usersRepository.create({
        auth0_id: auth0Id,
        email: email,
        role: payload['https://yourapp.com/roles'] || ['client'],
        is_active: true,
      });

      await this.usersRepository.save(user);
    }

    return user;
  }
}
