import { AuthController } from "@/lib/controllers/AuthController"
import { BalanceController } from "@/lib/controllers/BalanceController"
import { DashboardController } from "@/lib/controllers/DashboardController"
import { ExpenseController } from "@/lib/controllers/ExpenseController"
import { GroupController } from "@/lib/controllers/GroupController"
import { SettlementController } from "@/lib/controllers/SettlementController"
import { UserController } from "@/lib/controllers/UserController"
import { ExpenseRepository } from "@/lib/repositories/ExpenseRepository"
import { GroupMemberRepository } from "@/lib/repositories/GroupMemberRepository"
import { GroupRepository } from "@/lib/repositories/GroupRepository"
import { SettlementRepository } from "@/lib/repositories/SettlementRepository"
import { SplitRepository } from "@/lib/repositories/SplitRepository"
import { UserRepository } from "@/lib/repositories/UserRepository"
import { AuthService } from "@/lib/services/AuthService"
import { BalanceService } from "@/lib/services/BalanceService"
import { DashboardService } from "@/lib/services/DashboardService"
import { ExpenseService } from "@/lib/services/ExpenseService"
import { GroupService } from "@/lib/services/GroupService"
import { SettlementService } from "@/lib/services/SettlementService"
import { SplitService } from "@/lib/services/SplitService"
import { UserService } from "@/lib/services/UserService"

const userRepository = new UserRepository()
const groupRepository = new GroupRepository()
const groupMemberRepository = new GroupMemberRepository()
const expenseRepository = new ExpenseRepository()
const settlementRepository = new SettlementRepository()
const splitRepository = new SplitRepository()

const splitService = new SplitService()
const authService = new AuthService(userRepository)
const groupService = new GroupService(groupRepository, groupMemberRepository, userRepository)
const expenseService = new ExpenseService(expenseRepository, groupMemberRepository, splitService)
const balanceService = new BalanceService(groupRepository, groupMemberRepository, expenseRepository, settlementRepository)
const settlementService = new SettlementService(settlementRepository, groupMemberRepository)
const dashboardService = new DashboardService(groupRepository, expenseRepository, splitRepository)
const userService = new UserService(userRepository)

export const authController = new AuthController(authService)
export const groupController = new GroupController(groupService)
export const expenseController = new ExpenseController(expenseService)
export const balanceController = new BalanceController(balanceService)
export const settlementController = new SettlementController(settlementService)
export const dashboardController = new DashboardController(dashboardService)
export const userController = new UserController(userService)
