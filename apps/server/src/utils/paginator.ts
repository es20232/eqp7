import { InternalServerErrorException } from '@nestjs/common';
import { PaginationResponseDto } from 'src/dtos/paginator.dto';

export type PaginateOptions = {
  model: any;
  cursor?: number | string;
  take?: number | string;
  select?: any;
  include?: any;
};

export default async function <T>(
  options: PaginateOptions,
  args: any = { where: undefined },
  sortingArgs: any = { orderBy: undefined },
): Promise<PaginationResponseDto<T>> {
  try {
    const take = Number(options?.take) || 10;
    const model = options?.model;
    const select = options?.select;
    const include = options?.include;

    const cursor = options?.cursor ? { id: Number(options.cursor) } : undefined;
    const skip = options?.cursor ? 1 : undefined;

    const data = await model.findMany({
      ...sortingArgs,
      ...args,
      take,
      skip,
      select,
      include,
      cursor,
    });
    return {
      data,
      meta: {
        cursor: data.length > 0 ? data[data.length - 1].id : null,
        hasMore: data.length === take,
      },
    };
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException(
      'Erro interno ao realizar paginação de dados',
      error,
    );
  }
}
