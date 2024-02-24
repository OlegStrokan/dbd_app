import {TestingModule} from "@nestjs/testing";
import {clearRepos} from "../../../../infrastructure/common/config/clear.config";
import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {AuthService, IUser} from "../index";


describe('RedisRepository', () => {
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

    describe('RedisService tests', () => {
        const testUser: IUser = {
            name: 'testUser',
            password: 'testPassword',
        };

        it('should', async () => {
           const result = await authService.authenticateUser(testUser)
            expect(result).toBeDefined()
        })
    })
})
