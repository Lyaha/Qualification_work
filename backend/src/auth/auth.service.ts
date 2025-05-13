import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../bd.models/entity/user.entity';
import { JwtPayload } from './types/jwt-payload.interface';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async validateUser(payload: JwtPayload): Promise<User> {
    const auth0Id = payload.sub;
    let email = '';
    let first_name = '';
    let last_name = '';

    let user = await this.usersRepository.findOne({
      where: { auth0_id: auth0Id },
    });
    email = user ? user.email : '';

    if (!email) {
      try {
        const response = await axios.get('https://' + process.env.AUTH0_DOMAIN + '/userinfo', {
          headers: {
            Authorization: `Bearer ${payload.__raw}`,
          },
        });

        email = response.data.email;
        first_name = response.data.given_name;
        last_name = response.data.family_name;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        throw new UnauthorizedException('Unable to retrieve email from Auth0: ' + errorMessage);
      }
    }

    if (!user) {
      user = this.usersRepository.create({
        auth0_id: auth0Id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        role: UserRole.CLIENT,
        is_active: true,
        last_login_at: new Date(Date.now()),
      });

      await this.usersRepository.save(user);
    }
    return user;
  }
}
