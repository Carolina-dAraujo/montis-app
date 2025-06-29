import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";

describe("UsersController", () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUsersService = {
        registerUser: jest.fn(),
        loginUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("register", () => {
        it("should register a new user", async () => {
            const registerDto: RegisterUserDto = {
                email: "test@example.com",
                password: "password123",
            };

            const expectedResponse = {
                token: "mock-token",
                user: {
                    uid: "mock-uid",
                    email: "test@example.com",
                    displayName: "test",
                },
                message: "User registered successfully",
            };

            mockUsersService.registerUser.mockResolvedValue(expectedResponse);

            const result = await controller.register(registerDto);

            expect(result).toEqual(expectedResponse);
            expect(service.registerUser).toHaveBeenCalledWith(registerDto);
        });
    });

    describe("login", () => {
        it("should login a user", async () => {
            const loginDto: LoginUserDto = {
                email: "test@example.com",
                password: "password123",
            };

            const expectedResponse = {
                token: "mock-token",
                user: {
                    uid: "mock-uid",
                    email: "test@example.com",
                    displayName: "test",
                },
                message: "Login successful",
            };

            mockUsersService.loginUser.mockResolvedValue(expectedResponse);

            const result = await controller.login(loginDto);

            expect(result).toEqual(expectedResponse);
            expect(service.loginUser).toHaveBeenCalledWith(loginDto);
        });
    });
});
