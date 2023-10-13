import { NextFunction, Request, Response } from "express";
import { RequestRedemptionQuery } from "@types";
import { filterRedemptionsByUrlParams } from "./filters";
import { getRedemptions, getRedemptionsCount } from "@services";

export const getRedemptionsList = async (
  req: Request<{}, {}, {}, RequestRedemptionQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50, sortBy = "redemptionDate", sortOrder = "desc" } = req.query;

  const searchFilter = filterRedemptionsByUrlParams(req.query);
  try {
    const redemptions = await getRedemptions(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getRedemptionsCount(searchFilter);

    return res.status(200).send({
      data: redemptions,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};
