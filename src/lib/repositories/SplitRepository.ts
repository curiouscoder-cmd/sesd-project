import { BaseRepository } from "./BaseRepository"

export class SplitRepository extends BaseRepository {
  getTotalOwedByUser(userId: number, groupIds: number[]) {
    return this.prisma.split.aggregate({
      where: {
        owesId: userId,
        expense: {
          groupId: {
            in: groupIds,
          },
        },
      },
      _sum: {
        amount: true,
      },
    })
  }
}
