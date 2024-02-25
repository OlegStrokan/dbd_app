import {TestingModule} from "@nestjs/testing";
import {clearRepos} from "../../../../infrastructure/common/config/clear.config";
import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {AuthService, IUser} from "../index";


describe('AuthRepository', () => {
    let module: TestingModule
    let authService: AuthService

    beforeAll( async () => {
        module = await createDbTestingModule();
        authService = module.get<AuthService>(AuthService);

    })

    beforeEach(async () => {
    })

    afterAll( async () => {
        await clearRepos(module)
        await module.close()
    })

    describe('AuthService tests', () => {
        const testUser: IUser = {
            name: 'stroka01',
            password: '258120Oleg!',
        };

        it('should authorize user', async () => {
           const result = await authService.authenticateUser(testUser)
            expect(result).toBeDefined()
        })
    })
})
