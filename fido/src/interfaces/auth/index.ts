import {Mutation, Resolver} from "@nestjs/graphql";
import {AuthService, IUser} from "../../core/services/authorization";
import {Inject} from "@nestjs/common";


@Resolver()
export class AuthResolver {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService
    ) {}


    @Mutation()
    async login(userDto: IUser) {
        await this.authService.authenticateUser(userDto)
    }

}
