import { createCrudStore } from '@/stores/createCrudStore'
import { userService } from '@/features/users/services/userService'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/user'

export const useUserStore = createCrudStore<User, CreateUserPayload, UpdateUserPayload>(userService)
