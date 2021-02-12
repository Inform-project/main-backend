import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UserRepository } from "./entity/user.repository";
import { SignupUserDto } from "./entity/user.dto";
import { User } from "./entity/user.entity";
import { internet, name, random } from "faker";

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserRepository],
    }).compile();

    authService = module.get(AuthService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('POST Sign up', () => {
    it('it should be create user', async () => {
      const id = random.number();
      const email = internet.email();
      const password = internet.password();
      const username = name.firstName();
      const userData: SignupUserDto = { email, password, username };
      const newUser: User = { id, email, password, username, created_at: new Date()}

      userRepository.findUserByEmail = jest.fn().mockResolvedValue(undefined);
      userRepository.findUserByUsername = jest.fn().mockResolvedValue(undefined);
      userRepository.create = jest.fn().mockResolvedValue(newUser);
      userRepository.save = jest.fn().mockResolvedValue(newUser);
      const result = await authService.signUp(userData);
      expect(result).toEqual("Sign up success");
      
      expect(userRepository.findUserByEmail).nthCalledWith(1, email);
      expect(userRepository.findUserByUsername).nthCalledWith(1, username);
      expect(userRepository.create).nthCalledWith(1, userData);
    });
  });
})